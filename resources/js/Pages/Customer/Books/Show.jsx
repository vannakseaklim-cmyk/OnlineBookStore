import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/FooterGuest';

export default function Show({ book, auth }) {
    return (
        <>
            <Head title={book.title} />
            <Navbar auth={auth} />

            <div className="pt-16 min-h-screen flex flex-col">
                <div className="container my-5 flex-grow">
                    <div className="row">
                        <div className="col-md-4">
                            <img
                                src={book.cover_image ? `/storage/${book.cover_image}` : '/images/no-book.png'}
                                className="img-fluid"
                                alt={book.title}
                            />
                        </div>
                        <div className="col-md-8">
                            <h2>{book.title}</h2>
                            <p><strong>Pages:</strong> {book.pages}</p>
                            <p><strong>Author:</strong> {book.author}</p>
                            <p><strong>Category:</strong> {book.category?.name || 'No category'}</p>
                            <p>
                                <strong>Price:</strong>{' '}
                                {book.discounted_price ? (
                                    <>
                                        <span className="text-gray-500 line-through mr-1">
                                            {book.price} $
                                        </span>
                                        <span className="text-red-600 font-bold">
                                            {book.discounted_price} $
                                        </span>
                                    </>
                                ) : (
                                    book.price ? `${book.price} $` : 'Not available'
                                )}
                            </p>
                            <p><strong>Description:</strong></p>
                            <p>{book.description || 'No description available.'}</p>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
