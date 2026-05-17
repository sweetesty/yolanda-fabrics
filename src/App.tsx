import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { CartDrawer } from './components/CartDrawer'
import { WhatsAppCartDrawer } from './components/WhatsAppCartDrawer'
import { WhatsAppFab } from './components/WhatsAppFab'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <WhatsAppFab />
        <CartDrawer />
        <WhatsAppCartDrawer />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
