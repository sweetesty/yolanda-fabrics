import { MessageCircle } from "lucide-react";
import { useCart } from "../context/CartContext";

export function WhatsAppFab() {
  const { setIsWhatsAppCartOpen } = useCart();

  return (
    <button
      onClick={() => setIsWhatsAppCartOpen(true)}
      aria-label="Open WhatsApp order drawer"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer border-none outline-none focus:outline-none"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </button>
  );
}
