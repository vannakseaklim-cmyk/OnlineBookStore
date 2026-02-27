import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar'; 
import Footer from '@/Components/FooterGuest';
import Swal from 'sweetalert2';

const InputField = React.memo(({ label, id, value, onChange, error, type = 'text', placeholder, pattern }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-stone-700 mb-2">
            {label}
        </label>
        <input
            type={type}
            id={id}
            placeholder={placeholder}
            pattern={pattern}
            className={`w-full border-0 bg-white rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-[#bd874e] transition ${error ? 'ring-2 ring-red-500' : ''}`}
            value={value}
            onChange={onChange}
            required 
        />
        {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
));

export default function Checkout({ auth, cart, deliveries = [], qrcodes = [] }) {

    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        phone_number: '',
        shipping_address: '',
        delivery_id: '',
        payment_method: 'delivery',
        transaction_image: null,
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // 🔹 Find selected delivery
    const selectedDelivery = deliveries.find(
        d => d.id == data.delivery_id
    );

    const shippingFee = selectedDelivery
        ? parseFloat(selectedDelivery.cost)
        : 0;

    const subtotal = cart.items.reduce((t, i) => {
    const price = i.book.discounted_price
        ? parseFloat(i.book.discounted_price)
        : parseFloat(i.book.price);

        return t + price * i.quantity;
    }, 0);

    const totalAmount = subtotal + shippingFee;

    useEffect(() => {
        if (!flash?.error) return;

        Swal.fire({
            text: flash.error,
            icon: 'error',
            confirmButtonColor: '#bd874e',
        });
    }, [flash?.error]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setData('transaction_image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('checkout.placeOrder'), { forceFormData: true });
    };

    return (
        <div className="min-h-screen bg-[#f5eadf] text-stone-800">
            <Head title="Checkout" />
            <Navbar auth={auth} />

            <div className="pt-28 pb-20 container mx-auto px-6">
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* LEFT SIDE */}
                    <div className="lg:col-span-2">
                        <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg space-y-8">

                            <div>
                                <h2 className="text-xl font-bold mb-6 border-b pb-3">
                                    Billing & Shipping
                                </h2>

                                <div className="space-y-4">

                                    <InputField
                                        label="Phone Number"
                                        id="phone_number"
                                        value={data.phone_number}
                                        onChange={e => setData('phone_number', e.target.value)}
                                        error={errors.phone_number}
                                    />

                                    {/* 🔹 Delivery Select */}
                                    <select
                                        className="w-full px-4 py-3 border rounded-xl"
                                        value={data.delivery_id}
                                        onChange={(e) => setData('delivery_id', e.target.value)}
                                        required
                                    >
                                        <option value="">Select Location</option>
                                        {deliveries.map(delivery => (
                                            <option key={delivery.id} value={delivery.id}>
                                                {delivery.location} 
                                            </option>
                                        ))}
                                    </select>

                                    <InputField
                                        label="Detailed Shipping Address"
                                        id="shipping_address"
                                        value={data.shipping_address}
                                        onChange={e => setData('shipping_address', e.target.value)}
                                        error={errors.shipping_address}
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-6 border-b pb-3">
                                    Payment Method
                                </h2>

                                <div className="space-y-4">
                                    {/* QR Code Payment */}
                                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-stone-50" style={{ borderColor: data.payment_method === 'qr' ? '#bda081' : '#e5e7eb' }}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="qr"
                                            checked={data.payment_method === 'qr'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="ml-3 flex-grow">
                                            <strong>QR Code Payment</strong>
                                            <p className="text-sm text-stone-600">Pay using QR code scan</p>
                                        </span>
                                    </label>

                                    {data.payment_method === 'qr' && (
                                        <div className="bg-stone-50 p-4 rounded-lg space-y-4">
                                            {qrcodes.length > 0 ? (
                                                <div>
                                                    <label className="block text-sm font-semibold mb-3">Scan QR Code to Pay</label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {qrcodes.map(qr => (
                                                            <div key={qr.id} className="bg-white p-3 rounded-lg border text-center">
                                                                <img
                                                                    src={`/storage/${qr.qr_image}`}
                                                                    alt={qr.bank_name}
                                                                    className="w-full max-w-xs mx-auto rounded"
                                                                />
                                                                <p className="text-sm font-semibold mt-2">{qr.bank_name}</p>
                                                                {qr.description && <p className="text-xs text-stone-600">{qr.description}</p>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-stone-600">No QR codes available for payment.</p>
                                            )}

                                            <div className="border-t pt-4">
                                                <label className="block text-sm font-semibold mb-2">Upload Payment Proof</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className={`block w-full text-sm ${errors.transaction_image ? 'border-red-500' : ''}`}
                                                />
                                                {preview && (
                                                    <div className="mt-3">
                                                        <img src={preview} alt="Preview" className="max-w-xs rounded-lg" />
                                                    </div>
                                                )}
                                                {errors.transaction_image && <p className="text-red-500 text-xs">{errors.transaction_image}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {/* Pay on Delivery */}
                                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-stone-50" style={{ borderColor: data.payment_method === 'delivery' ? '#bda081' : '#e5e7eb' }}>
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="delivery"
                                            checked={data.payment_method === 'delivery'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="ml-3 flex-grow">
                                            <strong>Pay on Delivery</strong>
                                            <p className="text-sm text-stone-600">Pay when the order arrives</p>
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#bda081] text-white px-6 py-3 rounded-lg shadow hover:bg-[#a68b6d] transition font-semibold"
                            >
                                {processing ? 'Processing...' : 'Place Order'}
                            </button>

                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-xl shadow-lg sticky top-28">

                            <h2 className="text-xl font-bold mb-6 flex justify-between">
                                Order Summary
                                <span className="text-sm bg-stone-100 px-3 py-1 rounded-full">
                                    {cart.items.length}
                                </span>
                            </h2>

                            <div className="space-y-4 mb-6">
                                {cart.items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>
                                            {item.book.title} ×{item.quantity}
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
                                ))}

                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-[#bda081]">
                                        ${shippingFee.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                                <div className="border-t pt-4 flex justify-between items-center font-bold text-lg text-gray-900">
                                    <span>Total Amount:</span>
                                    <span className="text-[#bda081]">
                                        ${totalAmount.toFixed(2)}
                                    </span>
                                </div>
                           

                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
}