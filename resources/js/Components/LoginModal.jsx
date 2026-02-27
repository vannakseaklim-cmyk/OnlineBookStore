import { useState, useEffect } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function LoginModal({  isOpen: propIsOpen, onClose, onOpenRegister, status, canResetPassword })  {
    const page = usePage();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [isOpen, setIsOpen] = useState(!!propIsOpen);
    const [countdown, setCountdown] = useState(null);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (propIsOpen !== undefined) setIsOpen(!!propIsOpen);
    }, [propIsOpen]);

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
        if (!isLocked || countdown === null || countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    setIsLocked(false);
                    return null;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isLocked, countdown]);

    const close = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    const getEmailError = () => {
        if (!errors.email) return null;
        return errors.email.split('|')[0]; 
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLocked) {
            return; 
        }

        post(route('login'), {
            onSuccess: () => {
                reset('password');

                const { auth } = page.props;
                console.log(auth.user?.roles);
                const isAdmin = auth.user?.roles?.some(role => role.name.toLowerCase() === 'admin');
               
                Inertia.visit(isAdmin ? '/dashboard' : '/');

                if (onClose) onClose();
            },
        });
    };


    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={close}
        >
            <div
                className="relative w-full max-w-md mx-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={close}
                    className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow text-gray-700 hover:text-gray-900"
                >
                    ✕
                </button>

                <div className="bg-white rounded-xl shadow-2xl p-6 w-full">
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
                            {getEmailError()} {countdown !== null && countdown > 0 && `(${countdown}s)`}
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
                            className="w-full bg-[#bda081] text-white py-3 rounded-lg font-semibold hover:bg-[#ddac78] transition duration-200 disabled:bg-[#bda081]"
                        >
                            {isLocked ? `Locked (${countdown}s)` : processing ? 'Logging in...' : 'Log in'}
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
                                close();
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
                            Don't have an account?{' '}
                            <button
                                type="button" 
                                onClick={onOpenRegister} 
                                className="text-[#bda081] hover:text-[#ddac78] font-semibold"
                            >
                                Register
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
