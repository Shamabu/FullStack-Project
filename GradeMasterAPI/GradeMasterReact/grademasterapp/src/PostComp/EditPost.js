// src/pages/EditPost.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../Api/PostApi';

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadPost();
    }, []);

    const loadPost = async () => {
        const result = await getPostById(id);
        setTitle(result.data.title);
        setBody(result.data.body);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedPost = { title, body };
        await updatePost(id, updatedPost);
        navigate('/PostComp');
    };
    

    return(
        <div>
            <h2>Edit Post</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Title</label>
                    <input
                    type='text'
                    className='form-control'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    >
                    </input>
                    </div>
                    <button type='submit' className='btn btn-primary mt-2'>Update</button> 
            </form>
        </div>

    )
};

export default EditPost;
