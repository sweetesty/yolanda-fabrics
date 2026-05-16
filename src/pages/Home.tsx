import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import SignatureCollection from '../components/SignatureCollection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-gold/30 selection:text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <SignatureCollection />
        
        {/* Newsletter Section */}
        <section className="py-40 bg-[#fafaf9] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="container mx-auto px-6 lg:px-20 text-center relative z-10">
            <h2 className="text-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-6">The Inner Circle</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-10">Join the Circle of Elegance</h3>
            <div className="max-w-xl mx-auto flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                className="flex-1 bg-white border border-gold/20 px-8 py-5 rounded-full text-[10px] tracking-widest focus:outline-none focus:border-gold transition-all duration-500 shadow-sm"
              />
              <button className="px-12 py-5 bg-gold text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gold-dark transition-all duration-500 shadow-lg shadow-gold/20">
                Subscribe
              </button>
            </div>
          </div>
        </section>
        
        <Footer />
      </main>
    </div>
  )
}

export default Home
