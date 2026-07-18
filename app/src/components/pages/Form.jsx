"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

const Form = ({ isLogin, setIsLogin }) => {
  const router = useRouter();
  const { login, signup, isLoading, error, clearError } = useAuthStore();

  // ─── FORM STATE ─────────────────────────────────────────────────────────────
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ firstName: "", lastName: "", email: "", password: "" });

  // ─── HANDLERS ───────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();

    const result = await login({
      email: loginData.email,
      password: loginData.password,
    });

    if (result.success) {
      toast.success("Welcome back! 👋");
      router.push("/");
    } else {
      toast.error(result.message);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    clearError();

    const name = `${signupData.firstName.trim()} ${signupData.lastName.trim()}`.trim();

    if (!name) {
      toast.error("Please enter your name");
      return;
    }

    const result = await signup({
      name,
      email: signupData.email,
      password: signupData.password,
    });

    if (result.success) {
      toast.success("Account created! Welcome to Abeer Label 🎉");
      router.push("/");
    } else {
      toast.error(result.message);
    }
  };

  const switchToSignup = () => {
    clearError();
    setIsLogin(false);
  };

  const switchToLogin = () => {
    clearError();
    setIsLogin(true);
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="auth-scene">
      <div className={`auth-card ${isLogin ? "" : "is-flipped"}`}>

        {/* ── LOGIN FACE ── */}
        <div className="auth-face auth-front">
          <div className="auth-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to access your Abeer Label account.</p>
          </div>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                className="co-input"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                className="co-input"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            <div className="auth-actions">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link href="#" className="auth-forgot">Forgot Password?</Link>
            </div>
            <button type="submit" className="button-primary" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Log In"}
            </button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <button onClick={switchToSignup} className="auth-toggle-btn">Create one</button></p>
          </div>
        </div>

        {/* ── SIGNUP FACE ── */}
        <div className="auth-face auth-back">
          <div className="auth-header">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join the exclusive Abeer Label community.</p>
          </div>
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-grid">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="First Name"
                  className="co-input"
                  required
                  value={signupData.firstName}
                  onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="co-input"
                  value={signupData.lastName}
                  onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                className="co-input"
                required
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                className="co-input"
                required
                minLength={6}
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />
            </div>
            <button type="submit" className="button-primary" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          <div className="auth-footer">
            <p>Already have an account? <button onClick={switchToLogin} className="auth-toggle-btn">Log In</button></p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Form;