import React, { useEffect, useState } from 'react';
import xlsx from 'xlsx';
import TeacherAPI from '../../services/TeacherAPI';
import SubjectAPI from './../../services/SubjectAPI';
import MockData from './../../../mockAPI.json';
import SlotAPI from './../../services/SlotAPI';


function StudentPage() {

    const [sheet, setSheet] = useState([]);
    const [teacher, setTeacher] = useState([]);
    const [table, setTable] = useState([]);
    const handleFile = async (e) => {
        const file = e.target.files[0];
        // const promise = new Promise((resolve,reject) => {
        const fileRender = new FileReader();
        fileRender.readAsArrayBuffer(file);
        fileRender.onload = (e) => {
            const bufferArr = e.target.result;
            const wb = xlsx.read(bufferArr, { type: "buffer" });
            // const wsname = wb.SheetNames[7];
            const ws = wb.Sheets['Sheet1'];
            const data = xlsx.utils.sheet_to_json(ws);
            console.log(data);
        }
        // })
        // const data = await promise;
        // console.log(data);

    }

    const to_slug = (str) => {
        // Chuyển hết sang chữ thường
        str = str.toLowerCase();

        // xóa dấu
        str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
        str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
        str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
        str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
        str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
        str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
        str = str.replace(/(đ)/g, 'd');

        // Xóa ký tự đặc biệt
        str = str.replace(/([^0-9a-z-\s])/g, '');

        // Xóa khoảng trắng thay bằng ký tự -
        str = str.replace(/(\s+)/g, '_');

        // xóa phần dự - ở đầu
        str = str.replace(/^-+/g, '');

        // xóa phần dư - ở cuối
        str = str.replace(/-+$/g, '');

        // return
        return str;
    }

    const [subject, setSubject] = useState({
        name: '',
        subjectCode: ''
    })

    useEffect(() => {
        const findAll = async () => {
            const { data: teacher } = await TeacherAPI.findAll();
            const upDateTeacher = teacher.map(async (field) => {
                const res = await Promise.all(field.slots.map(item => SlotAPI.findOne(item)));
                const resFilter = res.map(field => field.data);
                field.slots = resFilter;
                return field;
            })
            const data = await Promise.all(upDateTeacher.map(item => item));
            setTeacher(data);
        }
        findAll();
        const slugKeySheet = MockData.Sheet1.map(item => {
            const objectItem = {};
            const data = Object.keys(item).map(item => to_slug(item));
            const keyDefault = Object.keys(item).map(item => item);
            data.forEach((itemSlug, key) => { objectItem[itemSlug] = item[keyDefault[key]] })
            return objectItem;
        })
        setSheet(slugKeySheet);
    }, []);

    const onPost = async () => {
        try {
            const data = await SubjectAPI.create(subject);
            console.log(data);
        } catch (error) {
            console.log(error.message)
        }
    }

    const onSumbit = () => {
        const BM_CNTT = sheet.filter(field => field.bo_mon.toLowerCase() === "CNTT".toLowerCase());
        const CHUYEN_NGANH = [];
        //remove duplicate field 
        BM_CNTT.forEach(field => {
            if (CHUYEN_NGANH.indexOf(field.nganh) === -1) CHUYEN_NGANH.push(field.nganh)
        });
        // console.log(CHUYEN_NGANH);
        const FILTER_CHUYEN_NGANH = CHUYEN_NGANH.map(field1 => {
            const VITRUAL_ARR = { chuyen_nganh: field1, classes: [] }
            BM_CNTT.forEach(field2 => {
                if (field1.toLowerCase() === field2.nganh.toLowerCase()) {
                    VITRUAL_ARR.classes.push(field2);
                }
            })
            return VITRUAL_ARR;
        })
        //sắp xếp giảng viên theo thứ tự ưu tiên ai dạy được nhiều môn hơn
        const SORT_TEACHER = teacher.sort((a, b) => b.skills.length - a.skills.length);
        //sắp xếp các giảng viên có thể dạy được môn nào
        const XEP_GIANG_VIEN = FILTER_CHUYEN_NGANH.map(field => {
            field.classes.forEach(field1 => {
                const VITRUAL_ARR = [];
                SORT_TEACHER.forEach(teacher => {
                    teacher.skills.forEach(skill => {
                        if (skill.toLowerCase() === field1.ma_mon.toLowerCase()) VITRUAL_ARR.push({ name: teacher.name, _id: teacher._id })
                    })
                })
                const teacherRandom = Math.floor(Math.random() * VITRUAL_ARR.length);
                if (VITRUAL_ARR.length > 0) {
                    field1.giang_vien = VITRUAL_ARR[teacherRandom].name;
                    field1.id_giang_vien = VITRUAL_ARR[teacherRandom]._id;
                }
            });
            return field;
        });
        //check xem bao nhiêu lớp chưa có giảng viên dạy và tách block
        XEP_GIANG_VIEN.forEach(field => {
            const LOP_CO_GIANG_VIEN = field.classes.filter(field1 => field1.giang_vien);
            const LOP_KHONG_CO_GIANG_VIEN = field.classes.filter(field1 => !field1.giang_vien);
            field.block_1 = LOP_CO_GIANG_VIEN.filter(field1 => field1.block == "1");
            field.block_2 = LOP_CO_GIANG_VIEN.filter(field1 => field1.block == "2");
            // field.classes = LOP_CO_GIANG_VIEN;
            field.emptyClasses = `${LOP_KHONG_CO_GIANG_VIEN.length} lớp chưa có giảng viên dạy`;
        });

        //Xếp ca học cho giảng viên 
        const XEP_CA = XEP_GIANG_VIEN.map(field => {
            const VITRUAL_ARR_BLOCK1 = [];
            const VITRUAL_ARR_BLOCK2 = [];
            field.block_1.forEach((field1, key) => {
                if (field.block_1[key + 1]) {
                    if (field1.ten_lop === field.block_1[key + 1].ten_lop) {
                        VITRUAL_ARR_BLOCK1.push({ ...field1, ngay_hoc: '2-4-6' });
                        VITRUAL_ARR_BLOCK1.push({ ...field.block_1[key + 1], ngay_hoc: '3-5-7' });
                        //console.log(field.block_1[key + 1].ngay_hoc);
                    }//14 15 15 16 17
                    else {
                        // console.log(VITRUAL_ARR_BLOCK1[key]);
                        if (!VITRUAL_ARR_BLOCK1[key]) {
                            // console.log(key);
                            // console.log(VITRUAL_ARR_BLOCK1);
                            VITRUAL_ARR_BLOCK1.push({ ...field1, ngay_hoc: '2-4-6' });
                        }
                    }
                } else {
                    VITRUAL_ARR_BLOCK1.push({ ...field1, ngay_hoc: '2-4-6' });
                }
            });
            field.block_2.forEach((field1, key) => {
                if (field.block_2[key + 1]) {
                    if (field1.ten_lop === field.block_2[key + 1].ten_lop) {
                        VITRUAL_ARR_BLOCK2.push({ ...field1, ngay_hoc: '2-4-6' });
                        VITRUAL_ARR_BLOCK2.push({ ...field.block_2[key + 1], ngay_hoc: '3-5-7' });
                        //console.log(field.block_1[key + 1].ngay_hoc);
                    }//14 15 15 16 17
                    else {
                        // console.log(VITRUAL_ARR_BLOCK2[key]);
                        if (!VITRUAL_ARR_BLOCK2[key]) {
                            // console.log(key);
                            // console.log(VITRUAL_ARR_BLOCK2);
                            VITRUAL_ARR_BLOCK2.push({ ...field1, ngay_hoc: '2-4-6' });
                        }
                    }
                } else {
                    VITRUAL_ARR_BLOCK2.push({ ...field1, ngay_hoc: '2-4-6' });
                }
            });
            return { ...field, block_1: VITRUAL_ARR_BLOCK1, block_2: VITRUAL_ARR_BLOCK2 };
        });
        // console.log(XEP_CA);
        const NGAY_CHAN = [];
        const NGAY_LE = [];
        const room_block1 = [];
        const room_block2 = [];
        const rooms = [...MockData.rooms].map(field => {
            [...field.slots].forEach(field1 => {
                let nextSlot_block1 = false;
                let nextSlot_block2 = false;
                const block_1 = { ...field1 };
                const block_2 = { ...field1 };
                XEP_CA.forEach(field2 => {
                    field2.block_1.forEach(field3 => {
                        if (!nextSlot_block1) {
                            if (block_1.class == "") {
                                // console.log(field3);
                                if (field3.ngay_hoc.indexOf('2') != -1 || field3.ngay_hoc.indexOf('4') != -1
                                    || field3.ngay_hoc.indexOf('6') != -1) {
                                    if (!field3.ca_hoc) {
                                        const teacherMatches = teacher.find(field4 => field4._id === field3.id_giang_vien);
                                        if (Object.keys(teacherMatches).length > 0) {
                                            const slotMatches = teacherMatches.slots.find(slotField => field1.slotName.indexOf(slotField.slot) != -1);
                                            if (slotMatches) {
                                                field3.ca_hoc = slotMatches.slot;
                                                block_1.class = field3.ten_lop;
                                                field3.phong = field.roomName;
                                                NGAY_CHAN.push(field3);
                                            } else {
                                                nextSlot_block1 = true;
                                            }
                                        }
                                    }
                                    // console.log(teacherMatches);
                                }
                            }
                        }
                        // console.log(field3);
                    });
                    field2.block_2.forEach(field3 => {
                        if (!nextSlot_block2) {
                            if (block_2.class == "") {
                                // console.log(field3);
                                if (field3.ngay_hoc.indexOf('2') != -1 || field3.ngay_hoc.indexOf('4') != -1
                                    || field3.ngay_hoc.indexOf('6') != -1) {
                                    if (!field3.ca_hoc) {
                                        const teacherMatches = teacher.find(field4 => field4._id === field3.id_giang_vien);
                                        if (Object.keys(teacherMatches).length > 0) {
                                            const slotMatches = teacherMatches.slots.find(slotField => field1.slotName.indexOf(slotField.slot) != -1);
                                            if (slotMatches) {
                                                field3.ca_hoc = slotMatches.slot;
                                                block_2.class = field3.ten_lop;
                                                field3.phong = field.roomName;
                                                NGAY_CHAN.push(field3);
                                            } else {
                                                nextSlot_block2 = true;
                                            }
                                        }
                                    }
                                    // console.log(teacherMatches);
                                }
                            }
                        }
                        // console.log(field3);
                    });
                    // console.log(field2);
                    // console.log(field2);
                    // console.log(nextSlot);
                });
                room_block1.push({ room: field.roomName, block_1 });
                room_block2.push({ rooms: field.roomName, block_2 });
            })
        })
        //Kiểm tra xem lớp nào chưa được xếp 
        XEP_CA.forEach(field => {
            field.block_1.forEach((field1, key) => {
                if (field.block_1[key + 1]) {
                    if (field1.ten_lop === field.block_1[key + 1].ten_lop) {
                        const ca_le = field.block_1[key + 1];
                        const giang_vien = teacher.find(field => field._id == ca_le.id_giang_vien);
                        ca_le.ca_hoc = field1.ca_hoc;
                        const giang_vien_co_day_duoc_ca_nay_khong =
                            giang_vien.slots.find(slotField => ca_le.ca_hoc.indexOf(slotField.slot) !== -1);
                        if (!giang_vien_co_day_duoc_ca_nay_khong) {
                            const doi_giang_vien = [];
                            teacher.forEach(field => {
                                field.slots.forEach(field1 => {
                                    if (ca_le.ca_hoc === field1.slot) {
                                        doi_giang_vien.push(field);
                                    }
                                })
                            });
                            //console.log('Đổi giảng viên lớp ',field1.ten_lop);
                            ca_le.giang_vien = doi_giang_vien[Math.floor(Math.random() * doi_giang_vien.length)].name;
                        }
                    }
                }
            })
        });
        console.log(XEP_CA);
        setTable(XEP_CA);

    }

    return (
        <div>
            <div>
                <p>Mã môn</p>
                <input onChange={(e) => setSubject({ ...subject, subjectCode: e.target.value })} type="text" />
                <p>Tên môn</p>
                <input onChange={(e) => setSubject({ ...subject, name: e.target.value })} type="text" />
                <p></p>
                <button onClick={onPost}>Submit</button>
            </div>
            <input onChange={handleFile} type="file" />
            <p></p>
            <button onClick={onSumbit}>Lọc dữ liệu </button>
            <table id="root" className = 'w-full'>
                <thead>
                    <tr>
                        <td>STT</td>
                        <td>Tên lớp</td>
                        <td>Mã môn</td>
                        <td>Tên môn</td>
                        <td>Block</td>
                        <td>Ca học</td>
                        <td>Giảng viên</td>
                        <td>Ngành</td>
                        <td>Phòng</td>
                        <td>Ngay hoc</td>
                        <td>Bộ môn</td>
                    </tr>
                </thead>
                <tbody>
                    {table.map(field => {
                        const mergeArr = [...field.block_1,...field.block_2];
                        return mergeArr.map((field1,key) =>  
                        <tr key = {key}>
                            <td>{key}</td>
                            <td>{field1.ten_lop}</td>
                            <td>{field1.ma_mon}</td>
                            <td>{field1.ten_mon}</td>
                            <td>{field1.block}</td>
                            <td>{field1.ca_hoc}</td>
                            <td>{field1.giang_vien}</td>
                            <td>{field1.nganh}</td>
                            <td>{field1.ngay_hoc}</td>
                            <td>{field1.phong}</td>
                            <td>{field1.bo_mon}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default StudentPage;