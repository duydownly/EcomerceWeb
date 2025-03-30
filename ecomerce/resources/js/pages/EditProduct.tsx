import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css';

const EditProduct: React.FC<{ product: any; onProductUpdated: () => void }> = ({ product, onProductUpdated }) => {
    // Log the product.categories data for debugging
    console.log('Product Categories:', product.categories);

    const [image, setImage] = useState<File | null>(null);
    const [productName, setProductName] = useState<string>(product.name || '');
    const [stockQuantity, setStockQuantity] = useState<number | ''>(product.stock || '');
    const [price, setPrice] = useState<string>(product.price || '');
    const [categorySelections, setCategorySelections] = useState<string[]>(
        product.categories.map((c: any) => c.id.toString()) || []
    );
    const [previewImage, setPreviewImage] = useState<string | null>(product.image || null);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);

    useEffect(() => {
        const hasChanges =
            productName !== product.name ||
            stockQuantity !== product.stock ||
            price !== product.price ||
            previewImage !== product.image ||
            JSON.stringify(categorySelections) !== JSON.stringify(product.categories.map((c: any) => c.id.toString()));

        setIsUpdated(hasChanges);
    }, [productName, stockQuantity, price, previewImage, categorySelections, product]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleCategoryChange = (index: number, value: string) => {
        const updatedSelections = [...categorySelections];
        updatedSelections[index] = value;
        setCategorySelections(updatedSelections);
    };

    const handleAddMoreCategory = () => {
        setCategorySelections([...categorySelections, '']);
    };

    const handleRemoveCategory = (index: number) => {
        const updatedSelections = categorySelections.filter((_, i) => i !== index);
        setCategorySelections(updatedSelections);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('stock', String(stockQuantity));
        formData.append('price', price);
        if (image) {
            formData.append('image', image);
        }
        categorySelections.forEach((catId) => {
            const category = product.categories.find((c: any) => c.id.toString() === catId);
            if (category) {
                formData.append('categories[]', JSON.stringify({ id: category.id.toString(), name: category.name }));
            }
        });

        console.log('Form Data:', Object.fromEntries(formData.entries())); // Log to verify

        try {
            const response = await axios.post(`/updateproduct/${product.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log('Response:', response.data);
            alert('Product updated successfully!');
            onProductUpdated();
        } catch (error) {
            console.error('API Error:', error);
            alert('Failed to update product!');
        }
    };

    return (
        <div className="add-product-container">
            <h1 className="add-product-title">Edit Product</h1>
            <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Image:</label>
                    <input type="file" onChange={handleImageChange} />
                    {previewImage && <img src={previewImage} alt="Preview" className="image-preview" />}
                </div>

                <div className="form-group">
                    <label>Product Name:</label>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Stock Quantity:</label>
                    <input
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value ? parseInt(e.target.value, 10) : '')}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Categories:</label>
                    {categorySelections.map((selectedCategory, index) => (
                        <div key={index} className="category-select-wrapper">
                            <select
                                className="category-select"
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(index, e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {product.categories.map((category: any) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {categorySelections.length > 1 && (
                                <button type="button" className="remove-category-button" onClick={() => handleRemoveCategory(index)}>
                                    ❌
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <button type="button" className="add-category-button" onClick={handleAddMoreCategory}>
                    ➕ Add More Category
                </button>

                <div className="form-group">
                  
                </div>

                {isUpdated && <button className="submit-button" type="submit">Update Product</button>}
            </form>
        </div>
    );
};

export default EditProduct;
