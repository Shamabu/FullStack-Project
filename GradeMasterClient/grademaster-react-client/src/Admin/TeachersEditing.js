import React , {useState, useEffect} from "react";
import TeachersApi from '../ApiCalls/TeachersApi';

//component for crud operation using server calls
function TeacherEditing()
{
    //state all teachers
    const [teachers, setTeachers] = useState([]);

    //state current teacher
    const [currentTeacher, setCurrentTeacher] = useState({
        id:0,
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''

    });

    //Edit / create
    const [editing, setEditing] = useState(false);

    //event for each state change , if empty its triggered only once 
    useEffect(() => {
        refreshTeachers()
    },
    []);
    


    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentTeacher({...currentTeacher, [name] : value });
    };

    //when function occures we get all teachers
    const refreshTeachers = () =>{
        //call api server
        //save it into state
        TeachersApi.getTeachers().then(response =>{
            setTeachers(response.data);
        });

        const addTeacher = ()=>{
            TeachersApi.createTeacher(currentTeacher).then(response=>{
                refreshTeachers();
                //clean current teacher 
                setCurrentTeacher({
                    id:0,
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    phoneNumber: ''

                });
            });
        };

        const updateTeacher = () => {
            TeachersApi.updateTeacher(currentTeacher.id,currentTeacher).then(response=>{
                refreshTeachers();
                //clean current teacher 
                setCurrentTeacher({
                    id:0,
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    phoneNumber: ''

                });
                setEditing(false);
            
            });
        };

        const deleteTeacher = id => {
            TeachersApi.deleteTeacher(id).then(() => {
                refreshTeachers();
            });
        };
    };



    return (
        <div className="container">
            <h2>Teachers</h2>
            <form>
                <div className="form-group">
                    <label>Email</label>
                    <input 
                    type="email"
                    name="email"
                    value={currentTeacher.email}
                    onChange={handleInputChange}
                    className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>password</label>
                    <input 
                    type="password"
                    name="password"
                    value={currentTeacher.password}
                    onChange={handleInputChange}
                    className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>firstName</label>
                    <input 
                    type="text"
                    name="firstname"
                    value={currentTeacher.firstName}
                    onChange={handleInputChange}
                    className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>last Name</label>
                    <input 
                    type="text"
                    name="lastname"
                    value={currentTeacher.lastName}
                    onChange={handleInputChange}
                    className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                    type="text"
                    name="phoneNumber"
                    value={currentTeacher.phoneNumber}
                    onChange={handleInputChange}
                    className="form-control"
                    />
                </div>

            </form>

        </div>
        
        
    )



}