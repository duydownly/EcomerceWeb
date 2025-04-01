import { useState } from 'react';
import OrderDetails from './OrderDetails'; // Import the OrderDetails component

// Enum for order status
enum OrderStatus {
    Pending = "Pending",
    Shipping = "Shipping",
    Delivered = "Delivered",
    Refuse = "Refuse",
    Rejected = "Rejected",
}

// Define the data type for a product
interface Product {
    product_id: number;
    product_name: string;
    image_product: string;
    quantity: number;
    price: string;
}

// Define the data type for an order
interface Order {
    id: number;
    customerName: string;
    email: string;
    phone: string;
    address: string;
    status: OrderStatus;
    products: Product[]; // Updated to include multiple products
}

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([
        {
            id: 1,
            customerName: 'John Doe',
            email: 'john@example.com',
            phone: '123456789',
            address: '123 Main St',
            status: OrderStatus.Pending,
            products: [
                { 
                    product_id: 101, 
                    product_name: 'Product Asadsadasdsadasdasdasdsadasdsa', 
                    image_product: '/storage/images/image1.png', 
                    quantity: 1, 
                    price: '40,000 VND' 
                },
                { 
                    product_id: 102, 
                    product_name: 'Product B', 
                    image_product: '/storage/images/kb48SgBl3A9zOTqGvAGYZ2rbbti4ts5z1WZBTj7J.png', 
                    quantity: 2, 
                    price: '80,000 VND' 
                },
            ],
        },
        {
            id: 2,
            customerName: 'Jane Smith',
            email: 'jane@example.com',
            phone: '987654321',
            address: '456 Elm St',
            status: OrderStatus.Pending,
            products: [
                { 
                    product_id: 103, 
                    product_name: 'Product C', 
                    image_product: '/storage/images/image1.png', 
                    quantity: 1, 
                    price: '50,000 VND' 
                },
            ],
        },
    ]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // State for selected order

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

    const handleDelivered = (id: number) => {
        setOrders(orders.map(order => 
            order.id === id ? { ...order, status: OrderStatus.Delivered } : order
        ));
    };

    const handleRefuse = (id: number) => {
        setOrders(orders.map(order => 
            order.id === id ? { ...order, status: OrderStatus.Refuse } : order
        ));
    };

    const handleOrderClick = (order: Order) => {
        setSelectedOrder(order); // Set the selected order to display in the modal
    };

    const closeModal = () => {
        setSelectedOrder(null); // Close the modal
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Order Information</h2>
            <table className="min-w-full bg-white border-collapse">
                <thead>
                    <tr>
                        <th className="py-2 border">Customer Name</th>
                        <th className="py-2 border">Email</th>
                        <th className="py-2 border">Phone Number</th>
                        <th className="py-2 border">Address</th>
                        <th className="py-2 border">Order ID</th>
                        <th className="py-2 border">Status</th>
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
                            <td 
                                className="border px-4 py-2 text-blue-500 cursor-pointer"
                                onClick={() => handleOrderClick(order)} // Open modal on click
                            >
                                {order.id}
                            </td>
                            <td className="border px-4 py-2">{order.status}</td>
                            <td className="border px-4 py-2">
                                {order.status === OrderStatus.Pending && (
                                    <>
                                        <button 
                                            className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                                            onClick={() => handleAccept(order.id)}
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={() => handleReject(order.id)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                                {order.status === OrderStatus.Shipping && (
                                    <>
                                        <button 
                                            className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                                            onClick={() => handleDelivered(order.id)}
                                        >
                                            Delivered
                                        </button>
                                        <button 
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={() => handleRefuse(order.id)}
                                        >
                                            Refuse
                                        </button>
                                    </>
                                )}
                                {order.status === OrderStatus.Delivered && (
                                    <button className="bg-green-500 text-white px-4 py-2 rounded" disabled>
                                        Delivered
                                    </button>
                                )}
                                {order.status === OrderStatus.Refuse && (
                                    <button className="bg-gray-500 text-white px-4 py-2 rounded" disabled>
                                        Refused Delivery
                                    </button>
                                )}
                                {order.status === OrderStatus.Rejected && (
                                    <button className="bg-gray-500 text-white px-4 py-2 rounded" disabled>
                                        Canceled
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder && (
                <div 
                    className="modal-overlay" 
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal(); // Close modal on outside click
                    }}
                >
                    <div className="modal-content">
                        <button 
                            className="modal-close-button"
                            onClick={closeModal} // Close modal button
                        >
                            &times;
                        </button>
                        <OrderDetails 
                            order={{
                                ...selectedOrder,
                                products: selectedOrder?.products, // Pass the products array to OrderDetails
                            }} 
                        /> {/* Pass selected order to OrderDetails */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
