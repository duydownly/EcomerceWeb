import { useState } from 'react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([
        { id: 1, name: 'Order 1', customerName: 'John Doe', email: 'john@example.com', phone: '123456789', address: '123 Main St', status: 'Pending', quantity: 1, price: '40.000đ' },
        { id: 2, name: 'Order 2', customerName: 'Jane Smith', email: 'jane@example.com', phone: '987654321', address: '456 Elm St', status: 'Pending', quantity: 2, price: '80.000đ' },
        // Add more orders as needed
    ]);

    const handleAccept = (id) => {
        setOrders(orders.map(order => 
            order.id === id ? { ...order, status: 'Đang giao hàng' } : order
        ));
    };

    const handleReject = (id) => {
        setOrders(orders.map(order => 
            order.id === id ? { ...order, status: 'Rejected' } : order
        ));
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">Tên khách hàng</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Số điện thoại</th>
                        <th className="py-2">Địa chỉ</th>
                        <th className="py-2">Mã đơn hàng</th>
                        <th className="py-2">Trạng thái</th>
                        <th className="py-2">Actions</th>
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
                                {order.status === 'Pending' && (
                                    <>
                                        <button 
                                            className="bg-green-500 text-white px-4 py-2 mr-2"
                                            onClick={() => handleAccept(order.id)}
                                        >
                                            Chấp nhận
                                        </button>
                                        <button 
                                            className="bg-red-500 text-white px-4 py-2"
                                            onClick={() => handleReject(order.id)}
                                        >
                                            Hủy
                                        </button>
                                    </>
                                )}
                                {order.status === 'Đang giao hàng' && (
                                    <button 
                                        className="bg-red-500 text-white px-4 py-2"
                                        onClick={() => handleReject(order.id)}
                                    >
                                        Thất bại
                                    </button>
                                )}
                                {order.status === 'Rejected' && (
                                    <button className="bg-gray-500 text-white px-4 py-2" disabled>
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
