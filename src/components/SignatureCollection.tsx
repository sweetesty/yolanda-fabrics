import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShoppingBag, ChevronRight, Ruler, CheckCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const fabrics = [
  {
    title: "Mulberry Silk Crepe",
    category: "100% Organic Silk",
    pricePerYard: 35000,
    width: "54 inches",
    origin: "Lake Como, Italy",
    img: "/model-dress1.png", // Crisp high-contrast campaign photo
    colors: ["#D4AF37", "#F3EAD3", "#EAE6DF"],
    desc: "Exquisite double-thread satin loomed in Como, featuring a liquid-like fluid drape and high-luminance gold weave."
  },
  {
    title: "Royal Empire Velvet",
    category: "Silk-Cotton Blend",
    pricePerYard: 48000,
    width: "58 inches",
    origin: "Atelier Milan, Italy",
    img: "/model-dress2.png", // Crisp high-contrast emerald campaign photo (fixes white-wash!)
    colors: ["#1B4D3E", "#111111", "#4A0E17"],
    desc: "Incredibly dense woven double-pile velvet, offering heavy drape structure and majestic emerald sheen."
  },
  {
    title: "Imperial Jacquard Brocade",
    category: "Silk & Metallic Thread",
    pricePerYard: 62000,
    width: "48 inches",
    origin: "Atelier Lyon, France",
    img: "/model-dress3.png", // Crisp high-contrast crimson campaign photo (fixes white-wash!)
    colors: ["#8B0000", "#D4AF37"],
    desc: "Intricately hand-woven jacquard adorned with metallic raised gold embroidery representing absolute couture mastery."
  },
  {
    title: "Como Liquid Satin",
    category: "100% Mulberry Silk",
    pricePerYard: 42000,
    width: "54 inches",
    origin: "Como, Italy",
    img: "/fabric-detail.jpeg", // Crisp close-up weave detail
    colors: ["#C5A059", "#F3F0E6", "#708090"],
    desc: "Ultra-fluid premium satin weave, perfect for bias-cut bridal gowns and luxurious couture drapery."
  },
  {
    title: "Crimson Rose Jacquard",
    category: "Silk & Gold Brocade",
    pricePerYard: 75000,
    width: "48 inches",
    origin: "Lyon Weavers, France",
    img: "/model-dress.jpeg", // Crisp draped silk photo
    colors: ["#990000", "#C59B27"],
    desc: "Heavyweight raised jacquard loomed in Lyon, crafted specifically for structured jackets and corset bodice garments."
  }
]

const SignatureCollection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [selectedYards, setSelectedYards] = useState<{ [key: number]: number }>({
    0: 5, 1: 5, 2: 5, 3: 5, 4: 5
  })
  
  // Track purchase type: "yard" or "aso-ebi" (5 yards bundle)
  const [purchaseType, setPurchaseType] = useState<{ [key: number]: "yard" | "aso-ebi" }>({
    0: "aso-ebi", 1: "aso-ebi", 2: "aso-ebi", 3: "aso-ebi", 4: "aso-ebi"
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out"
      })

      gsap.to(".marquee-text", {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleYardChange = (idx: number, val: number) => {
    if (val < 1) return
    setSelectedYards(prev => ({ ...prev, [idx]: val }))
  }

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <section ref={sectionRef} className="py-32 bg-[#FAF8F5] relative overflow-hidden">
      
      {/* Background Decorative Textiles Marquee */}
      <div className="absolute top-10 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
        <div className="marquee-text text-[15vw] font-serif font-black whitespace-nowrap uppercase text-gold">
          PREMIUM FABRICS • LUXURY ATELIER • SELECT SWATCHES •
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl reveal-item">
            <h2 className="text-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-4">Lagos Luxury Showroom</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight">
              Premium <br />
              <span className="italic text-gold font-normal">Fabric Store.</span>
            </h3>
          </div>
          <div className="reveal-item">
            <p className="text-stone-500 max-w-sm mb-6 font-light leading-relaxed text-sm">
              Discover and acquire high-definition curated fabrics directly by the yard or as traditional Aso-Ebi sets. Hand-picked signature textiles loomed for couture style.
            </p>
            <div className="flex items-center gap-2 group cursor-pointer text-stone-900 font-bold uppercase tracking-widest text-[10px] border-b border-gold/40 pb-2 hover:text-gold hover:border-gold transition-all duration-300 w-fit">
              <span>Explore Entire Catalog</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Fabric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {fabrics.map((fabric, idx) => {
            const isAsoEbi = purchaseType[idx] === "aso-ebi"
            const yards = isAsoEbi ? 5 : selectedYards[idx]
            const totalCost = fabric.pricePerYard * yards

            return (
              <div 
                key={idx}
                className="reveal-item group bg-white border border-gold/10 rounded-[2rem] overflow-hidden shadow-xl shadow-stone-200/40 hover:shadow-2xl hover:shadow-stone-300/40 transition-all duration-500 flex flex-col h-full"
              >
                {/* Product Picture Cover */}
                <div className="relative aspect-[16/13] w-full overflow-hidden bg-stone-100 shrink-0">
                  <img 
                    src={fabric.img} 
                    alt={fabric.title} 
                    className="w-full h-full object-cover object-top transition-transform duration-[2.5s] ease-out group-hover:scale-108"
                  />
                  
                  {/* Gold Glass Origin Badge */}
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md border border-gold/10 px-3.5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-stone-800 shadow-md">
                    {fabric.origin}
                  </div>

                  {/* Micro Color Variant Swatches */}
                  <div className="absolute bottom-4 right-4 flex gap-1.5 bg-white/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/50">
                    {fabric.colors.map((color, cIdx) => (
                      <span 
                        key={cIdx} 
                        style={{ backgroundColor: color }}
                        className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Product Info Description */}
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-stone-400 text-[8px] uppercase tracking-[0.2em] font-black">{fabric.category}</span>
                    <span className="text-gold font-serif text-[15px] font-bold">
                      {formatNaira(fabric.pricePerYard)} / Yd
                    </span>
                  </div>

                  <h4 className="text-stone-900 text-xl lg:text-2xl font-serif mb-3 font-semibold group-hover:text-gold transition-colors duration-300">
                    {fabric.title}
                  </h4>

                  <p className="text-stone-500 text-xs font-light leading-relaxed mb-6 flex-1">
                    {fabric.desc}
                  </p>

                  {/* Nigerian Multi-Option Pricing Purchase Type Selector */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button 
                      onClick={() => setPurchaseType(prev => ({ ...prev, [idx]: "aso-ebi" }))}
                      className={`py-3 px-2.5 rounded-xl border text-[9px] uppercase tracking-wider font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isAsoEbi 
                          ? 'border-gold bg-gold/5 text-gold' 
                          : 'border-stone-200 bg-transparent text-stone-500 hover:border-stone-400'
                      }`}
                    >
                      <span className="font-black">Aso-Ebi Set</span>
                      <span className="text-[7.5px] text-stone-400 normal-case font-light">(5 Yards Bundle)</span>
                    </button>
                    
                    <button 
                      onClick={() => setPurchaseType(prev => ({ ...prev, [idx]: "yard" }))}
                      className={`py-3 px-2.5 rounded-xl border text-[9px] uppercase tracking-wider font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        !isAsoEbi 
                          ? 'border-gold bg-gold/5 text-gold' 
                          : 'border-stone-200 bg-transparent text-stone-500 hover:border-stone-400'
                      }`}
                    >
                      <span className="font-black">Custom Yards</span>
                      <span className="text-[7.5px] text-stone-400 normal-case font-light">(Order Custom Length)</span>
                    </button>
                  </div>

                  {/* Fabric Specifications Specs List */}
                  <div className="border-t border-b border-gold/10 py-3 mb-6 flex justify-between items-center text-[9px] tracking-widest uppercase font-bold text-stone-500">
                    <span className="flex items-center gap-1.5"><Ruler size={12} className="text-gold" /> {fabric.width} Width</span>
                    <span className="text-gold font-mono">{fabric.origin.split(',')[0]}</span>
                  </div>

                  {/* Yards Calculator and Cart Button */}
                  <div className="flex items-center justify-between gap-4 mt-auto">
                    
                    {/* Dynamic Yards Quantity Adjustment */}
                    {isAsoEbi ? (
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-gold bg-gold/5 border border-gold/20 px-4 py-2.5 rounded-full">
                        <CheckCircle size={12} />
                        <span>5 Yds Set</span>
                      </div>
                    ) : (
                      <div className="flex items-center border border-gold/25 rounded-full px-3.5 py-1.5">
                        <button 
                          onClick={() => handleYardChange(idx, selectedYards[idx] - 1)}
                          className="text-stone-400 hover:text-stone-900 font-bold px-1.5 text-xs focus:outline-none"
                        >
                          -
                        </button>
                        <input 
                          type="number"
                          value={selectedYards[idx]}
                          onChange={(e) => handleYardChange(idx, parseInt(e.target.value) || 1)}
                          className="w-8 text-center text-[10px] font-black focus:outline-none bg-transparent"
                        />
                        <span className="text-[9px] font-black tracking-widest text-stone-400 uppercase mr-1">Yds</span>
                        <button 
                          onClick={() => handleYardChange(idx, selectedYards[idx] + 1)}
                          className="text-stone-400 hover:text-stone-900 font-bold px-1.5 text-xs focus:outline-none"
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Interactive Cart Purchase Trigger */}
                    <button className="flex-1 group/btn flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white rounded-full py-3 px-4 font-bold uppercase tracking-widest text-[9px] transition-all duration-300 shadow-md shadow-gold/15 cursor-pointer">
                      <ShoppingBag size={12} className="group-hover/btn:scale-110 transition-transform" />
                      <span className="flex flex-col items-center">
                        <span className="leading-none mb-0.5">Add To Cart</span>
                        <span className="text-[7.5px] opacity-80 leading-none">({formatNaira(totalCost)})</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="absolute top-1/4 right-10 w-24 h-24 border border-gold/10 rounded-full animate-pulse pointer-events-none" />
    </section>
  )
}

export default SignatureCollection
