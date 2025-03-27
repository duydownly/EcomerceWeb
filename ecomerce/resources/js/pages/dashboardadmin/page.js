"use client";

import { useAuth } from '@/hooks/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/(app)/Header';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement'; // Import UserManagement

const AdminDashboard = () => {
    const { user } = useAuth({ middleware: 'auth' }); // Lấy thông tin user
    const [loading, setLoading] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState('orders');

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <p>Loading...</p>; // Hiển thị khi đang tải user

    return (
        <>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-white text-red-600 p-4 border-r border-gray-200">
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                    <ul className="mt-4">
                        <li 
                            className="p-3 hover:bg-red-100 cursor-pointer flex items-center"
                            onClick={() => setSelectedMenu('orders')}
                        >
                            📦 <span className="ml-2">Thông tin đơn hàng</span>
                        </li>
                        <li 
                            className="p-3 hover:bg-red-100 cursor-pointer flex items-center"
                            onClick={() => setSelectedMenu('products')}
                        >
                            🛒 <span className="ml-2">Quản lý sản phẩm</span>
                        </li>
                        <li 
                            className="p-3 hover:bg-red-100 cursor-pointer flex items-center"
                            onClick={() => setSelectedMenu('customers')}
                        >
                            👥 <span className="ml-2">Quản lý khách hàng</span>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold">Welcome to Admin Dashboard!</h1>
                    {/* Nếu email chưa được xác minh, hiển thị thông báo */}
                    {!user?.email_verified_at && (
                        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            ⚠️ Bạn chưa xác minh email. Vui lòng kiểm tra hộp thư và xác minh!
                        </div>
                    )}

                    {/* Hiển thị nội dung theo menu đã chọn */}
                    <div className="mt-6">
                        {selectedMenu === 'customers' && <UserManagement />} 
                        {selectedMenu === 'products' && <ProductManagement />}
                        {selectedMenu === 'orders' && <OrderManagement />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;