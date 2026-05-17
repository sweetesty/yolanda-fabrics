import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut, CheckCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";


// 🌟 Ultra-Premium Custom Canvas Confetti Component
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Yolanda Fabrics Luxury Color Palette: Gold, Champagne, White, Charcoal, Deep Teal
    const colors = ["#B8962E", "#E6D5A0", "#7A6318", "#FAFAF7", "#111111", "#0D5C5E"];
    const particles: any[] = [];

    // Create luxury confetti flakes
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        r: Math.random() * 5 + 3,
        p_d: Math.random() * height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.06 + 0.02,
        tiltAngle: 0,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.p_d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

        if (p.y > height) {
          p.x = Math.random() * width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 5;
        }

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[99999]" />;
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { cartCount, setIsCartOpen, toastMessage, setToastMessage } = useCart();
  const { user, logout } = useAuth();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const welcomeType = localStorage.getItem("yf_show_welcome");
    if (welcomeType && user) {
      const name = user.full_name?.split(" ")[0] || "Patron";
      if (welcomeType === "new") {
        setToastMessage(`Welcome to the Circle, ${name}! Your luxury membership is now active.`);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 6000);
      } else {
        setToastMessage(`Welcome back, ${name}! We are glad to see you.`);
      }
      localStorage.removeItem("yf_show_welcome");
      setTimeout(() => setToastMessage(null), 4500);
    }
  }, [user]);

  const handleSignOut = () => {
    logout();
    setToastMessage("Successfully signed out. We hope to see you again soon!");
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      {user?.role === "admin" && (
        <div className="bg-[#B8962E] text-white py-2.5 px-8 flex justify-between items-center z-50 select-none shadow-md">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            <span className="text-[7px] md:text-[8px] uppercase tracking-[0.25em] font-bold">Atelier Preview Mode • Storefront Preview Active</span>
          </div>
          <a 
            href="/admin" 
            className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] font-bold text-white hover:text-[#FAFAF7] border border-white/20 px-3 py-1 rounded hover:bg-white/10 transition-all no-underline shrink-0"
          >
            Return to Panel
          </a>
        </div>
      )}
      <nav>
        {/* Logo and Brand */}
        <a href="#" className="nl text-decoration-none group">
          <img src="/logo.jpeg" alt="Logo" />
          <div className="nb">
            Fabrics by Yolanda
            <small>Exquisite Fabrics. Timeless Style.</small>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="nlinks hidden lg:flex items-center">
          <li>
            <a href="#">Collections</a>
          </li>
          <li>
            <a href="#catalog">Fabrics</a>
          </li>
          <li>
            <a href="#contact">Custom Orders</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          {user ? (
            <>
              {user.role === "admin" && (
                <li>
                  <a href="/admin" className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.25em] text-[#0D5C5E] hover:text-[#B8962E] font-semibold no-underline">
                    Atelier Panel
                  </a>
                </li>
              )}
              <li>
                <span className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.25em] text-[#B8962E] font-semibold select-none">
                  <User size={11} className="text-[#B8962E] shrink-0" />
                  {user.full_name?.split(" ")[0]}
                </span>
              </li>
              <li>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.25em] font-normal text-[#777777] hover:text-red-700 bg-transparent border-none cursor-pointer p-0 outline-none transition-colors"
                >
                  <LogOut size={11} className="shrink-0" />
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <a href="/auth" className="flex items-center gap-1.5">
                <User size={11} className="text-[#B8962E] shrink-0" />
                Sign In
              </a>
            </li>
          )}
        </ul>

        {/* Desktop Cart CTA */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="ncta hidden md:block"
        >
          Cart ({cartCount})
        </button>

        {/* Mobile Menu Trigger */}
        <button 
          className="lg:hidden text-[#B8962E] hover:text-[#111111] transition-colors bg-transparent border-none p-1" 
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden border-t border-[rgba(184,150,46,0.2)] bg-[#FFFFFF] shadow-md animate-fade-down">
          <nav className="flex flex-col p-6 gap-4 items-start h-auto w-full border-none">
            <a href="#" onClick={() => setOpen(false)} className="text-[10px] tracking-[0.25em] uppercase text-[#111111] hover:text-[#B8962E] py-2 no-underline font-normal">
              Collections
            </a>
            <a href="#catalog" onClick={() => setOpen(false)} className="text-[10px] tracking-[0.25em] uppercase text-[#111111] hover:text-[#B8962E] py-2 no-underline font-normal">
              Fabrics
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className="text-[10px] tracking-[0.25em] uppercase text-[#111111] hover:text-[#B8962E] py-2 no-underline font-normal">
              Custom Orders
            </a>
            <a href="#about" onClick={() => setOpen(false)} className="text-[10px] tracking-[0.25em] uppercase text-[#111111] hover:text-[#B8962E] py-2 no-underline font-normal">
              About
            </a>
            
            {user ? (
              <div className="flex flex-col gap-2 pt-3 border-t border-[rgba(184,150,46,0.15)] w-full text-left">
                {user.role === "admin" && (
                  <a href="/admin" onClick={() => setOpen(false)} className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#0D5C5E] hover:text-[#B8962E] py-1 no-underline block">
                    Atelier Panel
                  </a>
                )}
                <span className="text-[9px] uppercase tracking-wider text-[#B8962E] font-bold flex items-center gap-1.5">
                  <User size={11} className="text-[#B8962E]" />
                  {user.full_name}
                </span>
                <button 
                  onClick={() => {
                    setOpen(false);
                    handleSignOut();
                  }}
                  className="text-left text-[9px] uppercase tracking-[0.2em] font-bold text-red-600 bg-transparent border-none cursor-pointer py-1 outline-none flex items-center gap-1.5"
                >
                  <LogOut size={11} />
                  Sign Out
                </button>
              </div>
            ) : (
              <a href="/auth" onClick={() => setOpen(false)} className="text-[10px] tracking-[0.25em] uppercase text-[#111111] hover:text-[#B8962E] py-2 no-underline font-normal w-full text-left flex items-center gap-2">
                <User size={12} className="text-[#B8962E]" />
                Sign In
              </a>
            )}

            <button 
              onClick={() => {
                setOpen(false);
                setIsCartOpen(true);
              }}
              className="ncta w-full mt-4 text-center"
            >
              Cart ({cartCount})
            </button>
          </nav>
        </div>
      )}
      {/* Dynamic global toast notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-8 z-[9999] bg-[#111111] text-[#FFFFFF] border border-[#B8962E]/40 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-up select-none">
          <CheckCircle size={14} className="text-[#B8962E] shrink-0" />
          <span className="text-[9px] uppercase tracking-wider font-bold">{toastMessage}</span>
        </div>
      )}
      {showConfetti && <ConfettiCanvas />}
    </header>
  );
};

export default Navbar;
