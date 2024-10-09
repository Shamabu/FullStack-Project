import axios from "axios";

const API_TEACHERS_URL="https://localhost:7185/api/teachers"

//API Methods
class TeachersApi
{
    getTeachers()
    {
        return axios.get(API_TEACHERS_URL);
    }

    //api/teachers/19
    getTeacher(id)
    {
        return axios.get(`${API_TEACHERS_URL}/${id}`);
    }

    //body : teacher json
    createTeacher(teacher)
    {
        return axios.post(API_TEACHERS_URL,teacher);
    }

    updateTeacher(teacher,id)
    {
        return axios.put(`${API_TEACHERS_URL}/${id}`,teacher)

    }

    deleteTeacher(id)
    {
        return axios.delete(`${API_TEACHERS_URL}/${id}`)
    }



}

export default new TeachersApi();