import { useState } from 'react';

// Enum cho trạng thái đơn hàng
enum OrderStatus {
    Pending = "Pending",
    Shipping = "Đang giao hàng",
    Rejected = "Rejected",
}

// Định nghĩa kiểu dữ liệu cho đơn hàng
interface Order {
    id: number;
    name: string;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    status: OrderStatus;
    quantity: number;
    price: string;
}

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([
        { id: 1, name: 'Order 1', customerName: 'John Doe', email: 'john@example.com', phone: '123456789', address: '123 Main St', status: OrderStatus.Pending, quantity: 1, price: '40.000đ' },
        { id: 2, name: 'Order 2', customerName: 'Jane Smith', email: 'jane@example.com', phone: '987654321', address: '456 Elm St', status: OrderStatus.Pending, quantity: 2, price: '80.000đ' },
    ]);

    const handleAccept = (id: number) => {
        setOrders(orders.map(order => 
            order.id === id ? { ...order, status: OrderStatus.Shipping } : order
        ));
    };

    const handleReject = (id: number) => {
        setOrders(orders.map(order => 
            order.id === id ? { ...order, status: OrderStatus.Rejected } : order
        ));
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
            <table className="min-w-full bg-white border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 border">Tên khách hàng</th>
                        <th className="py-2 border">Email</th>
                        <th className="py-2 border">Số điện thoại</th>
                        <th className="py-2 border">Địa chỉ</th>
                        <th className="py-2 border">Mã đơn hàng</th>
                        <th className="py-2 border">Trạng thái</th>
                        <th className="py-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td className="border px-4 py-2">{order.customerName}</td>
                            <td className="border px-4 py-2">{order.email}</td>
                            <td className="border px-4 py-2">{order.phone}</td>
                            <td className="border px-4 py-2">{order.address}</td>
                            <td className="border px-4 py-2">{order.id}</td>
                            <td className="border px-4 py-2">{order.status}</td>
                            <td className="border px-4 py-2">
                                {order.status === OrderStatus.Pending && (
                                    <>
                                        <button 
                                            className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                                            onClick={() => handleAccept(order.id)}
                                        >
                                            Chấp nhận
                                        </button>
                                        <button 
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={() => handleReject(order.id)}
                                        >
                                            Hủy
                                        </button>
                                    </>
                                )}
                                {order.status === OrderStatus.Shipping && (
                                    <button 
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleReject(order.id)}
                                    >
                                        Thất bại
                                    </button>
                                )}
                                {order.status === OrderStatus.Rejected && (
                                    <button className="bg-gray-500 text-white px-4 py-2 rounded" disabled>
                                        Đã hủy
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderManagement;
