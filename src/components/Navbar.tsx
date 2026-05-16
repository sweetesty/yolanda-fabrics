import { ShoppingBag, Search, User } from 'lucide-react'
import { motion } from 'framer-motion'

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-gold/10 px-6 lg:px-20 py-4 flex justify-between items-center"
    >
      <div className="flex items-center gap-4 group cursor-pointer">
        <img 
          src="/logo.jpeg" 
          alt="Yolanda Fabrics Logo" 
          className="h-12 w-12 object-contain rounded-full ring-1 ring-gold/20 group-hover:ring-gold/50 transition-all duration-500 shadow-sm" 
        />
        <div className="flex flex-col">
          <span className="text-xl font-serif font-bold tracking-tight text-stone-900 leading-tight">Yolanda</span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-black">Fabrics</span>
        </div>
      </div>
      
      <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
        {['Collections', 'Atelier', 'Heritage', 'Contact'].map((item) => (
          <a key={item} href="#" className="relative group hover:text-gold transition-colors duration-500">
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-500" />
          </a>
        ))}
      </div>

      <div className="flex items-center gap-8 text-stone-400">
        <button className="hover:text-gold transition-colors duration-300 cursor-pointer">
          <Search size={18} strokeWidth={1.5} />
        </button>
        <button className="hover:text-gold transition-colors duration-300 cursor-pointer">
          <User size={18} strokeWidth={1.5} />
        </button>
        <button className="relative hover:text-gold transition-colors duration-300 cursor-pointer">
          <ShoppingBag size={18} strokeWidth={1.5} />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-white text-[8px] font-black rounded-full flex items-center justify-center">0</span>
        </button>
      </div>
    </motion.nav>
  )
}

export default Navbar
