"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BsShieldLock } from 'react-icons/bs';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';

const AdminLoginForm = () => {
    const router = useRouter();
    const { login, isLoading, clearError } = useAuthStore();

    // Form states
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        clearError();

        const result = await login({
            email: loginData.email,
            password: loginData.password,
        });

        if (result.success) {
            toast.success("Welcome back! Dashboard is ready. 👋");
            router.push('/dashboard');
        } else {
            toast.error(result.message);
        }
    };



    return (
        <div className="admin-login-bg">
            <div className='container'>
                <div className="admin-auth-card">

                    {/* Front: Login */}
                    <div className="admin-auth-face admin-auth-front glass-panel">
                        <div className="admin-auth-header">
                            <div className="admin-auth-icon-wrap">
                                <BsShieldLock className="admin-auth-icon" />
                            </div>
                            <h2 className="admin-auth-title">Welcome Back</h2>
                            <p className="admin-auth-subtitle">
                                Good to see you again. Sign in to manage your Abeer Label store.
                            </p>
                        </div>

                        <form className="admin-auth-form" onSubmit={handleLoginSubmit}>
                            <div className="admin-form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="admin@abeerlabel.com"
                                    className="admin-auth-input"
                                    required
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="admin-auth-input"
                                    required
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="admin-auth-actions">
                                <label className="admin-auth-remember">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <Link href="#" className="admin-auth-forgot">Forgot Password?</Link>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing In..." : "Sign In to Dashboard"}
                            </button>
                        </form>

                        <div className="admin-auth-footer">
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Contact your administrator for access.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminLoginForm;