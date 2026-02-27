import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/FooterGuest';
import Swal from 'sweetalert2';

export default function Index({ books, auth, categories }) {
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);


    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filteredBooks, setFilteredBooks] = useState(books.data || []);

    useEffect(() => {
        let filtered = books.data;
        if (search.trim() !== '') {
            filtered = filtered.filter(book =>
                book.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterCategory) {
            filtered = filtered.filter(
                book => book.category && book.category.id === parseInt(filterCategory)
            );
        }
        setFilteredBooks(filtered);
    }, [search, filterCategory, books.data]);

    const handleViewBook = (bookId) => router.get(`/customer/books/${bookId}`);

    const handleAddToCart = (bookId, quantity = 1) => {
    if (!auth?.user) {
        Swal.fire({
            title: 'Please Login',
            text: 'You need to login or register to add books to your cart.',
            icon: 'info',
            confirmButtonColor: '#bda081',
        }).then(() => {
            setLoginOpen(true); 
        });
        return;
    }
        router.post(route('cart.add', { book: bookId }), { 
        quantity: quantity 
    }, {
        onSuccess: () => {
            // Success Toast Confirmation
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Book added to cart!',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        },
        onError: (errors) => {
            console.error(errors);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to add book to cart.',
                confirmButtonColor: '#bda081',
            });
        }
    });
    };

    const isBestSeller = (book) => book.times_sold > 50 || Math.random() > 0.8; 

    return (
        <div className="min-h-screen flex flex-col bg-[#f5eadf]">
            <Head title="Books Store" />
            <Navbar  auth={auth} 
                loginOpen={loginOpen} 
                setLoginOpen={setLoginOpen}     
                registerOpen={registerOpen} 
                setRegisterOpen={setRegisterOpen} />

            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                
                {/* RESTORED FILTERS SECTION */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="relative flex-grow shadow-sm rounded-xl overflow-hidden">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-sm">🔍</span>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-11 pr-4 py-3 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#bda081] transition-all bg-white text-sm"
                            placeholder="Search your favorite books..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="md:w-64 shadow-sm rounded-xl overflow-hidden">
                        <select
                            className="block w-full px-4 py-3 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#bda081] transition-all bg-white text-sm cursor-pointer"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* GRID SECTION */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map(book => (
                            <div key={book.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
                                {/* Aspect Ratio Box (2:3) */}
                                <div 
                                    className="relative aspect-[2/3] overflow-hidden bg-gray-200 cursor-pointer"
                                    onClick={() => handleViewBook(book.id)}
                                >
                                    <img
                                        src={book.cover_image ? `/storage/${book.cover_image}` : '/images/no-book.png'}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        alt={book.title}
                                    />
                                    
                                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-lg">
                                        {book.discounted_price ? (
                                            <>
                                                <span className="text-sm font-bold text-gray-500 line-through mr-1">
                                                    ${book.price}
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    ${book.discounted_price}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm font-bold text-gray-900">
                                                ${book.price}
                                            </span>
                                        )}
                                    </div>

                                    {isBestSeller(book) && (
                                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg rotate-[-5deg]">
                                            ⭐ BEST SELLER
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-3 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#bda081] transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-[11px] text-gray-500 mb-2 truncate">{book.author}</p>
                                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md mb-3">
                                            {book.category?.name || 'General'}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mt-auto">
                                        <button
                                            disabled={book.stock === 0}
                                            onClick={() => {
                                                if (book.stock > 0) {
                                                    handleAddToCart(book.id);
                                                }
                                            }}
                                            className={`w-full text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm
                                                ${book.stock === 0
                                                    ? 'bg-gray-400 cursor-not-allowed text-white'
                                                    : 'bg-[#bda081] hover:bg-[#a68b6d] text-white'
                                                }
                                            `}
                                        >
                                            <span>
                                                {book.stock === 0 ? '❌ Out of Stock' : '🛒 Add to Cart'}
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleViewBook(book.id)}
                                            className="w-full text-white bg-[#bda081] hover:bg-[#a68b6d] text-[11px] font-medium py-1 rounded-xl transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 bg-white rounded-3xl shadow-inner">
                            <p className="text-gray-400 text-lg">No books found matching your search. 📚</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
