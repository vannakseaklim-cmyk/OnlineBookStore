// LoginModal.jsx
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

    // Initialize countdown on mount and when errors change
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

    // Countdown timer - runs every second
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
        return errors.email.split('|')[0]; // Get just the message without seconds
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLocked) {
            return; // Don't submit if locked
        }

        post(route('login'), {
            onSuccess: () => {
                reset('password');

                // get auth user
                const { auth } = page.props;
                console.log(auth.user?.roles);
                const isAdmin = auth.user?.roles?.some(role => role.name.toLowerCase() === 'admin');
                // redirect based on role
                Inertia.visit(isAdmin ? '/dashboard' : '/');

                // close modal
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

                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <button
                                type="button" 
                                onClick={onOpenRegister} // This calls the function you just added above
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
