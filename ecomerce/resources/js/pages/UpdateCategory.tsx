import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateCategory.css';

const UpdateCategory: React.FC<{ onCategoryUpdated: () => void }> = ({ onCategoryUpdated }) => {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [categoryId, setCategoryId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories');
                if (response.data.status === 'success') {
                    setCategories(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (id: string) => {
        setCategoryId(id);
        const selectedCategory = categories.find((category) => category.id === id);
        setCategoryName(selectedCategory ? selectedCategory.name : '');
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!categoryId || !categoryName) {
            setMessage('❌ Please fill in all fields!');
            return;
        }

        try {
            const response = await axios.put(`/updatecategory/${categoryId}`, { name: categoryName });
            alert(`✅ ${response.data.message}`); // Show success message as a pop-up
            setCategoryId('');
            setCategoryName('');
            onCategoryUpdated(); // Notify parent to reload ProductManagement
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                setMessage(`❌ ${error.response.data.message}`);
            } else {
                setMessage('❌ Failed to update category');
            }
        }
    };

    return (
        <div className="update-category-container">
            <h1 className="update-category-title">Update Category</h1>
            <form className="update-category-form" onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>Select Category:</label>
                    <select
                        value={categoryId}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        required
                    >
                        <option value="">-- Select a category --</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>New Category Name:</label>
                    <input
                        type="text"
                        placeholder="Enter New Category Name"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                </div>
                <button className="submit-button" type="submit">Update Category</button>
            </form>
            {message && <p className="response-message">{message}</p>}
        </div>
    );
};

export default UpdateCategory;
