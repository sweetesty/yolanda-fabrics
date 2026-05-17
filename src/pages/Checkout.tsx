import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CreditCard, ArrowLeft, CheckCircle, ShoppingBag, Truck, ShieldCheck, ExternalLink } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Lagos",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Shipping Calculations (₦3,000 flat, free above ₦50,000)
  const shippingFee = cartTotal >= 50000 || cartTotal === 0 ? 0 : 3000;
  const grandTotal = cartTotal + shippingFee;

  // Dynamically load Paystack Inline SDK
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const existing = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
      if (existing) {
        document.body.removeChild(existing);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Valid Email Address is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Shipping Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_b85bc88ee27e8a93910c2c15386fae8be4803b90"; // Test key fallback
    const uniqueRef = `FBY-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    const paystack = (window as any).PaystackPop;
    if (!paystack) {
      alert("Payment gateway is initializing. Please try again in a few seconds.");
      setIsProcessing(false);
      return;
    }

    const handler = paystack.setup({
      key: paystackKey,
      email: formData.email,
      amount: Math.round(grandTotal * 100), // in kobo
      currency: "NGN",
      ref: uniqueRef,
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: formData.name,
          },
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: formData.phone,
          },
          {
            display_name: "Shipping Destination",
            variable_name: "shipping_destination",
            value: `${formData.address}, ${formData.city}, ${formData.state}`,
          },
          {
            display_name: "Order Notes",
            variable_name: "order_notes",
            value: formData.notes,
          }
        ],
      },
      callback: function (response: any) {
        setPaymentRef(response.reference || uniqueRef);
        setPaymentSuccess(true);
        setIsProcessing(false);
        clearCart();
      },
      onClose: function () {
        setIsProcessing(false);
      },
    });

    handler.openIframe();
  };

  // ─── STATE: SUCCESS PAGE ───
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] text-[#111111] font-sans pt-[80px] pb-16 px-4">
        {/* Decorative Grid Noise overlay */}
        <div className="noise" />

        <div className="max-w-3xl mx-auto bg-white border border-[rgba(184,150,46,0.18)] shadow-2xl p-8 md:p-12 relative">
          {/* Gold header accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B8962E] via-[#E6D5A0] to-[#7A6318]" />

          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 bg-[#B8962E]/10 rounded-full flex items-center justify-center mb-6 border border-[#B8962E]/25">
              <CheckCircle size={36} className="text-[#B8962E]" />
            </div>

            <span className="text-[10px] tracking-[0.3em] uppercase text-[#B8962E] font-bold mb-2">Order Confirmed</span>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#111111] mb-3 uppercase tracking-wide">
              Bespoke Purchase Secured
            </h1>
            <p className="text-[#777777] text-xs font-light max-w-md leading-relaxed mb-10">
              Your transaction is complete. Our Lagos master tailors and shipping desk have reserved your selections. A confirmation email has been dispatched.
            </p>

            {/* Custom Premium Receipt */}
            <div className="w-full border-t border-b border-[rgba(184,150,46,0.18)] py-8 px-2 space-y-6 text-left">
              <h3 className="font-serif text-xs uppercase tracking-widest text-[#111111] m-0 border-b border-[rgba(184,150,46,0.1)] pb-3">
                Transaction Invoice
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs font-sans">
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-wider text-[#777777] block">Payment Reference</span>
                  <span className="font-mono font-bold text-[#111111]">{paymentRef}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-wider text-[#777777] block">Secured Customer</span>
                  <span className="font-medium text-[#111111]">{formData.name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-wider text-[#777777] block">Delivery Location</span>
                  <span className="font-medium text-[#111111]">{formData.address}, {formData.city}, {formData.state}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] uppercase tracking-wider text-[#777777] block">Contact Phone</span>
                  <span className="font-mono text-[#111111]">{formData.phone}</span>
                </div>
              </div>

              {formData.notes.trim() && (
                <div className="bg-[#FAFAF7] border border-[rgba(184,150,46,0.1)] p-3 text-[10px] text-[#777777] font-light leading-relaxed">
                  <strong className="text-[#111111]">Atelier Note:</strong> "{formData.notes}"
                </div>
              )}
            </div>

            {/* Total Paid Block */}
            <div className="my-8 flex justify-between items-center w-full px-2">
              <span className="text-xs uppercase tracking-widest text-[#777777] font-semibold">Total Paid Online</span>
              <span className="font-serif text-2xl font-bold text-[#B8962E] font-mono">
                ₦{grandTotal.toLocaleString()}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button 
                onClick={() => navigate("/")}
                className="bg-[#111111] hover:bg-[#B8962E] text-white font-sans text-[10px] tracking-[0.2em] uppercase font-bold py-4 px-8 transition-all duration-300 border-none cursor-pointer flex items-center justify-center gap-2"
              >
                Return to Collections
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── STATE: EMPTY CART CHECK ───
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] text-[#111111] font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[rgba(184,150,46,0.18)] p-10 text-center shadow-xl">
          <ShoppingBag size={48} className="text-[#B8962E] mx-auto mb-6" />
          <h2 className="font-serif text-xl tracking-wide uppercase text-[#111111] mb-2">Your Bag is Empty</h2>
          <p className="text-[#777777] text-xs font-light leading-relaxed mb-8">
            Please add luxury fabrics to your bag before proceeding to the checkout interface.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="w-full bg-[#111111] hover:bg-[#B8962E] text-white font-sans text-[10px] tracking-[0.25em] uppercase font-bold py-4 px-6 border-none cursor-pointer transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#111111] font-sans pb-24 selection:bg-[#B8962E]/20">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 h-[80px] bg-white border-b border-[rgba(184,150,46,0.15)] z-40 flex items-center px-6 md:px-12 justify-between">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#777777] hover:text-[#111111] bg-transparent border-none cursor-pointer font-sans text-[10px] tracking-widest uppercase font-bold transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <a href="/" className="flex items-center gap-3 no-underline">
          <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 object-contain rounded-full border border-[rgba(184,150,46,0.2)]" />
          <div className="text-left">
            <span className="font-serif text-sm tracking-widest uppercase text-[#111111] block font-semibold leading-tight">Yolanda Fabrics</span>
            <span className="text-[6px] tracking-[0.35em] text-[#777777] block font-light uppercase">Bespoke Atelier</span>
          </div>
        </a>

        <div className="w-[80px] hidden md:block" /> {/* Balance */}
      </header>

      {/* Main Checkout Split */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-[130px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form (7 cols) */}
        <section className="lg:col-span-7 bg-white border border-[rgba(184,150,46,0.15)] p-6 md:p-8 shadow-sm">
          <div className="border-b border-[rgba(184,150,46,0.12)] pb-4 mb-6">
            <h2 className="font-serif text-base tracking-widest uppercase text-[#111111] m-0">1. Shipping &amp; Payment Details</h2>
            <p className="text-[#777777] text-[10px] font-light leading-relaxed m-0 mt-1">
              Provide your details below to compile your bespoke delivery destination and secure your luxury card gateway.
            </p>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            
            {/* Input: Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-[#111111] font-bold">Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Yolanda Alakija" 
                className={`w-full bg-[#FAFAF7] border ${formErrors.name ? 'border-red-500' : 'border-[rgba(184,150,46,0.25)]'} focus:border-[#B8962E] text-xs py-3 px-4 outline-none font-sans transition-all`}
                disabled={isProcessing}
              />
              {formErrors.name && <span className="text-[9px] text-red-500 font-medium">{formErrors.name}</span>}
            </div>

            {/* Input: Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-[#111111] font-bold">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="yolanda@gmail.com" 
                  className={`w-full bg-[#FAFAF7] border ${formErrors.email ? 'border-red-500' : 'border-[rgba(184,150,46,0.25)]'} focus:border-[#B8962E] text-xs py-3 px-4 outline-none font-sans transition-all`}
                  disabled={isProcessing}
                />
                {formErrors.email && <span className="text-[9px] text-red-500 font-medium">{formErrors.email}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-[#111111] font-bold">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="+234 80 1234 5678" 
                  className={`w-full bg-[#FAFAF7] border ${formErrors.phone ? 'border-red-500' : 'border-[rgba(184,150,46,0.25)]'} focus:border-[#B8962E] text-xs py-3 px-4 outline-none font-sans transition-all`}
                  disabled={isProcessing}
                />
                {formErrors.phone && <span className="text-[9px] text-red-500 font-medium">{formErrors.phone}</span>}
              </div>
            </div>

            {/* Input: Shipping Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-[#111111] font-bold">Shipping Address</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                placeholder="Flat 3, Ikoyi Palace Gardens" 
                className={`w-full bg-[#FAFAF7] border ${formErrors.address ? 'border-red-500' : 'border-[rgba(184,150,46,0.25)]'} focus:border-[#B8962E] text-xs py-3 px-4 outline-none font-sans transition-all`}
                disabled={isProcessing}
              />
              {formErrors.address && <span className="text-[9px] text-red-500 font-medium">{formErrors.address}</span>}
            </div>

            {/* Input: City & State */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-[#111111] font-bold">City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  placeholder="Ikoyi" 
                  className={`w-full bg-[#FAFAF7] border ${formErrors.city ? 'border-red-500' : 'border-[rgba(184,150,46,0.25)]'} focus:border-[#B8962E] text-xs py-3 px-4 outline-none font-sans transition-all`}
                  disabled={isProcessing}
                />
                {formErrors.city && <span className="text-[9px] text-red-500 font-medium">{formErrors.city}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-wider text-[#111111] font-bold">State</label>
                <select 
                  name="state" 
                  value={formData.state} 
                  onChange={handleInputChange} 
                  className="w-full bg-[#FAFAF7] border border-[rgba(184,150,46,0.25)] focus:border-[#B8962E] text-xs py-3 px-4 outline-none font-sans transition-all"
                  disabled={isProcessing}
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Delta">Delta</option>
                  <option value="Enugu">Enugu</option>
                </select>
              </div>
            </div>

            {/* Input: Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-[#111111] font-bold">Atelier Instructions / Notes (Optional)</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
                placeholder="Specific custom yard request or timing details..." 
                className="w-full bg-[#FAFAF7] border border-[rgba(184,150,46,0.25)] focus:border-[#B8962E] text-xs py-3 px-4 outline-none font-sans h-24 resize-none transition-all"
                disabled={isProcessing}
              />
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-3 p-4 bg-[#FAFAF7] border border-[rgba(184,150,46,0.15)] text-[#777777]">
              <ShieldCheck size={20} className="text-[#B8962E] shrink-0" />
              <p className="text-[9px] leading-relaxed font-light m-0">
                You are protected by Paystack's bank-grade security network. Yolanda Fabrics does not store your card numbers or CVV.
              </p>
            </div>

            {/* CTA */}
            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#B8962E] hover:bg-[#7A6318] disabled:bg-[#B8962E]/50 text-white font-sans text-[10px] tracking-[0.25em] uppercase font-bold py-4 px-6 transition-all duration-300 shadow-md shadow-[#B8962E]/20 border-none cursor-pointer flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  Contacting Gateway...
                </>
              ) : (
                <>
                  <CreditCard size={14} />
                  Authorize Payment (₦{grandTotal.toLocaleString()})
                </>
              )}
            </button>

          </form>
        </section>

        {/* Right Column: Order Summary (5 cols) */}
        <section className="lg:col-span-5 space-y-6 lg:sticky lg:top-[130px]">
          
          <div className="bg-white border border-[rgba(184,150,46,0.15)] p-6 shadow-sm">
            <h3 className="font-serif text-xs uppercase tracking-widest text-[#111111] m-0 border-b border-[rgba(184,150,46,0.12)] pb-3 mb-4">
              Your Selections
            </h3>

            {/* Line Items */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="h-12 w-12 bg-[#FAFAF7] border border-[rgba(184,150,46,0.15)] overflow-hidden shrink-0">
                    <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-[10px] tracking-wide text-[#111111] truncate m-0 mb-0.5">{item.title}</h4>
                    <span className="text-[7.5px] uppercase tracking-wider text-[#777777] font-medium block">
                      {item.quantity} {item.quantity === 1 ? 'Yard' : 'Yards'} — {item.category}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10.5px] font-bold font-mono text-[#111111]">
                      ₦{(item.pricePerYard * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary calculations */}
            <div className="border-t border-[rgba(184,150,46,0.12)] pt-4 mt-5 space-y-3 text-xs">
              <div className="flex justify-between text-[#777777]">
                <span className="font-light">Subtotal:</span>
                <span className="font-mono font-medium text-[#111111]">₦{cartTotal.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-[#777777] items-center">
                <span className="font-light flex items-center gap-1.5">
                  <Truck size={12} className="text-[#B8962E]" />
                  Delivery Charge:
                </span>
                <span className="font-mono font-medium text-[#111111]">
                  {shippingFee === 0 ? "FREE" : `₦${shippingFee.toLocaleString()}`}
                </span>
              </div>
              
              {shippingFee > 0 && (
                <p className="text-[7.5px] text-[#777777] m-0 leading-normal italic text-right">
                  Add ₦{(50000 - cartTotal).toLocaleString()} more to claim FREE nationwide delivery!
                </p>
              )}

              <div className="border-t border-[rgba(184,150,46,0.15)] pt-3 flex justify-between items-center text-sm font-bold text-[#111111]">
                <span className="uppercase tracking-widest text-[10px]">Total Invoice</span>
                <span className="text-[#B8962E] font-mono text-base">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Need help concierge banner */}
          <div className="bg-[#111111] border border-[rgba(184,150,46,0.25)] p-6 text-center">
            <h4 className="font-serif text-[10px] tracking-widest uppercase text-[#E6D5A0] m-0 mb-1.5">
              Prefer Concierge Booking?
            </h4>
            <p className="text-[#777777] text-[8.5px] font-light leading-relaxed m-0 mb-4 max-w-xs mx-auto">
              Our Lagos studio is available to custom loom details, arrange private viewings, or finalize offline payments.
            </p>
            <a 
              href="https://wa.me/2348012345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[8.5px] font-bold text-[#B8962E] hover:text-[#E6D5A0] tracking-widest uppercase no-underline transition-colors"
            >
              Consult an Atelier Advisor
              <ExternalLink size={10} />
            </a>
          </div>

        </section>

      </main>
    </div>
  );
}
