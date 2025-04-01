import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeleteCategory.css';

const DeleteCategory: React.FC<{ onCategoryDeleted: () => void }> = ({ onCategoryDeleted }) => {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [message, setMessage] = useState<string>('');

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

    const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedCategory) {
            setMessage('❌ Please select a category to delete!');
            return;
        }

        try {
            const response = await axios.delete(`/deletecategory/${selectedCategory}`);
            alert(`✅ ${response.data.message}`); // Show success message as a pop-up
            setCategories(categories.filter((category) => category.id !== selectedCategory));
            setSelectedCategory('');
            onCategoryDeleted(); // Notify parent to reload ProductManagement
        } catch (error: any) {
            setMessage(`❌ ${error.response?.data?.message || 'Failed to delete category'}`);
        }
    };

    return (
        <div className="delete-category-container">
            <h1 className="delete-category-title">Delete Category</h1>
            <form className="delete-category-form" onSubmit={handleDelete}>
                <div className="form-group">
                    <label>Select Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
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
                <button className="submit-button" type="submit">Delete Category</button>
            </form>
            {message && <p className="response-message">{message}</p>}
        </div>
    );
};

export default DeleteCategory;
