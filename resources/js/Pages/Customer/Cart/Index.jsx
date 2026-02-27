import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/FooterGuest';
import Swal from 'sweetalert2';

export default function Cart({ cart, auth }) {
    const [cartItems, setCartItems] = useState(cart?.items || []);

    useEffect(() => {
        setCartItems(cart?.items || []);
    }, [cart]);

    const handleQuantityChange = (cartItemId, newQty) => {
    if (newQty < 1) return;

    // 1. Find the book title from your local state before sending the request
    const itemBeingUpdated = cartItems.find(item => item.id === cartItemId);
    const bookTitle = itemBeingUpdated?.book?.title || 'Book';

    router.put(route('cart.update', cartItemId), { quantity: newQty }, { 
        preserveScroll: true,
        onSuccess: () => {
            // Optional: Success toast
        },
        onError: () => {
            // This triggers if Laravel validation fails
        },
        onFinish: () => {
            // 2. Check the flash messages sent from the Controller
            const flash = router.page.props.flash;
            
            if (flash.error || flash.sorry) {
                Swal.fire({
                    icon: 'error',
                    title: bookTitle, // <--- This now shows the actual Book Title
                    text: flash.error || flash.sorry,
                    confirmButtonColor: '#bda081',
                });

                // 3. Reset the local state so the UI doesn't show the wrong quantity
                setCartItems(cart?.items || []);
            }
        }
    });
};

    const handleRemoveItem = (cartItemId) => {
        Swal.fire({
            title: 'Remove Book?',
            text: "Do you want to remove this book from your cart?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#bda081',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('cart.remove', cartItemId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setCartItems(prev => prev.filter(item => item.id !== cartItemId));
                        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Item removed', showConfirmButton: false, timer: 1500 });
                    }
                });
            }
        });
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + (parseFloat(item.book.price) * item.quantity), 0);

    return (
        <div className="min-h-screen bg-[#f5eadf] flex flex-col">
            <Head title="My Shopping Cart" />
            <Navbar auth={auth} />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-xl text-gray-500 mb-6">Your cart feels a bit light.</p>
                        <button onClick={() => router.visit('/customer/books')} className="bg-[#bda081] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#a68b6d] transition shadow-lg">
                            Go to Store
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center group relative">
                                    <img
                                        src={item.book.cover_image ? `/storage/${item.book.cover_image}` : '/images/no-book.png'}
                                        className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-xl shadow-sm flex-shrink-0"
                                        alt={item.book.title}
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.book.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{item.book.author}</p>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition font-bold text-gray-600">-</button>
                                                <span className="w-8 text-center font-bold text-sm text-gray-800">{item.quantity}</span>
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition font-bold text-gray-600">+</button>
                                            </div>
                                            <span>
                                                {item.book.discounted_price ? (
                                                    <>
                                                        <span className="text-lg font-bold text-[#bda081]">
                                                            ${(item.book.discounted_price * item.quantity).toFixed(2)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-[#bda081] text-lg">
                                                        ${(item.book.price * item.quantity).toFixed(2)}
                                                    </span>
                                                )}
                                            </span>  
                                        </div>
                                    </div>
                                    {/* Delete Button */}
                                    <button onClick={() => handleRemoveItem(item.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition">
                                        <svg xmlns="http://www.w3.org" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Summary Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Cart Summary</h2>
                                <div className="space-y-4 mb-6">
                                    <div className="text-gray-600 text-base space-y-4 mb-6">
                                        {cart.items && cart.items.length > 0 ? (
                                            cart.items.map(item => (
                                                <div key={item.id} className="flex justify-between">
                                                    <span>
                                                        {item.book?.title} × {item.quantity}
                                                    </span>
                                        
                                                    <span>
                                                        {item.book.discounted_price ? (
                                                            <>
                                                                <span className="text-sm font-semibold text-[#bda081]">
                                                                    ${(item.book.discounted_price * item.quantity).toFixed(2)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-semibold text-[#bda081] text-sm">
                                                                ${(item.book.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        )}
                                                    </span> 
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-400">No items in cart</p>
                                        )}
                                    </div>
                                    
                                </div>

                                {/* Buttons Container */}
                                <div className="flex gap-3 mt-6">
                                    <button 
                                        onClick={() => router.visit('/customer/books')} 
                                        className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition text-center"
                                    >
                                        Shop More
                                    </button>
                                    <button 
                                        onClick={() => router.visit('/checkout')} 
                                        className="flex-1 bg-[#bda081] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-[#a68b6d] transition shadow-md text-center"
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
