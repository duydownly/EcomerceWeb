"use client";
import { useState, useEffect } from "react";
import axios from "axios";

type Product = {
    id: number;
    name: string;
    price: number;
    description?: string;
    image_url: string;
    additionalImages?: string[];
};

type CartItem = {
    id: number;
    name: string;
    quantity: number;
    price: number;
    image: string;
};

interface ProductDetailsProps {
    product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
    const [cartData, setCartData] = useState<CartItem[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    // Load cart data from localStorage on component mount
    useEffect(() => {
        const storedCartData = JSON.parse(localStorage.getItem("cartData") || "[]") as CartItem[];
        setCartData(storedCartData);
    }, []);

    const formatPrice = (price: number): string => {
        return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    const handleAddToCart = (): void => {
        const existingProductIndex = cartData.findIndex((item) => item.id === product.id);
        let updatedCartData: CartItem[];

        if (existingProductIndex !== -1) {
            // Update quantity if product already exists in the cart
            updatedCartData = cartData.map((item, index) =>
                index === existingProductIndex ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            // Add new product to the cart
            const newProduct: CartItem = {
                id: product.id,
                name: product.name,
                quantity: 1,
                price: product.price,
                image: product.image_url,
            };
            updatedCartData = [...cartData, newProduct];
        }

        // Update state and persist to localStorage
        setCartData(updatedCartData);
        localStorage.setItem("cartData", JSON.stringify(updatedCartData));
        setShowModal(true); // Show modal after adding to cart
    };

    const handleRemoveFromCart = (productId: number): void => {
        const updatedCartData = cartData.filter(item => item.id !== productId);
        setCartData(updatedCartData);
        localStorage.setItem('cartData', JSON.stringify(updatedCartData));
    };

    const calculateSubtotal = (): number => {
        return cartData.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleCheckout = async (): Promise<void> => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            alert("User ID is missing. Please log in.");
            return;
        }

        // Prepare the order data to match the controller's expectations
        const orderData = {
            user_id: userId,
            products: cartData.map((item) => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        console.log("Order data being sent:", orderData); // Log the data being sent

        try {
            await axios.post("/addorder", orderData);
            alert("Order placed successfully!");

            // Clear localStorage except for user_id
            const userIdValue = localStorage.getItem("user_id");
            localStorage.clear();
            if (userIdValue) {
                localStorage.setItem("user_id", userIdValue);
            }

            // Clear cart data in state
            setCartData([]);
            setShowModal(false);
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <div className="flex">
                <div className="w-1/2">
                    <img src={product.image_url} alt={product.name} className="w-full h-auto" />
                </div>
                <div className="w-1/2 pl-6">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-red-500 text-xl mt-2">{formatPrice(product.price)}</p>
                    <p className="mt-4">{product.description}</p>
                    <button
                        onClick={handleAddToCart}
                        className="bg-red-500 text-white px-8 py-4 mt-4 block text-lg"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Modal for showing cart details */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-2/3">
                        <h2 className="text-xl font-bold mb-4">Cart</h2>
                        {cartData.map((item, index) => (
                            <div key={index} className="flex justify-between items-center mb-4 border-b pb-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                                <div className="flex-1 ml-4">
                                    <p>{item.name}</p>
                                    <p className="text-red-500">{formatPrice(item.price)}</p>
                                </div>
                                <input type="number" value={item.quantity} readOnly className="w-12 text-center border" />
                                <p className="text-red-500">{formatPrice(item.price * item.quantity)}</p>
                                <button className="text-gray-500 ml-4" onClick={() => handleRemoveFromCart(item.id)}>×</button>
                            </div>
                        ))}
                        <div className="flex justify-between items-center mt-4">
                            <p className="text-xl font-bold">Subtotal</p>
                            <p className="text-red-500 text-xl">{formatPrice(calculateSubtotal())}</p>
                        </div>
                        <div className="flex justify-end items-center mt-4 space-x-4">
                            <button className="bg-gray-300 px-4 py-2" onClick={() => setShowModal(false)}>Continue Shopping</button>
                            <button className="bg-black text-white px-4 py-2" onClick={handleCheckout}>Checkout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
