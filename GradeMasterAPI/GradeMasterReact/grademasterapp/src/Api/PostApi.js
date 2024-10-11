import axios from 'axios';
const API_URL = "https://jsonplaceholder.typicode.com/posts"


export const getPosts = () => {
    return axios.get(API_URL);
};

export const getPostById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const createPost = (post) => {
    return axios.post(API_URL,post);
};

export const updatePost = (post,id) => {
    return axios.put(`${API_URL}/${id}`,post);
};

export const deletePost = (id) => {

    return axios.delete(`${API_URL}/${id}`);

};

