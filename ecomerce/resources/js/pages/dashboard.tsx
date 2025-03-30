import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";

"use client";

import { useAuth } from '../hooks/useAuth';
import { JSX, useEffect, useState } from 'react';
import ProductDetails from './productdetails';
import { AppSidebar } from '../components/app-sidebar';

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
    id: number;
    image: JSX.Element;
    name: string;
    price: number;
    category_id: string;
    description: string;
}

// Danh sách sản phẩm
const products: Product[] = [
    {
        id: 1,
        image: <img src="/images/product1.png" alt="Product 1" />,
        name: "Văn và Biến Hình Siêu Nhân các loại - ...",
        price: 50000,
        category_id: "1057357933778075649",
        description: "Description for DX Ranger Keys - Chia Khóa Biến hình hải..."
    },
    {
        id: 3,
        image: <img src="/images/product3.png" alt="Product 3" />,
        name: "Văn và Biến Hình Siêu Nhân các loại - ...",
        price: 500000,
        category_id: "1057357933778108417",
        description: "Description for Văn và Biến Hình Siêu Nhân các loại - ..."
    },
    {
        id: 4,
        image: <img src="/images/product4.png" alt="Product 4" />,
        name: "Hộp Mù Lắp Ráp Kamen Rider Vol 1 2 Star...",
        price: 50000,
        category_id: "1057357933778141185",
        description: "Description for Hộp Mù Lắp Ráp Kamen Rider Vol 1 2 Star..."
    },
];

// Hàm tiện ích để định dạng giá
const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        console.log("User Data:", user);
        if (user) {
            setLoading(false);
            if (user.is_admin) {
                router.visit('/dashboardadmin');
            }
        }
    }, [user]);

    if (loading) return <p>Loading...</p>;

    // Lọc sản phẩm theo danh mục được chọn
    const filteredProducts = selectedCategory
        ? products.filter(product => product.category_id === selectedCategory)
        : products;

    return (
        <AppLayout>
            <Head title="User Dashboard" />
            <div className="flex h-screen">
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
                                    <p className="text-red-500">{formatPrice(product.price)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    <AppSidebar onCategorySelect={setSelectedCategory} />
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
