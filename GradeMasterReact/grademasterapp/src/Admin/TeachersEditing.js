import React, { useState, useEffect } from 'react'
import TeachersApi from '../ApiCalls/TeachersApi'

///Component For Doing Crud Operation Using Server Calls

function TeacherEditing()
{
    //-state all teachers
    const [teachers , SetTeacher ] = useState([]);

    const [ currentTeacher , setCurrentTeacher ] = useState({
        id : 0,
        email:'',
        password:'',
        firstName:'',
        lastName:'',
        PhoneNumber:''

    });
    const [editing, setEditing] = useState(false);
    useEffect(() => {
        refreshTeachers()
    },
    []);
// load all teachers from remote api
    const refreshTeachers = () => 
        {
            TeachersApi.getTeachers().then(response =>{
                SetTeachers(response.data);

            });
        };

    const addTeacher = ()=> {
        TeachersApi.createTeacher(currentTeacher).then(
            response=>{
                refreshTeachers();
                setCurrentTeacher({
                    id : 0,
                    email:'',
                    password:'',
                    firstName:'',
                    lastName:'',
                    PhoneNumber:''
                });
            }
        );

    };

}