import React, { useState } from 'react';
import Modal from 'react-modal';
import AddProduct from './AddProduct'; // Import AddProduct component
import AddCategory from './AddCategory'; // Import AddCategory component

const categoryMap = {
    "1057357933778010113": "Phụ Kiện Sentai Items",
    "1057357933778075649": "Mô hình Robo Gattai",
    "1057357933778108417": "Thiết Bị Biến Hình",
    "1057357933778141185": "Kamen Rider - Driver"
};

const getProducts = () => {
    return [
        {
            id: 1,
            image: <img src="/images/product1.png" alt="Product 1" />,
            name: "DX Ranger Keys - Chia Khóa Biến hình hải...",
            stock: "1,000",
            price: "40.000đ",
            category_id: "1057357933778010113",
            description: "Description for product 1"
        },
        {
            id: 2,
            image: <img src="/images/product2.png" alt="Product 2" />,
            name: "Hộp Mù Lắp Ráp Transformers - Wave 1 2...",
            stock: "2,000",
            price: "50.000đ",
            category_id: "1057357933778075649",
            description: "Description for product 2"
        },
        {
            id: 3,
            image: <img src="/images/product3.png" alt="Product 3" />,
            name: "Văn và Biến Hình Siêu Nhân các loại - ...",
            stock: "500",
            price: "500.000đ",
            category_id: "1057357933778108417",
            description: "Description for product 3"
        },
        {
            id: 4,
            image: <img src="/images/product4.png" alt="Product 4" />,
            name: "Hộp Mù Lắp Ráp Kamen Rider Vol 1 2 Star...",
            stock: "3,000",
            price: "50.000đ",
            category_id: "1057357933778141185",
            description: "Description for product 4"
        },
    ];
};

const ProductManagement = () => {
    const [products, setProducts] = useState(getProducts());
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [description, setDescription] = useState('');
    const [addProductModalIsOpen, setAddProductModalIsOpen] = useState(false); // State for AddProduct modal
    const [addCategoryModalIsOpen, setAddCategoryModalIsOpen] = useState(false); // State for AddCategory modal

    const openModal = (product) => {
        setSelectedProduct(product);
        setDescription(product.description);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProduct(null);
    };

    const updateDescription = () => {
        setProducts(products.map(product => 
            product.id === selectedProduct.id ? { ...product, description } : product
        ));
        closeModal();
    };

    const openAddProductModal = () => {
        setAddProductModalIsOpen(true);
    };

    const closeAddProductModal = () => {
        setAddProductModalIsOpen(false);
    };

    const openAddCategoryModal = () => {
        setAddCategoryModalIsOpen(true);
    };

    const closeAddCategoryModal = () => {
        setAddCategoryModalIsOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between mb-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded">Search Product</button>
                <div>
                    <button 
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={openAddCategoryModal} // Open AddCategory modal
                    >
                        Add Category
                    </button>
                    <button 
                        className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                        onClick={openAddProductModal} // Open AddProduct modal
                    >
                        Add Product
                    </button>
                </div>
            </div>
            <input type="text" placeholder="Search..." className="px-4 py-2 border rounded mb-4 w-full" />
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 text-center">Image</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-center">Tên</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-center">Kho</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-center">Giá</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-center">Danh mục</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-center">Description</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">{product.image}</td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">{product.name}</td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">{product.stock}</td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">{product.price}</td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">{categoryMap[product.category_id]}</td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <button className="text-blue-500" onClick={() => openModal(product)}>Details</button>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <button className="text-blue-500">Edit</button>
                                <button className="text-red-500 ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedProduct && (
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Product Description">
                    <h2>{selectedProduct.name}</h2>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border"
                        style={{ height: '75%' }}
                    />
                    <button onClick={updateDescription} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Update</button>
                </Modal>
            )}
            <Modal isOpen={addProductModalIsOpen} onRequestClose={closeAddProductModal} contentLabel="Add Product">
                <AddProduct />
            </Modal>
            <Modal isOpen={addCategoryModalIsOpen} onRequestClose={closeAddCategoryModal} contentLabel="Add Category">
                <AddCategory />
            </Modal>
        </div>
    );
};

export default ProductManagement;