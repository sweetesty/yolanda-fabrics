import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CreditCard, ShieldCheck, Mail, Lock, User, Phone, ArrowLeft, CheckCircle } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  
  const { login, registerUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("register"); // Default to register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (activeTab === "login") {
      const res = await login(email, password);
      if (res.success) {
        // Check if they are a brand new user who just signed up
        const isNew = localStorage.getItem("yf_is_new_user") === "true";
        if (isNew) {
          localStorage.setItem("yf_show_welcome", "new");
          localStorage.removeItem("yf_is_new_user");
        } else {
          localStorage.setItem("yf_show_welcome", "returning");
        }

        setIsSubmitting(false);
        if (res.user?.role === "admin") {
          navigate("/admin");
        } else if (redirect === "checkout") {
          navigate("/checkout");
        } else {
          navigate("/");
        }
      } else {
        setIsSubmitting(false);
        setError(res.error || "Login failed.");
      }
    } else {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setError("Please fill out all required fields.");
        setIsSubmitting(false);
        return;
      }
      
      const res = await registerUser(email, password, fullName, phone);
      if (res.success) {
        // Flag that they are a brand new user
        localStorage.setItem("yf_is_new_user", "true");
        setIsSubmitting(false);
        setSuccessMessage("Your luxury account is ready! Please sign in below to authenticate.");
        setEmail("");
        setPassword("");
        setFullName("");
        setPhone("");
        setActiveTab("login");
      } else {
        setIsSubmitting(false);
        setError(res.error || "Registration failed.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#111111] font-sans flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
      <div className="noise" />

      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-xs uppercase tracking-widest text-[#777777] hover:text-[#111111] transition-colors bg-transparent border-none cursor-pointer"
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Main card */}
      <div className="w-full max-w-md bg-white border border-[rgba(184,150,46,0.18)] shadow-2xl relative p-8 md:p-10 z-10">
        {/* Luxury Gold Header Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B8962E] via-[#E6D5A0] to-[#7A6318]" />

        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 no-underline mb-4">
            <img src="/logo.jpeg" alt="Logo" className="w-9 h-9 object-contain rounded-full border border-[rgba(184,150,46,0.2)]" />
            <div className="text-left">
              <span className="font-serif text-xs tracking-widest uppercase text-[#111111] block font-semibold">Yolanda Fabrics</span>
              <span className="text-[5px] tracking-[0.35em] text-[#777777] block font-light uppercase">Bespoke Atelier</span>
            </div>
          </a>

          {/* Checkout restriction prompt */}
          {redirect === "checkout" && (
            <div className="bg-[#B8962E]/5 border border-[rgba(184,150,46,0.25)] p-4 text-left mb-6">
              <div className="flex gap-3">
                <CreditCard size={18} className="text-[#B8962E] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#111111] block">Authentication Required</span>
                  <span className="text-[9px] text-[#777777] leading-relaxed block mt-1">
                    You must sign up for a customer account or log in first to secure your premium order and proceed to checkout.
                  </span>
                </div>
              </div>
            </div>
          )}

          <h2 className="font-serif text-xl tracking-wide uppercase m-0">
            {activeTab === "register" ? "Create An Account" : "Welcome Back"}
          </h2>
          <p className="text-[10px] text-[#777777] tracking-wider uppercase font-light mt-1">
            {activeTab === "register" ? "Join the Yolanda Fabrics Circle" : "Sign In to Your Bespoke Profile"}
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-[rgba(184,150,46,0.15)] mb-6">
          <button 
            type="button"
            onClick={() => { setActiveTab("register"); setError(null); setSuccessMessage(null); }}
            className={`flex-1 text-center py-2.5 text-[9px] tracking-[0.2em] uppercase font-bold bg-transparent border-none cursor-pointer transition-all ${
              activeTab === "register" ? "text-[#B8962E] border-b-2 border-solid border-[#B8962E]" : "text-[#777777]"
            }`}
          >
            Create Account
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab("login"); setError(null); setSuccessMessage(null); }}
            className={`flex-1 text-center py-2.5 text-[9px] tracking-[0.2em] uppercase font-bold bg-transparent border-none cursor-pointer transition-all ${
              activeTab === "login" ? "text-[#B8962E] border-b-2 border-solid border-[#B8962E]" : "text-[#777777]"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Form status states */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[10px] py-2.5 px-4 mb-4 rounded-none font-sans">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-[#B8962E]/10 border border-[#B8962E]/25 text-[#111111] text-[10px] py-3 px-4 mb-4 rounded-none font-sans flex items-start gap-2.5">
            <CheckCircle size={14} className="text-[#B8962E] shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "register" && (
            <>
              <div className="space-y-1 text-left">
                <label className="text-[9px] uppercase tracking-widest text-[#777777] font-semibold block">Full Name *</label>
                <div className="relative">
                  <User size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your first & last name"
                    className="w-full bg-[#FAFAF7] border border-[rgba(184,150,46,0.25)] focus:border-[#B8962E] text-xs py-3.5 pl-10 pr-4 outline-none font-sans transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[9px] uppercase tracking-widest text-[#777777] font-semibold block">Phone Number</label>
                <div className="relative">
                  <Phone size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +234 801 234 5678"
                    className="w-full bg-[#FAFAF7] border border-[rgba(184,150,46,0.25)] focus:border-[#B8962E] text-xs py-3.5 pl-10 pr-4 outline-none font-sans transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1 text-left">
            <label className="text-[9px] uppercase tracking-widest text-[#777777] font-semibold block">Email Address *</label>
            <div className="relative">
              <Mail size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full bg-[#FAFAF7] border border-[rgba(184,150,46,0.25)] focus:border-[#B8962E] text-xs py-3.5 pl-10 pr-4 outline-none font-sans transition-all"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[9px] uppercase tracking-widest text-[#777777] font-semibold block">Password *</label>
            <div className="relative">
              <Lock size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAFAF7] border border-[rgba(184,150,46,0.25)] focus:border-[#B8962E] text-xs py-3.5 pl-10 pr-4 outline-none font-sans transition-all"
              />
            </div>
            {activeTab === "register" && (
              <span className="text-[7.5px] text-[#777777] block mt-1">Must be at least 6 characters.</span>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#111111] hover:bg-[#B8962E] text-[#FFFFFF] font-sans text-[9px] tracking-[0.2em] uppercase font-bold py-4 px-4 transition-all duration-300 shadow-md border-none cursor-pointer flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck size={12} />
                {activeTab === "register" ? "Create Account" : "Authenticate Account"}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-[rgba(184,150,46,0.1)] pt-4 text-center">
          <p className="text-[8px] text-[#777777] leading-relaxed max-w-[280px] mx-auto uppercase tracking-wide">
            By accessing Yolanda Fabrics, you agree to our terms of couture patronage and secure payment protocols.
          </p>
        </div>
      </div>
    </div>
  );
}
