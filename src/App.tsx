import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { CartProvider } from './context/CartContext'
import { CartDrawer } from './components/CartDrawer'
import { WhatsAppFab } from './components/WhatsAppFab'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Additional routes can be added here */}
      </Routes>
      <WhatsAppFab />
      <CartDrawer />
    </CartProvider>
  )
}

export default App
