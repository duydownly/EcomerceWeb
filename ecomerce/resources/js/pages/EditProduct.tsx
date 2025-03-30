import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css';

const EditProduct: React.FC<{ product: any; onProductUpdated: () => void }> = ({ product, onProductUpdated }) => {
    const [image, setImage] = useState<File | null>(null);
    const [productName, setProductName] = useState<string>('');
    const [stockQuantity, setStockQuantity] = useState<number | ''>('');
    const [price, setPrice] = useState<string>('');
    const [categorySelections, setCategorySelections] = useState<string[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isUpdated, setIsUpdated] = useState<boolean>(false);

    useEffect(() => {
        if (product) {
            setProductName(product.name || '');
            setStockQuantity(product.stock || '');
            setPrice(product.price || '');
            setPreviewImage(product.image || null);
            setCategorySelections(
                Array.isArray(product.categories) ? product.categories.map((c: any) => c.id.toString()) : []
            );
        }
    }, [product]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories');
                setCategories(response.data.data);

                if (product.categories) {
                    const mappedCategoryIds = product.categories.map((category: { name: string }) => {
                        const foundCategory = response.data.data.find((c: { name: string }) => c.name === category.name);
                        return foundCategory ? foundCategory.id : '';
                    });
                    setCategorySelections(mappedCategoryIds);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [product]);

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
        categorySelections.forEach((catId) => formData.append('categories[]', catId));

        try {
            const { data } = await axios.post(`/updateproduct/${product.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert(data.message || 'Product updated successfully!');
            onProductUpdated();
        } catch (error: any) {
            console.error('Failed to update product:', error);
            alert(error.response?.data?.message || 'Failed to update product!');
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
                                {categories.map((category) => (
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

                <div className="form-group"></div>

                {isUpdated && <button className="submit-button" type="submit">Update Product</button>}
            </form>
        </div>
    );
};

export default EditProduct;