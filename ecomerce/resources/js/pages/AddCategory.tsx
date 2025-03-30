import React, { useState } from 'react';
import axios from 'axios';
import './AddCategory.css';

const AddCategory: React.FC = () => {
    const [categoryName, setCategoryName] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            setMessage("❌ Category name cannot be empty!");
            return;
        }

        try {
            const response = await axios.post('/addcategory', { name: categoryName });
            alert(`✅ ${response.data.message}`); // Hiển thị thông báo pop-up
            setCategoryName('');
        } catch (error: any) {
            setMessage(`❌ ${error.response?.data?.message || 'Failed to add category'}`);
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
