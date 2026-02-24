// Login.jsx
import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [countdown, setCountdown] = useState(null);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (errors.email && errors.email.includes('|')) {
            const [message, seconds] = errors.email.split('|');
            const remaining = parseInt(seconds);
            
            if (remaining > 0) {
                setIsLocked(true);
                setCountdown(remaining);
            }
        }
    }, [errors.email]);

    useEffect(() => {
        if (countdown === null || countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown(countdown - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    useEffect(() => {
        if (countdown === 0) {
            setIsLocked(false);
            setCountdown(null);
        }
    }, [countdown]);

    const getEmailError = () => {
        if (!errors.email) return null;
        return errors.email.split('|')[0]; // Get just the message without seconds
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLocked) return;
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />
            <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
                        <p className="text-gray-600">Log in to your account</p>
                        <img
                            src="/images/jong an.png"
                            alt="Login Illustration"
                            className="mx-auto my-3 w-20 h-20 rounded-full object-cover"
                        />
                    </div>

                    {status && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {status}
                        </div>
                    )}

                    {errors.email && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <p>{getEmailError()}</p>
                            {countdown !== null && countdown > 0 && (
                                <div className="mt-3 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-200 border-4 border-red-400">
                                        <span className="text-2xl font-bold text-red-700">{countdown}</span>
                                    </div>
                                    <p className="mt-2 text-sm">Please wait to try again</p>
                                </div>
                            )}
                        </div>
                    )}
                    {errors.password && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {errors.password}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddac78]"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ddac78]"
                            required
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-[#bda081] border-gray-300 rounded"
                                />
                                <span className="ms-2 text-sm text-gray-600">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-[#bda081] hover:text-[#ddac78] text-sm font-semibold"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || isLocked}
                            className="w-full bg-[#bda081] text-white py-3 rounded-lg font-semibold hover:bg-[#ddac78] transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLocked ? `Locked (${countdown}s)` : processing ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                className="text-[#bda081] hover:text-[#ddac78] font-semibold"
                            >
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
