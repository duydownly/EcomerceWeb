import React, { JSX, useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import AddProduct from './AddProduct';
import AddCategory from './AddCategory';
import EditProduct from './EditProduct';
import DeleteCategory from './DeleteCategory';
import UpdateCategory from './UpdateCategory';

interface Product {
    id: string; // Changed from number to string
    image: JSX.Element;
    name: string;
    stock: string;
    price: string;
    category_names: string[];
    description: string;
    categories?: { id: string; name: string }[]; // Added optional `categories` property
}
Modal.setAppElement('body'); // Dùng 'body' vì Inertia không có #root như React thuần

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [description, setDescription] = useState('');
    const [addProductModalIsOpen, setAddProductModalIsOpen] = useState(false);
    const [addCategoryModalIsOpen, setAddCategoryModalIsOpen] = useState(false);
    const [updateCategoryModalIsOpen, setUpdateCategoryModalIsOpen] = useState(false);
    const [editProductModalIsOpen, setEditProductModalIsOpen] = useState(false);
    const [deleteCategoryModalIsOpen, setDeleteCategoryModalIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); // Add state for search term

    const fetchProducts = async () => {
        try {
            setIsLoading(true);

            const productsResponse = await fetch('/products-with-categories');
            if (!productsResponse.ok) throw new Error('Failed to fetch products');
            const productsData = await productsResponse.json();
            console.log('Fetched products data:', productsData); // Debugging log

            const formattedProducts = productsData.map((product: any) => ({
                id: product.id.toString(), // Ensure `id` is converted to string
                name: product.name,
                stock: product.stock.toLocaleString(),
                price: `${product.price.toLocaleString()}đ`,
                image: <img 
                    src={product.image || '/placeholder.jpg'} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded" 
                />,
                description: product.description,
                category_names: product.categories.map((c: any) => c.name),
            }));

            setProducts(formattedProducts);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const openModal = (product: Product) => {
        setSelectedProduct(product);
        setDescription(product.description);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedProduct(null);
    };

    const openEditModal = (product: Product) => {
        setSelectedProduct({
            ...product,
            categories: product.category_names.map((name, index) => ({
                id: `category-${index + 1}`, // Replace with actual category IDs if available
                name,
            })),
        }); // Ensure `categories` is passed correctly
        setEditProductModalIsOpen(true);
    };

    const closeEditModal = () => {
        setEditProductModalIsOpen(false);
        setSelectedProduct(null);
    };

    const deleteProduct = async (id: string, name: string) => { // Added `name` parameter
        if (window.confirm(`Are you sure you want to delete the product "${name}" with ID: ${id}?`)) { // Updated confirmation message
            try {
                console.log(`Deleting product with id: ${id} and name: ${name}`); // Debugging log

                await axios.delete(`/products/${id}`);
    
                console.log('Product deleted successfully');
                setProducts(products.filter(product => product.id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || 'Failed to delete product');
                } else {
                    setError('Failed to delete product');
                }
            }
        }
    };
    
    const updateDescription = async () => {
        if (!selectedProduct) return;
    
        try {
            console.log(`Updating description for product ${selectedProduct.id}`);
    
            const response = await axios.put(`/adddescriptionproducts/${selectedProduct.id}`, {
                description: description
            });
    
            if (response.status === 200) {
                console.log('Description updated successfully');
                setProducts(products.map(product =>
                    product.id === selectedProduct.id ? { ...product, description } : product
                ));
                closeModal();
            } else {
                throw new Error('Failed to update product');
            }
        } catch (err) {
            console.error('Error updating product:', err);
            setError(err instanceof Error ? err.message : 'Failed to update product');
        }
    };
    
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ); // Filter products based on search term

    if (isLoading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between mb-4">
                <div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setAddCategoryModalIsOpen(true)}>
                        Add Category
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={() => setUpdateCategoryModalIsOpen(true)}>
                        Update Category
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={() => setDeleteCategoryModalIsOpen(true)}>
                        Delete Category
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded ml-2" onClick={() => setAddProductModalIsOpen(true)}>
                        Add Product
                    </button>
                </div>
            </div>
            <input 
                type="text" 
                placeholder="Search..." 
                className="px-4 py-2 border rounded mb-4 w-full" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
            />
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-center">Image</th>
                        <th className="py-2 px-4 border-b text-center">Name</th>
                        <th className="py-2 px-4 border-b text-center">Stock</th>
                        <th className="py-2 px-4 border-b text-center">Price</th>
                        <th className="py-2 px-4 border-b text-center">Categories</th>
                        <th className="py-2 px-4 border-b text-center">Description</th>
                        <th className="py-2 px-4 border-b text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td className="py-2 px-4 border-b text-center">{product.image}</td>
                                <td className="py-2 px-4 border-b text-center">{product.name}</td>
                                <td className="py-2 px-4 border-b text-center">{product.stock}</td>
                                <td className="py-2 px-4 border-b text-center">{product.price}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    {product.category_names.join(', ')} {/* Display category names */}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button className="text-blue-500" onClick={() => openModal(product)}>Details</button>
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    <button 
                                        className="px-4 py-2 ml-2 rounded bg-blue-500 text-white"
                                        onClick={() => openEditModal(product)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="px-4 py-2 ml-2 rounded bg-red-500 text-white"
                                        onClick={() => deleteProduct(product.id, product.name)} // Pass `id` and `name`
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="py-4 text-center text-gray-500">No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {selectedProduct && (
                <Modal 
                    isOpen={modalIsOpen} 
                    onRequestClose={closeModal} 
                    contentLabel="Product Description"
                    style={{ content: { width: '60%', margin: 'auto' } }} // Adjust width and center the modal
                >
                    <h2 className="text-lg font-bold mb-4">{selectedProduct.name}</h2>
                    <p className="mb-4">{selectedProduct.description}</p> {/* Display description */}
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border"
                        style={{ height: '75%' }}
                    />
                    <div className="flex justify-end mt-4">
                        <button onClick={updateDescription} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Update</button>
                        <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
                    </div>
                </Modal>
            )}
            <Modal 
                isOpen={editProductModalIsOpen} 
                onRequestClose={closeEditModal} 
                contentLabel="Edit Product"
            >
                {selectedProduct && (
                    <EditProduct 
                        product={{
                            id: selectedProduct.id, // `id` is now a string
                            name: selectedProduct.name,
                            stock: parseInt(selectedProduct.stock.replace(/,/g, ''), 10), // Convert stock back to number
                            price: selectedProduct.price.replace(/[^0-9]/g, ''), // Remove currency formatting
                            categories: selectedProduct.categories || [], // Pass categories correctly
                            description: selectedProduct.description,
                            image: selectedProduct.image.props.src, // Extract image URL
                        }}
                        onProductUpdated={() => {
                            fetchProducts(); // Refresh product list
                            closeEditModal(); // Close modal
                        }}
                    />
                )}
            </Modal>
            <Modal 
                isOpen={addProductModalIsOpen} 
                onRequestClose={() => setAddProductModalIsOpen(false)} 
                contentLabel="Add Product"
            >
                <AddProduct 
                    onProductAdded={() => {
                        fetchProducts(); // Automatically fetch updated product list
                        setAddProductModalIsOpen(false); // Close modal after adding
                    }}
                />
            </Modal>
            <Modal isOpen={addCategoryModalIsOpen} onRequestClose={() => setAddCategoryModalIsOpen(false)} contentLabel="Add Category">
                <AddCategory onCategoryAdded={() => {
                    fetchProducts(); // Reload products
                    setAddCategoryModalIsOpen(false); // Close modal
                }} />
            </Modal>
            <Modal 
                isOpen={updateCategoryModalIsOpen} 
                onRequestClose={() => setUpdateCategoryModalIsOpen(false)} 
                contentLabel="Update Category"
            >
                <UpdateCategory onCategoryUpdated={() => {
                    fetchProducts(); // Reload products
                    setUpdateCategoryModalIsOpen(false); // Close modal
                }} />
            </Modal>
            <Modal 
                isOpen={deleteCategoryModalIsOpen} 
                onRequestClose={() => setDeleteCategoryModalIsOpen(false)} 
                contentLabel="Delete Category"
            >
                <DeleteCategory onCategoryDeleted={() => {
                    fetchProducts(); // Reload products
                    setDeleteCategoryModalIsOpen(false); // Close modal
                }} />
            </Modal>
        </div>
    );
};

export default ProductManagement;