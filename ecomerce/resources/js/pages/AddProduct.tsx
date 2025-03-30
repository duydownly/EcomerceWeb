import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css';

const AddProduct: React.FC<{ onProductAdded: (newProduct: any) => void }> = ({ onProductAdded }) => {
    const [image, setImage] = useState<File | null>(null);
    const [productName, setProductName] = useState<string>('');
    const [stockQuantity, setStockQuantity] = useState<number | ''>('');
    const [price, setPrice] = useState<string>('');
    const [categorySelections, setCategorySelections] = useState<string[]>(['']); // Mảng danh mục đã chọn
    const [description, setDescription] = useState<string>('');
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/categories');
                console.log('API Response:', response.data); // ✅ Log toàn bộ dữ liệu nhận được
                setCategories(response.data.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);
    

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleCategoryChange = (index: number, value: string) => {
        const parsedValue = BigInt(value).toString(); // Chuyển đổi thành chuỗi số nguyên lớn
        if (categorySelections.includes(parsedValue)) {
            alert('This category is already selected!');
            return;
        }
        const updatedSelections = [...categorySelections];
        updatedSelections[index] = parsedValue;
        setCategorySelections(updatedSelections);
    };
    

    const handleAddMoreCategory = () => {
        if (categorySelections.length >= categories.length) {
            alert('All categories have been selected!');
            return;
        }
        setCategorySelections([...categorySelections, '']);
    };

    const handleRemoveCategory = (index: number) => {
        const updatedSelections = categorySelections.filter((_, i) => i !== index);
        setCategorySelections(updatedSelections);
    };

    const getAvailableCategories = (selectedIndex: number) => {
        return categories.filter((cat) => !categorySelections.includes(cat.id.toString()) || categorySelections[selectedIndex] === cat.id.toString());
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', productName);
        formData.append('stock', String(stockQuantity));
        formData.append('price', price);
        if (image) {
            formData.append('image', image); // ✅ Gửi file ảnh thực tế
        }
        formData.append('description', description);
        
        categorySelections.forEach((catId) => {
            const parsedId = BigInt(catId).toString(); // Đảm bảo gửi đúng định dạng
            formData.append('categories[]', parsedId);
        });
          console.log('Form Data:', formData);        
        console.log('Categories:', categorySelections.map(Number));
        console.log('Sending categories:', categorySelections);
        console.log('FormData categories:', formData.getAll('categories[]'));
        
        try {
            const { data } = await axios.post('/addproducts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(data.message || 'Product added successfully!'); // Hiển thị thông báo từ server
            onProductAdded(data.newProduct); // Notify parent about the new product
        } catch (error: any) {
            console.error('Failed to add product:', error);
            alert(error.response?.data?.message || 'Failed to add product!');
        }
        
    };
    
    
    return (
        <div className="add-product-container">
            <h1 className="add-product-title">Add Product</h1>
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

                {/* Chọn danh mục */}
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
                                {getAvailableCategories(index).map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {/* Nút xóa danh mục nếu có từ 2 danh mục trở lên */}
                            {categorySelections.length > 1 && (
                                <button type="button" className="remove-category-button" onClick={() => handleRemoveCategory(index)}>
                                    ❌
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Nút thêm danh mục */}
                <button type="button" className="add-category-button" onClick={handleAddMoreCategory}>
                    ➕ Add More Category
                </button>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>

                <button className="submit-button" type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
