const Footer = () => {
  return (
    <footer>
      <div className="max-w-7xl mx-auto">
        <div className="fg">
          <div>
            <div className="fl">
              <img src="/logo.jpeg" alt="Logo" />
              <div className="fbn">Fabrics by Yolanda</div>
            </div>
            <p className="ft">Lagos Concierge</p>
            <p className="fd">
              Victoria Island Showroom
              <br />
              35 Adeola Hopewell Street
              <br />
              Lagos, Nigeria
            </p>
          </div>
          
          <div>
            <h3 className="fh">Collections</h3>
            <ul className="fli">
              <li><a href="#catalog">Premium Lace</a></li>
              <li><a href="#catalog">Royal Velvet</a></li>
              <li><a href="#catalog">Silk Crepe</a></li>
              <li><a href="#catalog">Ceremonial Sets</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="fh">Atelier</h3>
            <ul className="fli">
              <li><a href="#contact">Bespoke Men</a></li>
              <li><a href="#contact">Bespoke Women</a></li>
              <li><a href="#contact">Consultation</a></li>
              <li><a href="#contact">Private Sales</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="fh">House</h3>
            <ul className="fli">
              <li><a href="#about">Our Story</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        
        <div className="fb">
          <div className="fc">
            &copy; 2025 Fabrics by Yolanda. All rights reserved.
          </div>
          <div className="fs">
            <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer" className="fsc text-decoration-none">W</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="fsc text-decoration-none">I</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
