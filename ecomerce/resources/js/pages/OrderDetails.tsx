import React from 'react';
import './OrderDetails.css';

interface Product {
    product_id: number;
    product_name: string;
    image_product: string;
    quantity: number;
    price: string;
}

interface OrderDetailsProps {
    order: {
        id: number;
        phone: string;
        address: string;
        customerName: string;
        products: Product[];
    };
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
    const totalQuantity = order.products.reduce((sum, product) => sum + product.quantity, 0);
    const totalPrice = order.products.reduce((sum, product) => sum + parseFloat(product.price.replace(/[^\d]/g, '')), 0);

    return (
        <div className="order-details-container">
            <h2 className="order-details-title">Chi tiết đơn hàng</h2>
            <div className="order-details-content">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <h3>Chi tiết đơn hàng</h3>
                <p><strong>Total Quantity:</strong> {totalQuantity}</p>
                <ul className="product-list">
                    {order.products.map(product => (
                        <li key={product.product_id} className="product-item">
                            <div className="product-details">
                                <p><strong>Product Name:</strong> {product.product_name}</p>
                                <p><strong>Quantity:</strong> {product.quantity}</p>
                                <p><strong>Price:</strong> {product.price}</p>
                            </div>
                            <div className="product-image-container">
                                <img src={`/storage/${product.image_product}`} alt={product.product_name} className="product-image" />
                            </div>
                        </li>
                    ))}
                </ul>
                <p><strong>Total Price:</strong> {totalPrice.toLocaleString()} đ</p>
            </div>
        </div>
    );
};

export default OrderDetails;
