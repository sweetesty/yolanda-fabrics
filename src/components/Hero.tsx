import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowRight, Play } from 'lucide-react'

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
      })

      gsap.from(".hero-image-container", {
        xPercent: 100,
        duration: 1.5,
        ease: "power4.inOut",
      })

      gsap.from(imageRef.current, {
        scale: 1.2,
        duration: 2,
        ease: "power4.out",
      })

      gsap.from(".deco-line", {
        width: 0,
        duration: 1.5,
        ease: "expo.inOut",
        delay: 0.5
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-[#fafaf9] pt-20 lg:pt-0">
      <div className="noise" />
      
      {/* Left Content */}
      <div className="w-full lg:w-1/2 px-6 lg:px-20 z-20 pt-10 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="deco-line h-[1px] bg-gold w-12" />
          <span className="text-gold tracking-[0.4em] uppercase text-[10px] font-bold">The Luxury Atelier</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl lg:text-[110px] font-serif leading-[0.95] text-stone-900 mb-10">
          <span className="block hero-title">Timeless</span>
          <span className="block hero-title italic text-gold font-normal">Fabrics</span>
          <span className="block hero-title">Curated.</span>
        </h1>

        <div className="max-w-md">
          <p className="text-stone-500 text-lg mb-12 leading-relaxed font-light">
            Crafting a legacy of beauty through the world's most exquisite textiles. 
            Step into the world of luxury with Fabrics By Yolanda.
          </p>
          
          <div className="flex flex-wrap gap-8 items-center">
            <button className="group relative px-12 py-6 bg-gold text-white font-bold uppercase tracking-widest text-[11px] overflow-hidden rounded-full transition-all duration-500 hover:pr-16 hover:bg-gold-dark shadow-lg shadow-gold/20">
              <span className="relative z-10">Explore Collections</span>
              <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500" size={18} />
            </button>
            
            <button className="flex items-center gap-4 text-stone-900 group">
              <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center group-hover:border-gold transition-all duration-500 bg-white">
                <Play size={18} className="fill-gold text-gold transition-all" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold group-hover:text-gold transition-colors">Watch Story</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-12 border-t border-gold/10 pt-12">
          <div>
            <div className="text-3xl font-serif text-stone-900 mb-1">Premium</div>
            <div className="text-[9px] uppercase tracking-widest text-gold font-bold">Silk & Velvet</div>
          </div>
          <div>
            <div className="text-3xl font-serif text-stone-900 mb-1">Handmade</div>
            <div className="text-[9px] uppercase tracking-widest text-gold font-bold">In Our Atelier</div>
          </div>
        </div>
      </div>

      {/* Right Image Container */}
      <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen relative overflow-hidden hero-image-container">
        <img 
          ref={imageRef}
          src="/model-dress.jpeg" 
          alt="Luxury Dress"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fafaf9] via-transparent to-transparent z-10" />
        
        {/* Floating Tag */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 z-20 glass-light p-8 rounded-2xl hidden lg:block shadow-2xl shadow-gold/10"
        >
          <div className="text-gold text-[10px] uppercase tracking-widest font-bold mb-2">Signature Piece</div>
          <div className="text-2xl font-serif text-stone-900 mb-4 italic">The Golden Hour</div>
          <div className="text-stone-500 text-[10px] max-w-[150px] leading-relaxed">
            Exquisitely woven with gold-infused silk thread for a radiant finish.
          </div>
        </motion.div>
      </div>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="rotate-90 text-[10px] uppercase tracking-[1em] text-gold/20 font-bold whitespace-nowrap">
          MILAN • PARIS • NEW YORK • DUBAI
        </div>
      </div>
    </section>
  )
}

export default Hero
