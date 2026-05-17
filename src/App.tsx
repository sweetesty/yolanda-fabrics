import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Checkout from './pages/Checkout'
import { CartProvider } from './context/CartContext'
import { CartDrawer } from './components/CartDrawer'
import { WhatsAppCartDrawer } from './components/WhatsAppCartDrawer'
import { WhatsAppFab } from './components/WhatsAppFab'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <WhatsAppFab />
      <CartDrawer />
      <WhatsAppCartDrawer />
    </CartProvider>
  )
}

export default App
