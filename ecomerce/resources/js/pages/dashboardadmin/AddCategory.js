import React, { useState } from 'react';
import './AddCategory.css';

const AddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!categoryName.trim()) {
            setMessage("❌ Category name cannot be empty!");
            return;
        }
    
        try {
            // Lấy CSRF token trước
            await fetch('http://localhost:8000/sanctum/csrf-cookie', {
                method: 'GET',
                credentials: 'include'
            });
    
            // Gửi request thêm category
            const response = await fetch('http://localhost:8000/api/addcategory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name: categoryName }),
                credentials: 'include' // Quan trọng khi dùng Sanctum
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMessage(`✅ Category added: ${data.data.name}`);
                setCategoryName('');
            } else {
                setMessage(`❌ Error: ${data.message || 'Something went wrong!'}`);
            }
        } catch (error) {
            setMessage('❌ Failed to connect to server!');
        }
    };
    
    return (
        <div className="add-category-container">
            <h1 className="add-category-title">Add Category</h1>
            <form className="add-category-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Category Name:</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>
                <button className="submit-button" type="submit">Add Category</button>
            </form>
            {message && <p className="response-message">{message}</p>}
        </div>
    );
};

export default AddCategory;
