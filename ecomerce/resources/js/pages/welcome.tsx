import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const images = [
        '/storage/images/image1.png',
        '/storage/images/image2.png',
        '/storage/images/image3.png',
        '/storage/images/image4.png',
        '/storage/images/image5.png',
    ];
    
    const [currentIndex, setCurrentIndex] = useState(0);
    interface Product {
        product_id: number;
        category_name: string;
        image: string;
    }

    const [productsData, setProductsData] = useState<Product[]>([]);
    useEffect(() => {
        axios.get('/productforhomepage')
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    const validProducts = response.data.filter(product => 
                        product && product.product_id && product.category_name
                    );
                    
                    console.log('Fetched products data:', validProducts);
                    
                    setProductsData(validProducts.map(product => ({
                        ...product,
                        image: product.image || "/placeholder.jpg" // Fallback image
                    })));
                } else {
                    console.error('Invalid data format received:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
        }, 6000); // Change image every 30 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [images.length]);

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <>
            <Head title="E-HAPPY 15TH BIRTHDAY">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col lg:max-w-4xl">
                        {/* Image Gallery */}
                        <div className="relative flex flex-col items-center">
                            {/* Title above image */}

                            {/* Spacing */}
                            <div className="h-16"></div>

                            <h2 className="text-3xl font-bold text-center mb-2 text-red-600">
                                🔥 "Superheroes Unite – Power in Your Hands!" 🔥
                            </h2>
                            <h3 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-300">
                                Toyoto Shop
                            </h3>

                            {/* Image and navigation */}
                            <div className="relative flex items-center">
                                {/* Previous button - placed outside the image container */}
                                <button 
                                    className="mr-2 h-10 w-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700" 
                                    onClick={prevImage}
                                >
                                    ◀
                                </button>
                                
                                {/* Image container */}
                                <div className="relative w-full overflow-hidden rounded-t-lg bg-[#fff2f2] dark:bg-[#1D0002]">
                                    <img 
                                        src={images[currentIndex]} 
                                        alt={`Promotion ${currentIndex + 1}`} 
                                        className="h-[564px] w-full object-cover transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                                </div>
                                
                                {/* Next button - placed outside the image container */}
                                <button 
                                    className="ml-2 h-10 w-10 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700" 
                                    onClick={nextImage}
                                >
                                    ▶
                                </button>
                            </div>
                        </div>

                            {/* Spacing */}
                            <div className="h-16"></div>

                            {/* Spacing */}
                            <div className="h-16"></div>

                        {/* Categories Sections */}
                        <div className="mt-12 w-full">
                            
                            {/* Exclusive Deals Section */}
                            <section className="mb-16">
                                <h4 className="text-xl font-semibold mb-6 text-center border-b-2 border-red-500 pb-2">
                                    Exclusive Deals
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {productsData.filter(p => p.category_name === 'exclusiveDeals').map(product => (
        <div key={product.product_id} className="...">
            <img 
                src={`/storage/${product.image}`}  // Make sure this matches your data structure
                alt={`Product ${product.product_id}`}
                                                className="w-full h-56 object-cover"
                                            />
                                            <div className="p-4">
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Spacing */}
                            <div className="h-16"></div>

                            {/* Hot Trending Section */}
                            <section className="mb-16">
                                <h4 className="text-xl font-semibold mb-6 text-center border-b-2 border-blue-500 pb-2">
                                    Hot Trending
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {productsData.filter(p => p.category_name === 'hotTrending').map(product => (
                                        <div key={product.product_id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                            <img 
                                                src={`/storage/${product.image}`} 
                                                alt={`Product ${product.product_id}`}
                                                className="w-full h-56 object-cover"
                                            />
                                            <div className="p-4">
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Spacing */}
                            <div className="h-16"></div>

                            {/* Massive Discounts Section */}
                            <section className="mb-16">
                                <h4 className="text-xl font-semibold mb-6 text-center border-b-2 border-green-500 pb-2">
                                    Massive Discounts
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {productsData.filter(p => p.category_name === 'massiveDiscounts').map(product => (
                                        <div key={product.product_id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                                            <img 
                                                src={`/storage/${product.image}`} 
                                                alt={`Product ${product.product_id}`}
                                                className="w-full h-56 object-cover"
                                            />
                                            <div className="p-4">
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}