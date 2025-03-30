"use client";

import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductDetails from './ProductDetails';

// Định nghĩa danh sách danh mục
const categoryMap = {
    "1057357933778010113": "Phụ Kiện Sentai Items",
    "1057357933778075649": "Mô hình Robo Gattai",
    "1057357933778108417": "Thiết Bị Biến Hình",
    "1057357933778141185": "Kamen Rider - Driver"
};

// Định nghĩa danh sách sản phẩm với giá dạng số
const products = [
    {
        id: 1,
        image: <img src="/images/product1.png" alt="Product 1" />,
        name: "Văn và Bssiến Hình Siêu Nhân các loại - ...",
        price: 50000, // Giá dạng số
        category_id: "1057357933778075649",
        description: "Description for DX Ranger Keys - Chia Khóa Biến hình hải..."
    },
    {
        id: 3,
        image: <img src="/images/product3.png" alt="Product 3" />,
        name: "Văn và Biến Hình Siêu Nhân các loại - ...",
        price: 500000, // Giá dạng số
        category_id: "1057357933778108417",
        description: "Description for Văn và Biến Hình Siêu Nhân các loại - ..."
    },
    {
        id: 4,
        image: <img src="/images/product4.png" alt="Product 4" />,
        name: "Hộp Mù Lắp Ráp Kamen Rider Vol 1 2 Star...",
        price: 50000, // Giá dạng số
        category_id: "1057357933778141185",
        description: "Description for Hộp Mù Lắp Ráp Kamen Rider Vol 1 2 Star..."
    },
];

// Hàm tiện ích để định dạng giá
const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
};

const Dashboard = () => {
    const router = useRouter();
    const { user } = useAuth({ middleware: 'auth' }); // Lấy thông tin user
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (user) {
            setLoading(false);

            // Nếu user là admin, chuyển hướng sang /dashboardadmin
            if (user.is_admin) {
                router.push('/dashboardadmin');
            }
        }
    }, [user]);

    if (loading) return <p>Loading...</p>; // Hiển thị khi đang tải user

    // Lọc sản phẩm theo danh mục được chọn
    const filteredProducts = selectedCategory
        ? products.filter(product => product.category_id === selectedCategory)
        : products;

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-white text-red-600 p-4 border-r border-gray-200">
                <h2 className="text-xl font-bold text-center">Menu</h2>
                <ul className="mt-4">
                    <li
                        className="p-3 hover:bg-red-100 cursor-pointer flex items-center"
                        onClick={() => {
                            setSelectedCategory(null);
                            setSelectedProduct(null);
                        }}
                    >
                        <a>Toàn bộ sản phẩm</a>
                    </li>
                    {Object.entries(categoryMap).map(([key, value]) => (
                        <li
                            key={key}
                            className="p-3 hover:bg-red-100 cursor-pointer flex items-center"
                            onClick={() => {
                                setSelectedCategory(key);
                                setSelectedProduct(null);
                            }}
                        >
                            <a>{value}</a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold">Welcome to User Dashboard!</h1>
                {selectedProduct ? (
                    <ProductDetails product={selectedProduct} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                className="border p-4 rounded cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                {product.image}
                                <h2 className="text-lg font-bold mt-2">{product.name}</h2>
                                {/* Sử dụng hàm formatPrice để hiển thị giá */}
                                <p className="text-red-500">{formatPrice(product.price)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;