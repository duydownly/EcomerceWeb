import { useState } from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { AppSidebar } from "../components/app-sidebar-admin";
import OrderManagement from "./OrderManagement";
import ProductManagement from "./ProductManagement";
import UserManagement from "./UserManagement";

// Component DashboardAdmin
const DashboardAdmin: React.FC = () => {
    // Quản lý menu đang chọn
    const [selectedMenu, setSelectedMenu] = useState<'orders' | 'products' | 'customers'>('orders');

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="flex h-screen">
                {/* Sidebar */}
                {/* Main Content */}
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

                    {/* Hiển thị component theo menu được chọn */}
                    {selectedMenu === 'orders' && <OrderManagement />}
                    {selectedMenu === 'products' && <ProductManagement />}
                    {selectedMenu === 'customers' && <UserManagement />}
                </div>
                <AppSidebar selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />

            </div>
        </AppLayout>
    );
};

export default DashboardAdmin;
