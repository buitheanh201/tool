import React, { useEffect, useState } from 'react';
import xlsx from 'xlsx';
import TeacherAPI from '../../services/TeacherAPI';
import SubjectAPI from './../../services/SubjectAPI';
import MockData from './../../../mockAPI.json';


function StudentPage() {

    const [sheet, setSheet] = useState([]);
    const [teacher, setTeacher] = useState([]);

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
            setTeacher(teacher);
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
        const filterData = sheet.map(sheetObj => {
            const teacherMatches = [];
            teacher.forEach(teacherObj => {
                teacherObj.skills.forEach(skillItem => {
                    if (skillItem.toLowerCase() === sheetObj.ma_mon.toLowerCase()) {
                        teacherMatches.push(teacherObj.name);
                    }
                })
            });
            if (teacherMatches.length > 0) {
                sheetObj.giang_vien = teacherMatches[Math.floor(Math.random() * teacherMatches.length)];
            }
            return sheetObj;
        });
        const nhung_lop_co_giang_vien = [];
        const nhung_lop_chua_co_giang_vien = [];
        filterData.forEach(item => {
            if (item.giang_vien) {
                nhung_lop_co_giang_vien.push(item);
            }
        });
        const day = [1];
        const cac_lop_da_xep = [];
        const cac_lop_chua_xep = [];
        const calc = []
        let lop_co_giang_vien = [...nhung_lop_co_giang_vien];
        for (let i = 0; i < day.length; i++) {
            // console.log(lop_co_giang_vien);
            // console.log(MockData.rooms);
            const dataFilter = [...MockData.rooms].map(room => {
                const slotSort = [...room.slots].map(slotRoom => {
                    const cloneSlotRoom = { ...slotRoom };
                    lop_co_giang_vien.forEach(item => {
                        if (!item.room) {
                            if (cloneSlotRoom.class === "") {
                                item.ca_hoc = slotRoom.slotName;
                                item.room = room.roomName;
                                cloneSlotRoom.class = item.ten_lop;
                                cac_lop_da_xep.push(item);
                            }
                        }
                    });
                    return slotRoom;
                });
                return room;
            });
            const chua_duoc_xep = lop_co_giang_vien.filter(item => !item.room);
            const da_duoc_xep = lop_co_giang_vien.filter(item => item.room);
            if (chua_duoc_xep.length > 0) {
                lop_co_giang_vien = chua_duoc_xep;
                day.push(i + 2);
            }
            calc.push({
                day : i + 1,
                classes : da_duoc_xep
            });
            // console.log(da_duoc_xep);
        }
       console.log(calc);

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
        </div>
    );
}

export default StudentPage;