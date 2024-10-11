// src/pages/AddPost.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../Api/PostApi';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = { title, body };
        await createPost(newPost);
        navigate('/posts');
    };
    return (
        <div>
            <h2>Add Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Body</label>
                    <textarea
                        className="form-control"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-2">Add</button>
            </form>
        </div>
    );
};
