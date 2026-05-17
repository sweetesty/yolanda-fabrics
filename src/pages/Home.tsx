import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const featuredFabricsList = [
  {
    id: "c89f59f6-0683-4a1e-84b2-29e289c09aa3",
    title: "Royal Teal Damask",
    category: "100% Organic Silk Base",
    pricePerYard: 35000,
    width: "54 inches",
    origin: "Italy",
    img: "/model-dress1.png",
    desc: "Exquisite double-thread satin loomed in Como, featuring a liquid-like fluid drape and high-luminance gold weave."
  },
  {
    id: "e88b8a5b-d3a9-4670-bbcf-83021f00889f",
    title: "Champagne Brocade",
    category: "Silk & Metallic Thread",
    pricePerYard: 45000,
    width: "48 inches",
    origin: "France",
    img: "/model-dress3.png",
    desc: "Intricately hand-woven jacquard adorned with metallic raised gold embroidery representing absolute couture mastery."
  },
  {
    id: "497bb5a2-9b2f-410a-8bf8-2a1d2e1b12cb",
    title: "Forest Green Velvet",
    category: "Silk-Cotton Blend",
    pricePerYard: 48000,
    width: "58 inches",
    origin: "Italy",
    img: "/model-dress2.png",
    desc: "Incredibly dense woven double-pile velvet, offering heavy drape structure and majestic emerald sheen."
  },
  {
    id: "b92b95c3-a3d2-43bb-8cbb-6a6c7b7f8c0d",
    title: "Emerald Silk Crepe",
    category: "100% Mulberry Silk",
    pricePerYard: 38000,
    width: "54 inches",
    origin: "Italy",
    img: "/model-dress.jpeg",
    desc: "Ultra-fluid premium satin weave, perfect for bias-cut bridal gowns and luxurious couture drapery."
  }
];

const Home = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Track simple popup notification when added to cart
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerAddToCart = (fabric: typeof featuredFabricsList[0]) => {
    if (user?.role === "admin") {
      alert("Atelier Preview Mode: Administrators are browsing the storefront in read-only preview mode and cannot perform customer bag actions.");
      return;
    }
    addToCart({
      id: fabric.id,
      title: fabric.title,
      category: fabric.category,
      pricePerYard: fabric.pricePerYard,
      img: fabric.img
    });
    setToastMessage(`Added ${fabric.title} (${formatNaira(fabric.pricePerYard)}) to your bag!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const formatNaira = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] selection:bg-[#B8962E]/30 selection:text-white overflow-x-hidden font-sans pt-[72px]">

      {/* Navbar */}
      <Navbar />

      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-8 z-50 bg-[#111111] text-white border border-[#B8962E]/40 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-up">
          <CheckCircle size={18} className="text-[#B8962E]" />
          <span className="text-[10px] uppercase tracking-wider font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO SPLIT SECTION (Approved Figma Design) */}
      <section className="hero">
        <div className="hero-left">
          <div className="hl-inner">
            <div className="h-rule"></div>
            <div className="h-pre">New Collection — 2025</div>
            <h1 className="h-title">
              Dressed<br />in <em>Pure<br />Luxury.</em>
            </h1>
            <p className="h-sub">
              Curated fabrics that transform the way you move through the world. Brocades, silks &amp; velvets of unmatched quality.
            </p>
            <div className="flex gap-4">
              <a href="#catalog" className="btn-g text-decoration-none flex items-center justify-center">
                Shop Now
              </a>
              <a href="#editorials" className="btn-o text-decoration-none flex items-center justify-center">
                Lookbook
              </a>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="relative w-full h-full overflow-hidden">
            <img src="/model-dress1.png" alt="Teal gown" className="w-full h-full object-cover" />
            <img src="/logo.jpeg" alt="Logo" className="watermark-logo absolute bottom-3 right-3 rounded-full border border-white/20 bg-white/45 backdrop-blur-xs shadow-md z-10 object-contain opacity-60 pointer-events-none" />
          </div>
          <div className="relative w-full h-full overflow-hidden">
            <img src="/model-dress2.png" alt="Olive gown" className="w-full h-full object-cover" />
            <img src="/logo.jpeg" alt="Logo" className="watermark-logo absolute bottom-3 right-3 rounded-full border border-white/20 bg-white/45 backdrop-blur-xs shadow-md z-10 object-contain opacity-60 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. INFINITE MARQUEE (Strip) */}
      <div className="strip">
        <div className="si">
          <div className="sit">Commission Pieces</div>
          <div className="sit">Haute Couture</div>
          <div className="sit">Silk Crepe</div>
          <div className="sit">Royal Velvet</div>
          <div className="sit">Metallic Brocade</div>
          <div className="sit">Premium Lace</div>
          <div className="sit">Aso-Ebi Bundles</div>

          <div className="sit">Commission Pieces</div>
          <div className="sit">Haute Couture</div>
          <div className="sit">Silk Crepe</div>
          <div className="sit">Royal Velvet</div>
          <div className="sit">Metallic Brocade</div>
          <div className="sit">Premium Lace</div>
          <div className="sit">Aso-Ebi Bundles</div>
        </div>
      </div>

      {/* 3. ABOUT STRIP (Stats Section) */}
      <div className="about">
        <div className="ab">
          <div className="ab-num">500+</div>
          <div className="ab-label">Premium Weaves</div>
        </div>
        <div className="ab-div"></div>
        <div className="ab">
          <div className="ab-num">12k+</div>
          <div className="ab-label">Happy Customers</div>
        </div>
        <div className="ab-div"></div>
        <div className="ab">
          <div className="ab-num">8+</div>
          <div className="ab-label">Years of Craft</div>
        </div>
      </div>

      {/* 4. CATEGORY SHOWCASE / LOOKBOOK (Wear the Fabric) */}
      <section id="editorials" className="sec">
        <div className="max-w-7xl mx-auto">
          <div className="sec-pre">Our Editorials</div>
          <h2 className="sec-h">
            Wear the <em>Fabric</em>
          </h2>
          <div className="sec-rule"></div>

          <div className="lb">
            <div className="lbc relative overflow-hidden">
              <img src="/model-dress1.png" alt="Teal" />
              <img src="/logo.jpeg" alt="Logo" className="watermark-logo absolute top-3 right-3 rounded-full border border-white/20 bg-white/45 backdrop-blur-xs shadow-md z-10 object-contain opacity-60 pointer-events-none" />
              <div className="lbc-info">
                <span className="lbc-tag">Lagos Signature</span>
                <span className="lbc-name">Royal Teal</span>
                <span className="lbc-price">₦35,000 / Yd</span>
              </div>
            </div>

            <div className="lbc relative overflow-hidden">
              <img src="/model-dress3.png" alt="Champagne" />
              <img src="/logo.jpeg" alt="Logo" className="watermark-logo absolute top-3 right-3 rounded-full border border-white/20 bg-white/45 backdrop-blur-xs shadow-md z-10 object-contain opacity-60 pointer-events-none" />
              <div className="lbc-info">
                <span className="lbc-tag">Limited Weave</span>
                <span className="lbc-name">Atelier Champagne</span>
                <span className="lbc-price">₦45,000 / Yd</span>
              </div>
            </div>

            <div className="lbc relative overflow-hidden">
              <img src="/model-dress2.png" alt="Green" />
              <img src="/logo.jpeg" alt="Logo" className="watermark-logo absolute top-3 right-3 rounded-full border border-white/20 bg-white/45 backdrop-blur-xs shadow-md z-10 object-contain opacity-60 pointer-events-none" />
              <div className="lbc-info">
                <span className="lbc-tag">Imperial Texture</span>
                <span className="lbc-name">Forest Green</span>
                <span className="lbc-price">₦48,000 / Yd</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED FABRICS GRID */}
      <section id="catalog" className="sec dark border-t border-b border-[rgba(184,150,46,0.2)]">
        <div className="max-w-7xl mx-auto">
          <div className="sec-pre">Exclusive Selection</div>
          <h2 className="sec-h">
            Featured <em>Fabrics</em>
          </h2>
          <div className="sec-rule"></div>

          <div className="pg">
            {featuredFabricsList.map((fabric) => {
              return (
                <div key={fabric.id} className="pc">
                  <div className="pc-img relative">
                    <img src={fabric.img} alt={fabric.title} />
                    <span className="pc-badge">{fabric.origin}</span>
                    <img src="/logo.jpeg" alt="Logo" className="watermark-logo absolute bottom-3 right-3 rounded-full border border-white/20 bg-white/45 backdrop-blur-xs shadow-md z-10 object-contain opacity-60 pointer-events-none" />
                  </div>

                  <div className="pc-body">
                    <span className="pc-t">{fabric.category}</span>
                    <h4 className="pc-n">{fabric.title}</h4>
                    <p className="pc-p">
                      {formatNaira(fabric.pricePerYard)} <span>/ Yard</span>
                    </p>

                    <p className="text-[#777777] text-[10px] font-light leading-relaxed my-3">
                      {fabric.desc}
                    </p>

                    {/* Exact Figma pc-btn button at full width! */}
                    <button
                      onClick={() => triggerAddToCart(fabric)}
                      className="pc-btn"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. COUTURE QUOTE SECTION */}
      <section className="quote">
        <blockquote className="qt">
          "Fabric is the canvas. Yolanda gives you the masterpiece."
        </blockquote>
        <span className="qa">Couture by Yolanda</span>
        <img src="/logo.jpeg" alt="FY Logo" className="q-logo" />
      </section>

      {/* 7. NEWSLETTER SECTION */}
      <section id="contact" className="nl-wrap">
        <div>
          <h2 className="nl-t">
            Stay in the<br /><em>Yolanda Circle</em>
          </h2>
          <p className="nl-s">
            Be the first to receive updates on premium releases, aso-ebi custom weaving seasons, and private sales.
          </p>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setToastMessage("Thank you for subscribing to the Yolanda Circle!");
              setTimeout(() => setToastMessage(null), 4000);
            }}
            className="nl-form"
          >
            <input type="email" placeholder="Your email address" className="nl-in" required />
            <button type="submit" className="nl-btn border-none">
              Subscribe to the Newsletter
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;
