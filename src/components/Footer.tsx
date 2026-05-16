import { Star, MapPin, Phone, Mail, Globe, Share2, MessageSquare } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#fafaf9] pt-32 pb-12 border-t border-gold/10">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.jpeg" alt="Yolanda Fabrics Logo" className="h-10 w-10 object-contain rounded-full border border-gold/30" />
              <div className="flex flex-col">
                <span className="text-lg font-serif font-bold text-stone-900">Yolanda</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-black">Fabrics</span>
              </div>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed mb-8">
              Redefining luxury textiles through heritage, craftsmanship, and a relentless pursuit of beauty.
            </p>
            <div className="flex gap-5">
              <Globe size={18} className="text-stone-400 hover:text-gold transition-colors cursor-pointer" />
              <Share2 size={18} className="text-stone-400 hover:text-gold transition-colors cursor-pointer" />
              <MessageSquare size={18} className="text-stone-400 hover:text-gold transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div>
            <h4 className="text-stone-900 font-bold uppercase tracking-widest text-[10px] mb-8">Navigation</h4>
            <ul className="space-y-4 text-stone-500 text-sm font-medium">
              <li><a href="#" className="hover:text-gold transition-colors">Our Collections</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Bespoke Services</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">The Lookbook</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Artisan Heritage</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-stone-900 font-bold uppercase tracking-widest text-[10px] mb-8">Concierge</h4>
            <ul className="space-y-4 text-stone-500 text-sm font-medium">
              <li><a href="#" className="hover:text-gold transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-stone-900 font-bold uppercase tracking-widest text-[10px] mb-8">Visit Us</h4>
            <div className="space-y-6 text-stone-500 text-sm">
              <div className="flex gap-4">
                <MapPin size={18} className="text-gold shrink-0" />
                <span>123 Luxury Avenue, Suite 400<br />Milan, Italy 20121</span>
              </div>
              <div className="flex gap-4">
                <Phone size={18} className="text-gold shrink-0" />
                <span>+39 02 123 4567</span>
              </div>
              <div className="flex gap-4">
                <Mail size={18} className="text-gold shrink-0" />
                <span>concierge@yolandafabrics.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">
            &copy; 2024 Yolanda Fabrics. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Crafted with</span>
            <Star size={12} className="text-gold fill-gold" />
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">by Yolanda</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
