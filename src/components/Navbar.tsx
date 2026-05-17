import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
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
        <ul className="nlinks hidden lg:flex">
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
        <div className="lg:hidden border-t border-[rgba(184,150,46,0.2)] bg-[#FFFFFF] shadow-md">
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
    </header>
  );
};

export default Navbar;
