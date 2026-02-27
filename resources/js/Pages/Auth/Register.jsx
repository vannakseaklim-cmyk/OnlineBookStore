import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [customError, setCustomError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setCustomError('');

        if (data.password !== data.password_confirmation) {
            setCustomError('Passwords do not match');
            return;
        }

        if (data.password.length < 8) {
            setCustomError('Password must be at least 8 characters');
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (errs) => {
                const messages = Object.values(errs).flat().join(' ');
                setCustomError(messages);
            },
        });
    };

    const FormContent = (
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
                <p className="text-gray-600">Join our bookstore community</p>
                <img
                    src="/images/jong an.png"
                    alt="Register Illustration"
                    className="mx-auto my-3 w-20 h-20 rounded-full object-cover"
                />
            </div>

            {customError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {customError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddac78]"
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddac78]"
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddac78]"
                        placeholder="••••••••"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                </div>

                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddac78]"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-[#bda081] text-white py-3 rounded-lg font-semibold hover:bg-[#ddac78] transition duration-200 disabled:bg-[#bda081]"
                >
                    {processing ? 'Creating Account...' : 'Register'}
                </button>
            </form>

            <div className="mt-4">
                <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <div className="text-sm text-gray-500">or</div>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                <a
                    href="/auth/google"
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/auth/google';
                    }}
                    className="w-full inline-flex items-center justify-center gap-3 border border-gray-200 hover:shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white"
                >
                    <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                        <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-54.8H272v103.8h147.1c-6.3 34.1-25.5 62.9-54.3 82v68.2h87.7c51.2-47.2 81-116.6 81-199.9z" fill="#4285F4"/>
                        <path d="M272 544.3c73.6 0 135.4-24.4 180.6-66.2l-87.7-68.2c-24.4 16.4-55.6 26.1-92.9 26.1-71.5 0-132.1-48.3-153.8-113.3H30.8v71.1C75.5 491.6 167 544.3 272 544.3z" fill="#34A853"/>
                        <path d="M118.2 329.7c-10.8-32.3-10.8-66.9 0-99.2V159.4H30.8c-39.6 78.6-39.6 171.6 0 250.2l87.4-79.9z" fill="#FBBC05"/>
                        <path d="M272 108.6c39 0 74 13.4 101.6 39.8l76.1-76.1C405.7 28.4 344 0 272 0 167 0 75.5 52.7 30.8 139.3l87.4 71.1C139.9 156.9 200.5 108.6 272 108.6z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </a>
            </div>

            <div className="mt-4 text-center">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link href={route('login')} className="text-[#bda081] hover:text-[#ddac78] font-semibold">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
                {FormContent}
            </div>
        </>
    );
}
