import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import moment from 'moment';
import Navbar from '@/Components/Navbar'; 
import Footer from '@/Components/FooterGuest';
import Modal from '@/Components/Modal'; 
import { useState } from 'react';

export default function Index({ orders, auth }) {
    const ordersList = orders.data || [];
    const [selectedOrder, setSelectedOrder] = useState(null);

    const toNumber = (value) => parseFloat(value || 0);

    return (
        <> 
            <Head title="Order History" />
            <Navbar auth={auth} />

            <div className="pt-20 min-h-screen bg-[#f5eadf] pb-10">
                <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl">
                    <h1 className="text-3xl font-extrabold mb-8 text-gray-800">Order History</h1>
                
                    {ordersList.length > 0 ? (
                        <div className="grid gap-6">
                            {ordersList.map((order) => (
                                <div 
                                    key={order.id} 
                                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center"
                                >
                                    <div>
                                        <p className="text-sm text-gray-500">Order #{order.id}</p>
                                        <p className="font-semibold text-lg">
                                            ${toNumber(order.order_total).toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-400">{moment(order.order_date).format('MMMM DD, YYYY')}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                                        <span className={`inline-flex items-center justify-center px-4 py-2 min-w-[110px] text-xs font-semibold uppercase rounded-lg transition ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                        
                                        <button 
                                            onClick={() => setSelectedOrder(order)} 
                                            className="inline-flex items-center justify-center px-4 py-2 min-w-[110px] text-xs font-semibold uppercase rounded-lg bg-[#e5d3bf] text-blue-700 hover:bg-[#ecc395] transition"
                                        >
                                            View Detail
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-10 text-center rounded-lg shadow">
                            <p className="text-gray-500">No orders found yet.</p>
                            <Link href="/customer/books" className="inline-block mt-4 bg-[#bda081] text-white px-6 py-2 rounded">Start Shopping</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for selected order */}
            <Modal show={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="2xl">
                {selectedOrder && (() => {
                    const shippingFee = toNumber(selectedOrder.shipping_fee);

                    // Calculate subtotal from items
                    const subtotal = selectedOrder.items?.reduce((sum, item) => {
                        const price = item.book.discounted_price ? toNumber(item.book.discounted_price) : toNumber(item.book.price);
                        return sum + price * item.quantity;
                    }, 0);

                    const totalAmount = subtotal + shippingFee;

                    return (
                        <div className="p-0 bg-white rounded-xl overflow-hidden">
                            {/* Header */}
                            <div className="pt-4 pr-4 pl-4 pb-2 bg-[#e5d3bf] border-b flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight">Invoice #{selectedOrder.id}</h2>
                                    <p className="text-xs text-gray-500 font-medium uppercase">Status: {selectedOrder.status}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                            </div>

                            {selectedOrder.status === 'cancelled' && (
                                <div className="mx-6 mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                                    <strong>Reason:</strong> {selectedOrder.cancel_reason || 'N/A'}
                                </div>
                            )}

                            {/* Items */}
                            <div className="p-6 max-h-[50vh] overflow-y-auto">
                                <h3 className="font-bold mb-4 text-gray-700 uppercase text-xs border-b pb-2">Items Ordered</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                            <div className="flex items-center">
                                                <div className="h-16 w-12 flex-shrink-0 rounded border overflow-hidden bg-gray-100">
                                                    {item.book?.cover_image ? (
                                                        <img src={`/storage/${item.book.cover_image}`} className="h-full w-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-[10px] text-gray-400">No Cover</div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <p className="font-bold text-gray-900 text-sm">{item.book?.title || 'Book'}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.quantity} × <span>
                                                            ${(toNumber(item.book.discounted_price || item.book.price) * item.quantity).toFixed(2)}
                                                        </span> 
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-sm text-[#bda081]">
                                                ${(toNumber(item.book.discounted_price || item.book.price) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Shipping */}
                                    <div className="flex justify-between text-sm mt-4 border-t pt-2">
                                        <span>Shipping</span>
                                        <span className="font-semibold text-[#bda081]">${shippingFee.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Summary & Delivery */}
                            <div className="p-6 bg-gray-50 border-t grid grid-cols-2 gap-4">
                                <div className="text-xs text-gray-500">
                                    <p className="font-bold mb-1">Delivery To: {selectedOrder.shipping_address}</p>
                                    <p className="mt-1 font-bold">Customer Contact: {selectedOrder.phone_number}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 uppercase">Total Paid</p>
                                    <span className="text-[#bda081] font-bold text-lg">${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })()}
                {orders.links && (
                <div className="mt-6 mb-6 ml-4 p-2 border-t flex justify-between items-center">
                    <div className="flex justify-center flex-1">
                        {orders.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                className={`px-3 py-1 rounded mx-1 ${link.active ? 'bg-[#bda081] text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>

                    <div className="ml-4">
                        <a
                            href={`/customer/orders/${selectedOrder?.id}/invoice`}
                            target="_blank"
                            className="px-3 py-1 bg-[#bda081] text-white rounded hover:bg-[#a88b6c] transition"
                        >
                            Download Invoice
                        </a>
                    </div>
                </div>
            )}
            </Modal>


            <Footer />
        </> 
    );
}