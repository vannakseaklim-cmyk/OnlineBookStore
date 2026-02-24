import React, { useEffect, useMemo, useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar'; 
import Footer from '@/Components/FooterGuest';
import Swal from 'sweetalert2';


const InputField = React.memo(({ label, id, value, onChange, error, type = 'text', placeholder, pattern }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-stone-700 mb-2">{label}</label>
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


export default function Checkout({ auth, cart }) {
    const { flash } = usePage().props; 

    const { data, setData, post, processing, errors } = useForm({
        phone_number: '',
        shipping_address: '',
        payment_method: 'delivery',
        transaction_image: null,
    });

    useEffect(() => {
        if (!flash?.error) return;

        Swal.fire({
            text: flash.error, 
            icon: 'error',
            confirmButtonText: 'Browse Books',
            confirmButtonColor: '#bd874e',
        });
    }, [flash?.error]);

    const shippingFee = 2.00;
    const subtotal = cart.items.reduce((t, i) => t + (parseFloat(i.price) * i.quantity), 0);
    const totalAmount = subtotal + shippingFee;

    const submit = (e) => {
        e.preventDefault();
        post(route('checkout.placeOrder'), { forceFormData: true });
    };

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setData('transaction_image', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="min-h-screen bg-[#f5eadf] text-stone-800">
            <Head title="Checkout" />
            <Navbar auth={auth} />

            <div className="pt-28 pb-20 container mx-auto px-6">
                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    
                    <div className="lg:col-span-2">
                        <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-lg border border-white space-y-8">
                            
                            <div>
                                <h2 className="text-xl font-bold mb-6 text-stone-800 border-b pb-3">Billing & Shipping</h2>
                                <div className="space-y-4">
                                    <InputField
                                        label="Phone Number"
                                        id="phone_number"
                                        type="tel"
                                        pattern="[0-9]*"
                                        placeholder="e.g., 012 345 678"
                                        value={data.phone_number}
                                        onChange={e => setData('phone_number', e.target.value)}
                                        error={errors.phone_number}
                                    />
                                    <InputField
                                        label="Detailed Shipping Address"
                                        id="shipping_address"
                                        placeholder="Street Name, House No, City..."
                                        value={data.shipping_address}
                                        onChange={e => setData('shipping_address', e.target.value)}
                                        error={errors.shipping_address}
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-6 text-stone-800 border-b pb-3">Payment Method</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {['delivery', 'online'].map((method) => (
                                            <button
                                                key={method}
                                                type="button"
                                                onClick={() => setData('payment_method', method)}
                                                className={`py-3 rounded-lg text-sm font-semibold transition-all border ${data.payment_method === method ? 'bg-[#375ed3] text-white border-stone-900' : 'bg-stone-50 text-stone-500 border-stone-100 hover:border-stone-300'}`}
                                            >
                                                {method === 'delivery' ? '🚚 Cash on Delivery' : '💳 Online Payment'}
                                            </button>
                                        ))}
                                    </div>

                                    {data.payment_method === 'online' && (
                                        <div className="bg-stone-50 p-6 rounded-lg border border-dashed border-stone-200 text-center">
                                            <p className="font-semibold text-stone-700 mb-3">Scan QR Code</p>

                                            <img 
                                                src="/images/image.png" 
                                                alt="QR" 
                                                className="w-64 h-64 mx-auto mb-4 rounded-md shadow-sm object-contain" 
                                            />

                                            <input
                                                type="file"
                                                className="w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#bd874e] file:text-white"
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />

                                            {preview && (
                                                <div className="mt-4 flex flex-col items-start">
                                                    <img 
                                                        src={preview} 
                                                        alt="Payment proof preview" 
                                                        className="w-32 h-40 rounded-md shadow-md border-2 border-[#bd874e] object-contain" 
                                                    />
                                                    {image && (
                                                        <p className="text-xs text-stone-500 mt-2">
                                                            {image.name}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#bda081] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#a68b6d] transition disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : 'Continue to checkout'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-xl shadow-lg border border-white sticky top-28">
                        <h2 className="text-xl font-bold mb-6 text-stone-800 flex items-center justify-between">
                            Cart
                            <span className="text-sm bg-stone-100 px-3 py-1 rounded-full text-stone-600">
                                {cart.items.length}
                            </span>
                        </h2>
                        
                        <div className="space-y-4 mb-6">
                            {cart.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-stone-700">
                                        {item.book.title} <span className="text-stone-400">×{item.quantity}</span>
                                    </span>
                                    <span className="font-semibold text-stone-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-stone-700">Shipping</span>
                                <span className="font-semibold text-stone-900">$2.00</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-stone-200">
                            <div className="flex justify-between text-base font-bold text-stone-800">
                                <span>Total Amount:</span>
                                <span className="text-[#bd874e]">${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}
