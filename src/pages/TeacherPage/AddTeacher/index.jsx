import React, { useEffect, useState } from 'react';
import SubjectAPI from '@/services/SubjectAPI';
import SlotAPI from '@/services/SlotAPI';
import TeacherAPI from './../../../services/TeacherAPI';

import * as yup from 'yup';

function AddTeacher() {

    const [subject, setSubject] = useState([]);
    const [slot, setSlot] = useState([]);
    const [newData,setNewData] = useState({
        name : null,
        age : null,
        gender : null,
        address : null,
        email : null,
        phoneNumber : null,
        skills : [],
        slots : []   
    })

    useEffect(() => {
        const findAll = async () => {
            const { data: resSlot } = await SlotAPI.findAll();
            const { data: resSubject } = await SubjectAPI.findAll();
            setSubject(resSubject);
            setSlot(resSlot)
        }
        findAll();
    }, []);

    const handleSkill = (e,item) => {
        let data = [...newData.skills];
        if(e.target.checked){
           data.push(item._id);
           setNewData({...newData,skills : data});
        }else{
            const removeCheckbox = data.filter(itemCheckbox => itemCheckbox !== item._id);
            setNewData({...newData,skills : removeCheckbox})
        }
    }

    const handleSlot = (e,item) => {
        let data = [...newData.slots];
        if(e.target.checked){
           data.push(item._id);
           setNewData({...newData,slots : data});
        }else{
            const removeCheckbox = data.filter(itemCheckbox => itemCheckbox !== item._id);
            setNewData({...newData,slots : removeCheckbox})
        }
    }

    const onSubmit = async() => {
        try {
            const res = await TeacherAPI.create(newData);
            console.log(res);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div>
            <p>Tên giáo viên</p>
            <input onChange = {(e) => setNewData({...newData,name : e.target.value})} type="text" name="" id="" />
            <p>Tuổi</p>
            <input onChange = {(e) => setNewData({...newData,age : e.target.value})} type="number" />
            <p>Giới tính</p>
            <label htmlFor="male">
                <input onChange = {() => setNewData({...newData,gender : 0})} type="radio" name="gender" id="male" />
                Nam
            </label>
            <label htmlFor="female">
                <input onChange = {() => setNewData({...newData,gender : 1})} type="radio" name="gender" id="female" />
                Nữ
            </label>
            <p>Email</p>
            <input onChange = {(e) => setNewData({...newData,email : e.target.value})} type="text" />
            <p>Số điện thoại </p>
            <input  onChange = {(e) => setNewData({...newData,phoneNumber : e.target.value})} type="text" />
            <p>Địa chỉ</p>
            <input  onChange = {(e) => setNewData({...newData,address : e.target.value})} type="text" />
            <p>Kĩ năng</p>
            <div>
                {subject.map((item, key) => {
                    return <label onChange = {(e) => handleSkill(e,item)} className='mx-1' key={key}>
                        <input type="checkbox" />
                        {item.name}
                    </label>
                })}
            </div>
            <p>Thời gian làm việc</p>
            <div>
                {slot.map((item, key) => {
                    return <label  onChange = {(e) => handleSlot(e,item,'slot')} className='mx-1' key={key}>
                        <input type="checkbox" />
                        {item.time}
                    </label>
                })}
            </div>
            <button onClick = {onSubmit}>Lưu thông tin</button>
        </div>
    );
}

export default AddTeacher;