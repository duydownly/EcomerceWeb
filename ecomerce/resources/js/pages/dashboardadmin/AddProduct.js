import React, { useState } from 'react';
import './AddProduct.css'; // Import the CSS file

const categoryMap = {
    "1057357933778010113": "Sentai Items Accessories",
    "1057357933778075649": "Robo Gattai Models",
    "1057357933778108417": "Transformation Devices",
    "1057357933778141185": "Kamen Rider - Driver"
};

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productName, setProductName] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="add-product-container">
            <h1 className="add-product-title">Add Product</h1>
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Image:</label>
                    <input type="file" onChange={handleImageChange} />
                </div>
                <div className="form-group">
                    <label>Product Name:</label>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Stock Quantity:</label>
                    <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {Object.entries(categoryMap).map(([id, name]) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <button className="submit-button" type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
