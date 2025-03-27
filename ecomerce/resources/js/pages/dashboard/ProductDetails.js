"use client";
import { useState, useEffect } from "react";

const ProductDetails = ({ product }) => {
    const [showModal, setShowModal] = useState(false);
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        const storedCartData = JSON.parse(localStorage.getItem('cartData')) || [];
        setCartData(storedCartData);
    }, []);

    // Hàm định dạng giá tiền
    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const handleAddToCart = () => {
        const existingProductIndex = cartData.findIndex(item => item.id === product.id);
        let updatedCartData;

        // Giữ nguyên giá tiền, không cần chuyển đổi
        const price = product.price;

        if (existingProductIndex !== -1) {
            updatedCartData = cartData.map((item, index) => 
                index === existingProductIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            const newProduct = {
                id: product.id,
                name: product.name,
                quantity: 1,
                price: price, // Giữ nguyên giá tiền
                image: product.image.props.src,
            };
            updatedCartData = [...cartData, newProduct];
        }

        setCartData(updatedCartData);
        localStorage.setItem('cartData', JSON.stringify(updatedCartData));
        setShowModal(true);
    };

    const handleRemoveFromCart = (productId) => {
        const updatedCartData = cartData.filter(item => item.id !== productId);
        setCartData(updatedCartData);
        localStorage.setItem('cartData', JSON.stringify(updatedCartData));
    };

    const calculateSubtotal = () => {
        return cartData.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="p-6">
            <div className="flex">
                <div className="w-1/2">
                    <img src={product.image.props.src} alt={product.name} className="w-full h-auto" />
                    <div className="flex mt-2 space-x-2">
                        {product.additionalImages && product.additionalImages.map((img, index) => (
                            <img key={index} src={img} alt={`Additional ${index}`} className="w-16 h-16 object-cover" />
                        ))}
                    </div>
                    <button onClick={handleAddToCart} className="bg-red-500 text-white px-8 py-4 mt-4 mx-auto block text-lg">Thêm Vào Giỏ Hàng</button>
                </div>
                <div className="w-1/2 pl-6">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-red-500 text-xl mt-2">{formatPrice(product.price)}</p> {/* Hiển thị giá tiền đã định dạng */}
                    <p className="mt-4">{product.description}</p>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-2/3">
                        <h2 className="text-xl font-bold mb-4">Cart</h2>
                        {cartData.map((item, index) => (
                            <div key={index} className="flex justify-between items-center mb-4 border-b pb-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                                <div className="flex-1 ml-4">
                                    <p>{item.name}</p>
                                    <p className="text-red-500">{formatPrice(item.price)}</p> {/* Hiển thị giá tiền đã định dạng */}
                                </div>
                                <input type="number" value={item.quantity} readOnly className="w-12 text-center border" />
                                <p className="text-red-500">{formatPrice(item.price * item.quantity)}</p> {/* Hiển thị tổng giá tiền đã định dạng */}
                                <button 
                                    className="text-gray-500 ml-4" 
                                    onClick={() => handleRemoveFromCart(item.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-xl font-bold">Subtotal</p>
                            <p className="text-red-500 text-xl">{formatPrice(calculateSubtotal())}</p> {/* Hiển thị tổng giá tiền đã định dạng */}
                        </div>
                        <div className="flex justify-end items-center mt-4 space-x-4">
                            <button className="bg-gray-300 px-4 py-2" onClick={() => setShowModal(false)}>Continue Shopping</button>
                            <button className="bg-black text-white px-4 py-2">Checkout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;