import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import axios from "axios";

"use client";

import { useAuth } from "../hooks/useAuth";
import { JSX, useEffect, useState } from "react";
import ProductDetails from "./productdetails";
import { AppSidebar } from "../components/app-sidebar";

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
    id: number;
    image_url: string; // URL của ảnh thay vì JSX.Element
    image: { props: { src: string } }; // Add the 'image' property to match the expected type
    name: string;
    price: number;
    categories: { id: string; name: string }[]; // Ensure this matches the API response
    description: string;
}

// Hàm tiện ích để định dạng giá
const formatPrice = (price: number): string => {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(""); // Add state for search term

    useEffect(() => {
        console.log("User Data:", user);
        if (user) {
            setLoading(false);
            if (user.is_admin) {
                router.visit("/dashboardadmin");
            }
        }
    }, [user]);

    // Gọi API lấy danh sách sản phẩm
    useEffect(() => {
        axios.get("/products-with-categories")
            .then((response) => {
                console.log("API Response:", response.data);
    
                setProducts(response.data.map((product: any) => ({
                    ...product,
                    image_url: product.image || "/placeholder.jpg" // Use the same logic as ProductManagement
                })));
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);
    
    
    if (loading) return <p>Loading...</p>;

    // Lọc sản phẩm theo danh mục và từ khóa tìm kiếm
    const filteredProducts = products.filter((product) =>
        (!selectedCategory || product.categories.some((category) => category.id === selectedCategory)) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="User Dashboard" />
            <div className="flex h-screen">
                {/* Main Content */}
                <div className="flex-1 p-6 text-center">
                <h1 className="text-4xl font-bold mb-6">Welcome to Toyoto Shop!</h1>
                <br />
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 border rounded mb-4 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                />
                    {selectedProduct ? (
                        <ProductDetails product={selectedProduct} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="border p-4 rounded cursor-pointer"
                                    onClick={() => setSelectedProduct(product)}
                                >
                                    <img src={product.image_url} alt={product.name} />
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
