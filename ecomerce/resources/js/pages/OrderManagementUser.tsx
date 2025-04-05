import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    products: Product[];
}

const OrderManagementUser: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // State for selected order

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user_id = localStorage.getItem('user_id'); // Retrieve user_id from localStorage
                console.log('Retrieved user_id from localStorage:', user_id); // Log user_id for verification

                const response = await axios.post('/getorderforuser', { user_id });
                const data = response.data;

                console.log('Fetched data from API:', data); // Log fetched data for debugging

                // Transform data into the required format
                const groupedOrders: { [key: number]: Order } = {};
                data.forEach((item: any) => {
                    if (!groupedOrders[item.order_id]) {
                        groupedOrders[item.order_id] = {
                            id: item.order_id,
                            customerName: item.customer_name,
                            email: item.email,
                            phone: item.phone,
                            address: item.address,
                            status: item.status,
                            products: [],
                        };
                    }
                    groupedOrders[item.order_id].products.push({
                        product_id: item.product_id,
                        product_name: item.product_name,
                        image_product: item.image_product,
                        quantity: item.quantity,
                        price: item.price,
                    });
                });

                setOrders(Object.values(groupedOrders));
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
    }, []);

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

export default OrderManagementUser;
