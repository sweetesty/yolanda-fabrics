import { useCart } from "../context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  if (!isCartOpen) return null;

  const whatsappNumber = "2348012345678"; // Official Yolanda Fabrics Lagos WhatsApp

  const handleWhatsAppCheckout = () => {
    let message = `Hello Yolanda Fabrics! I would like to place an order for the following luxury fabrics:\n\n🛍️ *MY SELECTION:*\n----------------------------------\n`;
    
    cartItems.forEach((item, idx) => {
      message += `${idx + 1}. ⚜️ *${item.title}*\n`;
      message += `   • Category: ${item.category}\n`;
      message += `   • Price: ₦${item.pricePerYard.toLocaleString()} / Yard\n`;
      message += `   • Quantity: ${item.quantity}\n`;
      message += `   • Subtotal: ₦${(item.pricePerYard * item.quantity).toLocaleString()}\n\n`;
    });
    
    message += `----------------------------------\n`;
    message += `💵 *TOTAL AMOUNT:* ₦${cartTotal.toLocaleString()}\n\n`;
    message += `Please let me know how to proceed with payment and delivery. Thank you!`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full sm:w-[400px] h-full bg-[#FFFFFF] shadow-2xl flex flex-col z-10 animate-fade-left border-l border-[rgba(184,150,46,0.2)]">
        {/* Header */}
        <div className="p-6 border-b border-[rgba(184,150,46,0.15)] flex justify-between items-center bg-[#FAFAF7]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#B8962E]" />
            <h3 className="font-serif text-sm tracking-[0.15em] uppercase text-[#111111] m-0">Your Bag</h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-[#777777] hover:text-[#111111] transition-colors p-1 bg-transparent border-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-4">
              <ShoppingBag size={48} className="text-[rgba(184,150,46,0.25)] mb-4" />
              <p className="font-serif text-[#111111] text-xs tracking-wider uppercase mb-1">Your bag is empty</p>
              <p className="text-[#777777] text-[10px] font-light max-w-[240px] leading-relaxed">
                Explore our exquisite collections and weave your bespoke imperial legacy.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 pb-4 border-b border-[rgba(184,150,46,0.1)] items-center"
              >
                {/* Thumbnail */}
                <div className="h-16 w-16 bg-[#FAFAF7] border border-[rgba(184,150,46,0.15)] overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info & Quantity controls */}
                <div className="flex-1 min-w-0">
                  <span className="text-[7.5px] uppercase tracking-wider text-[#777777] font-semibold block mb-0.5">
                    {item.category}
                  </span>
                  <h4 className="font-serif text-[11px] tracking-wide text-[#111111] truncate m-0 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[9px] font-mono text-[#B8962E] font-bold m-0 mb-2">
                    ₦{item.pricePerYard.toLocaleString()} / Yard
                  </p>

                  <div className="flex items-center gap-3">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-[rgba(184,150,46,0.25)] bg-[#FAFAF7] rounded-none py-0.5 px-1.5">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#777777] hover:text-[#111111] font-bold text-xs bg-transparent border-none cursor-pointer focus:outline-none px-1"
                      >
                        <Minus size={8} />
                      </button>
                      <span className="text-[9px] font-bold font-mono px-2 text-[#111111] min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#777777] hover:text-[#111111] font-bold text-xs bg-transparent border-none cursor-pointer focus:outline-none px-1"
                      >
                        <Plus size={8} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[#777777] hover:text-red-600 transition-colors p-1 bg-transparent border-none cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-16">
                  <span className="text-[10px] font-bold font-mono text-[#111111]">
                    ₦{(item.pricePerYard * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-[rgba(184,150,46,0.15)] bg-[#FAFAF7] space-y-4">
            <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-[#111111]">
              <span>Subtotal:</span>
              <span className="font-mono text-sm text-[#B8962E]">
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>
            
            <p className="text-[8px] text-[#777777] text-center italic leading-normal m-0">
              Orders are compiled and finalized instantly via a direct secure link to our Lagos WhatsApp Atelier.
            </p>

            <button 
              onClick={handleWhatsAppCheckout}
              className="w-full bg-[#25D366] hover:bg-[#1EBE57] text-[#FFFFFF] font-sans text-[9px] tracking-[0.2em] uppercase font-bold py-3.5 px-4 transition-all duration-300 shadow-md shadow-[#25D366]/20 border-none cursor-pointer flex items-center justify-center gap-2"
            >
              Order on WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
