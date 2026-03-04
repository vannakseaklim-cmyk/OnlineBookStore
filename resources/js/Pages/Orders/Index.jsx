import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react'; 
import Modal from '@/Components/Modal';
import moment from 'moment';
import { useState } from 'react'; 

export default function OrdersPage({ ordersData }) {
    
    const { data, setData, patch, processing, reset } = useForm({
        status: '',
        cancel_reason: '',
    });

    const toNumber = (value) => parseFloat(value || 0);

    const ordersList = ordersData?.data || [];
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const headWeb = 'Order Management';
    const linksBreadcrumb = [
        { title: 'Home', url: '/dashboard' },
        { title: headWeb, url: '' },
    ];


const handleStatusChange = (order, newStatus) => {
    if (newStatus === 'cancelled') {
        setSelectedOrder(order);
        setData({ status: 'cancelled', cancel_reason: '' });
        setShowCancelModal(true);
    } else {

        router.patch(route('orders.updateStatus', order.id), {
            status: newStatus,
            cancel_reason: null
        }, { 
            preserveScroll: true,
           
            onSuccess: () => {
                console.log("Status updated successfully!");
            },
            onError: (errors) => {
                console.error("Update failed:", errors);
            }
        });
    }
};

    const submitCancel = (e) => {
        e.preventDefault();
        
        patch(route('orders.updateStatus', selectedOrder.id), data, {
            onSuccess: () => {
                setShowCancelModal(false);
                reset();
            },
            preserveScroll: true
        });
    };
    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />

            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">All Customer Orders</h3>
                            </div>

                            <div className="card-body table-responsive p-0">
                                <table className="table table-hover text-nowrap">
                                    <thead>
                                        <tr>
                                            <th>#ID</th>
                                            <th>Customer</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Status Update</th> 
                                            <th>Payment</th>
                                            <th>Phone</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordersList.length > 0 ? (
                                            ordersList.map((order) => {
                                                const totalAmount = order.items?.reduce((sum, item) => {
                                                    const price = item.book.discounted_price
                                                        ? parseFloat(item.book.discounted_price || 0)
                                                        : parseFloat(item.book.price || 0);
                                                    return sum + price * item.quantity;
                                                }, 0) + (parseFloat(order.shipping_fee || 0));

                                                return (
                                                    <tr key={order.id}>
                                                        <td>{order.id}</td>
                                                        <td>{order.customer?.name || 'Guest'}</td>
                                                        <td>{moment(order.order_date).format('DD/MM/YYYY HH:mm')}</td>
                                                        <td><b className="text-primary">${totalAmount.toFixed(2)}</b></td>
                                                    
                                                    <td>
                                                        <select 
                                                            value={order.status} 
                                                            onChange={(e) => handleStatusChange(order, e.target.value)}
                                                            className={`form-control form-control-sm font-weight-bold ${
                                                                order.status === 'completed' ? 'text-success' : 
                                                                order.status === 'cancelled' ? 'text-danger' : 'text-warning'
                                                            }`}
                                                            disabled={processing}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="completed">Completed</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted small">
                                                            {order.payment_method === 'online' ? <i className="fas fa-credit-card mr-1"></i> : <i className="fas fa-truck mr-1"></i>}
                                                            {order.payment_method}
                                                        </span>
                                                    </td>
                                                    <td>{order.phone_number}</td>
                                                    <td>
                                                        <Link href={route('orders.show', order.id)} className="btn btn-info btn-xs mr-2">
                                                            <i className="fas fa-eye mr-1"></i> Details
                                                        </Link>
                                                        {order.transaction_image && (
                                                            <a href={`/storage/${order.transaction_image}`} target="_blank" className="btn btn-default btn-xs">
                                                                <i className="fas fa-image text-primary"></i> Receipt
                                                            </a>
                                                        )}
                                                    </td>
                                                </tr>
                                                )
        })
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4">No orders found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer">
                                <Pagination links={ordersData.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Modal show={showCancelModal} onClose={() => setShowCancelModal(false)}>
                <form onSubmit={submitCancel} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Cancel Order #{selectedOrder?.id}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Please provide a reason for cancelling this order. This will be visible to the customer.
                    </p>
                    
                    <textarea
                        className="mt-3 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="e.g. Out of stock, invalid address..."
                        value={data.cancel_reason}
                        onChange={e => setData('cancel_reason', e.target.value)}
                        rows="3"
                        required
                    />

                    <div className="mt-6 flex justify-end">
                        <button 
                            type="button" 
                            onClick={() => setShowCancelModal(false)} 
                            className="btn btn-secondary mr-2"
                        >
                            Back
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-danger" 
                            disabled={processing}
                        >
                            Confirm Cancellation
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}
