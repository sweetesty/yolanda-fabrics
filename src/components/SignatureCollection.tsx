import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plus } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const SignatureCollection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-item", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        y: 60,
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

  return (
    <section ref={sectionRef} className="py-40 bg-white relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-20 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] select-none">
        <div className="marquee-text text-[22vw] font-serif font-black whitespace-nowrap uppercase text-gold">
          Exquisite Exquisite Exquisite
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl reveal-item">
            <h2 className="text-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-6">Our Selection</h2>
            <h3 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight">
              Curating <br />
              <span className="italic text-gold font-normal">Masterpieces.</span>
            </h3>
          </div>
          <div className="reveal-item">
            <p className="text-stone-500 max-w-sm mb-8 font-light leading-relaxed">
              Every thread tells a story of heritage and innovation. Explore our hand-picked signature textiles for your next creation.
            </p>
            <button className="text-stone-900 text-[10px] font-bold uppercase tracking-widest border-b border-gold pb-2 hover:text-gold transition-all duration-500">
              View Atelier Catalog
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20">
          {/* Large Featured Item */}
          <div className="lg:col-span-7 reveal-item">
            <div className="group relative aspect-[14/10] overflow-hidden rounded-3xl cursor-pointer shadow-2xl shadow-stone-200">
              <img 
                src="/fabric-detail.jpeg" 
                alt="Emerald Detail" 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                <div>
                  <h4 className="text-white text-3xl font-serif mb-2">Emerald Tapestry</h4>
                  <p className="text-gold-light text-xs uppercase tracking-widest font-bold">Signature Series</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-gold group-hover:border-gold group-hover:text-white transition-all duration-500 text-white">
                  <Plus size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Side Items */}
          <div className="lg:col-span-5 flex flex-col gap-16 justify-center">
            {[
              { title: "Imperial Silk", category: "Silk • 100% Organic", img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80" },
              { title: "Golden Brocade", category: "Wedding • Hand-woven", img: "https://images.unsplash.com/photo-1544273677-c433136021d4?auto=format&fit=crop&q=80" },
            ].map((item, i) => (
              <div key={i} className="group flex gap-8 items-center reveal-item cursor-pointer">
                <div className="w-40 h-40 shrink-0 overflow-hidden rounded-2xl relative shadow-lg shadow-stone-100">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h4 className="text-stone-900 text-2xl font-serif mb-2 group-hover:text-gold transition-colors">{item.title}</h4>
                  <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold mb-4">{item.category}</p>
                  <div className="w-8 h-[1px] bg-gold/30 group-hover:w-full group-hover:bg-gold transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 right-10 w-24 h-24 border border-gold/10 rounded-full animate-pulse" />
    </section>
  )
}

export default SignatureCollection
