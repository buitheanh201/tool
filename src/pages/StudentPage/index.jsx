import React, { useEffect, useState } from 'react';
import xlsx from 'xlsx';
import TeacherAPI from '../../services/TeacherAPI';
import SubjectAPI from './../../services/SubjectAPI';


function StudentPage() {

    const [sheet,setSet] = useState([]);
    const [teacher,setTeacher] = useState([]);

    const handleFile = async(e) => {
        const file = e.target.files[0];
        // const promise = new Promise((resolve,reject) => {
            const fileRender = new FileReader();
            fileRender.readAsArrayBuffer(file);
            fileRender.onload = (e) => {
                const bufferArr = e.target.result;
                const wb = xlsx.read(bufferArr,{ type : "buffer"});
                // const wsname = wb.SheetNames[7];
                const ws = wb.Sheets['AP_Hoc'];
                const data = xlsx.utils.sheet_to_json(ws);
                console.log(data);
            }
        // })
        // const data = await promise;
        // console.log(data);

    }

    useEffect(() => {
        const findAll = async() => {
            const { data : teacher} = await TeacherAPI.findAll();
            setTeacher(teacher);
        }
        findAll();
    },[]);
    
    const onSumbit = () => {

    }

    return (
        <div>
            <input onChange = {handleFile} type="file"/>
            <button onClick = {onSumbit}>Lọc</button>
        </div>
    );
}

export default StudentPage;