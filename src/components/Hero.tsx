import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ArrowRight, ArrowLeft, Play } from 'lucide-react'

const slides = [
  {
    image: "/model-dress1.png",
    fabric: "Mulberry Silk",
    code: "YS-702",
    tag: "Signature Weave",
    title: "The Golden Hour",
    description: "Exquisitely woven with gold-infused silk thread for a radiant finish. Reflects ambient light with an unparalleled fluid drape.",
    specs: {
      composition: "100% Mulberry Silk",
      weave: "Double-Thread Satin",
      weight: "18 Momme (approx. 78 gsm)",
      origin: "Loomed in Lake Como, Italy",
      bestFor: "Haute Couture Gowns, Premium Bridalwear",
    },
    hotspots: [
      { x: "72%", y: "45%", label: "Gold-Infused Silk Thread" },
      { x: "85%", y: "78%", label: "Exquisite Satin Cascade" }
    ]
  },
  {
    image: "/model-dress2.png",
    fabric: "Royal Velvet",
    code: "YV-450",
    tag: "Atelier Special",
    title: "Emerald Majesty",
    description: "A deep royal green pile velvet, featuring an incredibly dense structure that absorbs and reflects light with majestic depth.",
    specs: {
      composition: "90% Cotton, 10% Mulberry Silk",
      weave: "Woven Double-Pile Velvet",
      weight: "420 g/m² (Heavyweight)",
      origin: "Atelier Weave, Milan",
      bestFor: "Imperial Tuxedos, Structured Capes, Luxury Upholstery",
    },
    hotspots: [
      { x: "75%", y: "35%", label: "Silk-Cotton Blend Pile" },
      { x: "66%", y: "65%", label: "Lustrous Emerald Velvet" }
    ]
  },
  {
    image: "/model-dress3.png",
    fabric: "Imperial Brocade",
    code: "YB-910",
    tag: "Limited Edition",
    title: "Crimson Rose",
    description: "Intricately hand-woven ruby crimson brocade adorned with metallic gold embroidery representing absolute passion and couture mastery.",
    specs: {
      composition: "60% Silk, 40% Gold Metallic Thread",
      weave: "Raised Jacquard Brocade",
      weight: "310 g/m² (Medium-Heavy)",
      origin: "Handcrafted in Lyon, France",
      bestFor: "Heavy Gowns, Ceremonial Coats, Structured Corsetry",
    },
    hotspots: [
      { x: "78%", y: "48%", label: "Metallic Gold Raised Thread" },
      { x: "64%", y: "72%", label: "Structured Jacquard Weave" }
    ]
  }
]

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text-content", {
        x: -30,
        opacity: 0,
        duration: 1.2,
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

  // Auto-play interval (disable when user hovers over hotspots to let them read)
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(true)

  useEffect(() => {
    if (!isAutoPlayActive) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 8500)
    return () => clearInterval(timer)
  }, [isAutoPlayActive])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-[#FAF8F5] text-stone-900 pt-24 lg:pt-0">
      
      {/* 100% Contain Immersive Background Image - absolutely ZERO cropping or zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#FAF8F5] flex items-center justify-end">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentSlide}
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="w-full h-full object-contain object-center lg:object-right absolute inset-0 py-8 lg:py-16 pr-0 lg:pr-24"
          />
        </AnimatePresence>
        
        {/* Sleek Subtle Particle Overlay */}
        <div className="noise opacity-[0.02] pointer-events-none" />
      </div>

      {/* Decorative Golden Grid Line */}
      <div className="absolute top-0 left-[48%] w-[1px] h-full bg-gradient-to-b from-gold/25 via-gold/5 to-transparent pointer-events-none hidden lg:block z-10" />

      {/* Content Container (Layered on top) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 pt-16 lg:pt-20 pb-16">
        
        {/* Left Column - Seamless integrated Text Details in High-Contrast White & Gold showroom colors */}
        <div className="w-full lg:w-[46%] flex flex-col justify-center hero-text-content">
          {/* Brand Label */}
          <div className="flex items-center gap-4 mb-4">
            <div className="deco-line h-[1px] bg-gold w-10" />
            <span className="text-gold tracking-[0.4em] uppercase text-[9px] font-black">The Luxury Atelier</span>
          </div>

          {/* Main Serif Header */}
          <h1 className="text-4xl md:text-5xl lg:text-[68px] font-serif leading-[1.1] text-stone-900 mb-6">
            The Poetry <span className="italic text-gold font-normal">Of Threads.</span>
          </h1>

          {/* Dynamic Fabric Selector */}
          <div className="my-6 flex flex-col gap-3.5 border-l border-gold/25 pl-5">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="text-left group flex items-center gap-5 focus:outline-none cursor-pointer"
              >
                <span className={`text-[9px] font-bold tracking-[0.3em] font-sans transition-all duration-500 ${
                  currentSlide === index ? 'text-gold' : 'text-stone-400 group-hover:text-stone-600'
                }`}>
                  0{index + 1}
                </span>
                <span className={`text-base lg:text-lg font-serif tracking-wide transition-all duration-500 ${
                  currentSlide === index ? 'text-stone-900 pl-1.5 italic font-bold' : 'text-stone-400 group-hover:text-stone-600'
                }`}>
                  {slide.fabric}
                </span>
              </button>
            ))}
          </div>

          {/* Dynamic Description */}
          <AnimatePresence mode="wait">
            <motion.p 
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-stone-600 text-xs lg:text-sm mb-6 leading-relaxed font-light min-h-[45px]"
            >
              {slides[currentSlide].description}
            </motion.p>
          </AnimatePresence>

          {/* Specs Blueprint Section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-md border border-gold/15 p-6 rounded-2xl mb-8 text-[10px] tracking-wider uppercase font-bold shadow-xl"
            >
              <div className="flex justify-between items-center mb-3 border-b border-gold/10 pb-2">
                <span className="text-gold font-black text-[8px]">Technical Specifications</span>
                <span className="text-stone-500 font-mono text-[8px]">{slides[currentSlide].code}</span>
              </div>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <span className="text-stone-400 block mb-0.5 text-[7px] font-sans tracking-[0.2em] font-black">Composition</span>
                  <span className="text-stone-850 font-serif normal-case font-light text-xs leading-none">{slides[currentSlide].specs.composition}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5 text-[7px] font-sans tracking-[0.2em] font-black">Weave Style</span>
                  <span className="text-stone-850 font-serif normal-case font-light text-xs leading-none">{slides[currentSlide].specs.weave}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5 text-[7px] font-sans tracking-[0.2em] font-black">Weight / Density</span>
                  <span className="text-stone-850 font-serif normal-case font-light text-xs leading-none">{slides[currentSlide].specs.weight}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-0.5 text-[7px] font-sans tracking-[0.2em] font-black">Provenance</span>
                  <span className="text-stone-850 font-serif normal-case font-light text-xs leading-none">{slides[currentSlide].specs.origin}</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-gold/5 text-[8.5px] text-stone-500 normal-case font-light font-sans">
                <span className="font-bold text-gold uppercase tracking-widest text-[7px] mr-1.5">Ideal For:</span>
                {slides[currentSlide].specs.bestFor}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 items-center">
            <button className="group relative px-8 py-4 bg-gold text-white font-bold uppercase tracking-widest text-[9px] overflow-hidden rounded-full transition-all duration-500 hover:pr-12 hover:bg-gold-dark shadow-lg shadow-gold/25 cursor-pointer">
              <span className="relative z-10">Request Sample</span>
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500" size={14} />
            </button>
            
            <button className="flex items-center gap-3 text-stone-850 hover:text-gold transition-colors group cursor-pointer">
              <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center group-hover:border-gold transition-all duration-500 bg-white/70 shadow-sm backdrop-blur-md">
                <Play size={14} className="fill-gold text-gold" />
              </div>
              <span className="text-[8.5px] uppercase tracking-[0.3em] font-bold">Watch story</span>
            </button>
          </div>
        </div>

        {/* Right Column - Holds Floating Couture Tag and Navigation */}
        <div className="w-full lg:w-1/2 min-h-[450px] lg:h-[70vh] relative flex flex-col justify-end lg:justify-between items-end">
          
          {/* Floating Couture Tag */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/80 border border-gold/15 p-5 rounded-2xl shadow-xl backdrop-blur-xl max-w-[280px] self-end hidden lg:block"
            >
              <div className="text-gold text-[8px] uppercase tracking-[0.3em] font-black mb-1">
                {slides[currentSlide].tag}
              </div>
              <div className="text-xl font-serif text-stone-900 mb-2 italic">
                {slides[currentSlide].title}
              </div>
              <div className="text-stone-500 text-[10px] leading-relaxed font-light">
                Crafted beautifully. Woven for seamless drape, rich texture, and premium fashion statements.
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider controls at the bottom right */}
          <div className="flex gap-4 self-end mt-auto">
            <button 
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-gold/20 bg-white/80 text-stone-850 hover:bg-gold hover:text-white hover:border-gold transition-all duration-500 cursor-pointer shadow-lg flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ArrowLeft size={16} />
            </button>
            <button 
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-gold/20 bg-white/80 text-stone-850 hover:bg-gold hover:text-white hover:border-gold transition-all duration-500 cursor-pointer shadow-lg flex items-center justify-center"
              aria-label="Next slide"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Pulse Interactive Fabric Hotspots Overlayed Absolute on the Full Screen background image area */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="relative w-full h-full">
          <AnimatePresence>
            {slides[currentSlide].hotspots.map((spot, idx) => (
              <motion.div 
                key={`${currentSlide}-${idx}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.5 + idx * 0.2, duration: 0.5 }}
                style={{ left: spot.x, top: spot.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto group"
                onMouseEnter={() => setIsAutoPlayActive(false)}
                onMouseLeave={() => setIsAutoPlayActive(true)}
              >
                <span className="absolute inline-flex h-8 w-8 rounded-full bg-gold/25 animate-ping opacity-75" />
                <button className="relative w-5 h-5 rounded-full bg-gold border-2 border-white flex items-center justify-center shadow-lg shadow-gold/50 cursor-pointer focus:outline-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </button>
                
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-8 bg-white border border-gold/20 px-4 py-2.5 rounded-xl text-stone-850 text-[8px] tracking-[0.2em] uppercase font-black whitespace-nowrap opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl backdrop-blur-md">
                  {spot.label}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block z-10 pointer-events-none">
        <div className="rotate-90 text-[8px] uppercase tracking-[1.2em] text-gold/25 font-black whitespace-nowrap">
          MILAN • PARIS • NEW YORK • DUBAI
        </div>
      </div>
    </section>
  )
}

export default Hero
