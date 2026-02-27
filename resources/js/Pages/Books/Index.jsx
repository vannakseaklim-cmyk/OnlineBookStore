import Breadcrumb from '@/Components/Breadcrumb';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';

export default function BooksPage({ bookData }) {
    const booksList = bookData?.data || [];

    // Delete modal state
    const [confirmingBookDeletion, setConfirmingBookDeletion] = useState(false);
    const [bookEdit, setBookEdit] = useState({});

    const { data: deleteBook, setData: setDeleteBook, delete: destroy, processing, reset, clearErrors } =
        useForm({
            id: '',
            title: ''
        });

    // Open delete modal
    const confirmBookDeletion = (book) => {
        setBookEdit(book);
        setDeleteBook('id', book.id);
        setDeleteBook('title', book.title);
        setConfirmingBookDeletion(true);
    };

    // Close delete modal
    const closeModal = () => {
        setConfirmingBookDeletion(false);
        setBookEdit({});
        clearErrors();
        reset();
    };

    // Delete book
    const deleteBookRow = (e) => {
        e.preventDefault();
        destroy(route('books.destroy', bookEdit.id), {
            preserveScroll: true,
            onSuccess: closeModal,
            onFinish: reset,
        });
    };

    const headWeb = 'Book List';
    const linksBreadcrumb = [
        { title: 'Home', url: '/dashboard' },
        { title: headWeb, url: '' },
        { title: 'Create', type: 'button', url: route('books.create'), className: 'btn btn-primary btn-sm' }
    ];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />

            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">Book Management</h3>
                                <div className="card-tools">
                                    <div className="input-group input-group-sm" style={{ width: '150px' }}>
                                        <input
                                            type="text"
                                            name="table_search"
                                            className="form-control float-right"
                                            placeholder="Search"
                                        />
                                        <div className="input-group-append">
                                            <button type="submit" className="btn btn-default">
                                                <i className="fas fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-body table-responsive p-0">
                                <table className="table table-hover text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>#ID</th>
                                            <th>Cover</th>
                                            <th>Title</th>
                                            <th>Pages</th>
                                            <th>Author</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Discount</th>
                                            <th>Final Price</th>
                                            <th>Stock</th>
                                            <th>Status</th>
                                            <th>Created At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {booksList.length > 0 ? (
                                        booksList.map((book, index) => (
                                            <tr key={book.id}>
                                                <td>{book.id}</td>
                                                <td>
                                                    {book.cover_image ? (
                                                        <img
                                                            src={`/storage/${book.cover_image}`}
                                                            alt="cover"
                                                            style={{ width: '50px', borderRadius: '4px' }}
                                                        />
                                                    ) : (
                                                        <span className="text-muted small">No Image</span>
                                                    )}
                                                </td>                                              
                                                <td>{book.title}</td>
                                                <td>{book.pages}</td>
                                                <td>{book.author || '-'}</td>
                                                <td>{book.category?.name || '-'}</td>
                                                <td>${Number(book.price).toLocaleString()}</td>
                                                <td>
                                                    {book.discount ? `${book.discount.discount_percent}%` : '-'}
                                                </td>
                                                <td>
                                                    {book.discounted_price
                                                        ? `$${Number(book.discounted_price).toLocaleString()}`
                                                        : '-' }
                                                </td>
                                                <td>{book.stock}</td>
                                                <td>
                                                    {book.stock > 0 ? (
                                                        <span className="badge badge-success">In Stock</span>
                                                    ) : (
                                                        <span className="badge badge-danger">Out of Stock</span>
                                                    )}
                                                </td>
                                                <td>{moment(book.created_at).format('DD/MM/YYYY')}</td>
                                                <td className="text-center">
                                                    <Link
                                                        href={route('books.edit', book.id)}
                                                        className="btn btn-info btn-xs mr-2"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Link>

                                                    <button
                                                        onClick={() => confirmBookDeletion(book)}
                                                        className="btn btn-danger btn-xs"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={10} className="text-center">
                                                There are no records!
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>

                                </table>

                                {/* Delete Modal */}
                                <Modal show={confirmingBookDeletion} onClose={closeModal}>
                                    <form onSubmit={deleteBookRow} className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">Confirmation!</h2>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Are you sure you want to delete{' '}
                                            <span className="text-lg font-medium">{deleteBook.title}</span>?
                                        </p>
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={closeModal}
                                            >
                                                No
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-danger ms-3"
                                                disabled={processing}
                                            >
                                                Yes
                                            </button>
                                        </div>
                                    </form>
                                </Modal>
                            </div>

                            <div className="card-footer">
                                <div className="d-flex justify-content-end">
                                    <Pagination links={bookData.links} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}
