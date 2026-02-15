import React, { useState } from 'react';

const Signup = ({ onBack, onLoginSwitch, isAdminContext = false }) => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: isAdminContext ? 'admin' : 'customer'
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)

            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user || data));

                setSuccess('Registration successful! Please login.');

                // Clear the form
                setForm({
                    name: '',
                    email: '',
                    password: '',
                    role: 'customer'
                });

                setTimeout(() => {
                    onLoginSwitch();
                }, 1500);

            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }

    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-sm p-10 w-full max-w-[450px] shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">

                {/* Close Button */}
                <button
                    onClick={onBack}
                    className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-center mb-2 uppercase tracking-tight">Create Account</h2>
                <p className="text-[10px] text-gray-400 text-center mb-8 uppercase tracking-[0.2em]">Join the DecoMart Community</p>

                <form className="space-y-4" onSubmit={handleRegister}>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}

                    {/* Name Field */}
                    <div>
                        <label className="text-[10px] font-bold tracking-widest uppercase mb-2 block">Full Name</label>
                        <input
                            type="text"
                            value={form.name}
                            placeholder="Enter your name..."
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-100 bg-[#f9f9f9] text-xs outline-none focus:border-[#f25a2b] transition-colors"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="text-[10px] font-bold tracking-widest uppercase mb-2 block">Email Address</label>
                        <input
                            type="email"
                            value={form.email}
                            placeholder="Your email address..."
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-100 bg-[#f9f9f9] text-xs outline-none focus:border-[#f25a2b] transition-colors"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="text-[10px] font-bold tracking-widest uppercase mb-2 block">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            placeholder="Create password..."
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-100 bg-[#f9f9f9] text-xs outline-none focus:border-[#f25a2b] transition-colors"
                        />
                    </div>

                    {/* User Role Section */}
                    <div>
                        <label className="text-[10px] font-bold tracking-widest uppercase mb-3 block">
                            Account Type
                        </label>

                        <div className="flex gap-4">
                            {isAdminContext ? (
                                // Only admin visible in admin dashboard
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        checked
                                        readOnly
                                        className="accent-[#f25a2b]"
                                    />
                                    <span className="text-[11px] uppercase tracking-wider text-gray-600">
                                        Admin
                                    </span>
                                </label>
                            ) : (
                                // Public view → only customer & seller
                                ['customer', 'seller'].map((role) => (
                                    <label key={role} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role}
                                            checked={form.role === role}
                                            onChange={(e) =>
                                                setForm({ ...form, role: e.target.value })
                                            }
                                            className="accent-[#f25a2b]"
                                        />
                                        <span className="text-[11px] uppercase tracking-wider text-gray-600 group-hover:text-black">
                                            {role}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#f25a2b] text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 mt-4">
                        Register Now
                    </button>

                    <p className="text-center text-[11px] text-gray-500 mt-6 tracking-wide">
                        Already have an account? <span onClick={onLoginSwitch} className="text-[#f25a2b] font-bold cursor-pointer hover:underline">LOGIN</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;