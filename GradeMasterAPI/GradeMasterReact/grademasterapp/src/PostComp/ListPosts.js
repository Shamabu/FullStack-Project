// src/pages/ListPosts.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, deletePost } from '../Api/PostApi';



//  List Of Posts
const ListPosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        loadPosts();
    }, [posts,error]);

    const loadPosts = async () => {
        const result = await getPosts();
        setPosts(result.data);
    };

    const handleDelete = async (id) => {
        await deletePost(id);
        loadPosts();
    };

    return (
        <div>
        <h2>Posts</h2>
        <Link to={`/PostComp/${post.id}"`} className="btn btn-primary mb-2">Add Post</Link>
        <ul className="list-group">
            {posts.map(post => (
                <li key={post.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{post.title}</span>
                    <div>
                        <Link to={`/posts/${post.id}`} className="btn btn-info btn-sm mr-2">Edit</Link>
                        <button onClick={() => handleDelete(post.id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    </div>
    );
};

export default ListPosts;
