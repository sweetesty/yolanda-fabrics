import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { 
  BarChart3, ShoppingBag, Users, Layers, ExternalLink, 
  LogOut, ChevronRight, ShieldAlert, ArrowLeft, RefreshCw, 
  Send 
} from "lucide-react";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  notes: string;
  created_at: string;
  order_items: Array<{
    id: string;
    product_name: string;
    price_per_yard: number;
    yards_ordered: number;
    line_total: number;
  }>;
}

interface CustomOrder {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  fabric_type: string;
  estimated_yards: number;
  reference_image_url?: string;
  ideas_description: string;
  status: string;
  admin_notes?: string;
  created_at: string;
}

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  orders: { count: number };
  role: string;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, token, isLoading, logout } = useAuth();
  const { triggerToast } = useCart();
  
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "custom" | "customers">("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customOrders, setCustomOrders] = useState<CustomOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [isFetching, setIsFetching] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<Record<string, string>>({});
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({});

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchData = async () => {
    if (!token) return;
    setIsFetching(true);
    try {
      // 1. Dashboard Stats
      const statsRes = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
        setRecentOrders(statsData.recentOrders);
      }

      // 2. Orders List
      const ordersRes = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setOrders(ordersData.orders);
      }

      // 3. Custom Sizing Requests
      const customRes = await fetch(`${API_BASE}/api/admin/custom-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const customData = await customRes.json();
      if (customData.success) {
        setCustomOrders(customData.customOrders);
      }

      // 4. Premium Patrons Database
      const customerRes = await fetch(`${API_BASE}/api/admin/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const customerData = await customerRes.json();
      if (customerData.success) {
        setCustomers(customerData.customers);
      }
    } catch (e) {
      console.error("Error fetching administrative data:", e);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin" && token) {
      fetchData();
    }
  }, [user, token]);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    if (!token) return;
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          tracking_number: trackingNumber[orderId] || ""
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        triggerToast(`Order status updated to "${status}" successfully!`);
      } else {
        alert(data.error || "Failed to update order status.");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateCustomOrder = async (customId: string, status: string) => {
    if (!token) return;
    setUpdatingId(customId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/custom-orders/${customId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          admin_notes: customNotes[customId] || ""
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        triggerToast(`Bespoke design status updated to "${status}" successfully!`);
      } else {
        alert(data.error || "Failed to update design status.");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating bespoke design status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateCustomerRole = async (customerId: string, role: string) => {
    if (!token) return;
    setUpdatingId(customerId);
    try {
      const res = await fetch(`${API_BASE}/api/admin/customers/${customerId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        triggerToast(`Patron role updated to "${role}" successfully!`);
      } else {
        alert(data.error || "Failed to update patron role.");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating patron role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  // ─── SHIELD: ACCESS DENIED BANNER (WHITE & GOLD STYLE) ───
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex justify-center items-center font-sans text-[#111111]">
        <div className="text-center">
          <img src="/logo.jpeg" alt="Logo" className="w-16 h-16 object-contain rounded-full border border-[#B8962E]/30 animate-pulse mx-auto mb-4" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8962E] block font-bold">Securing Admin Atelier...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FAFAF7] text-[#111111] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[#B8962E]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-[#0D5C5E]/3 blur-[120px]" />
        
        <div className="max-w-md w-full bg-white border border-[rgba(184,150,46,0.22)] p-10 text-center shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B8962E] via-[#E6D5A0] to-[#7A6318]" />
          
          <ShieldAlert size={48} className="text-[#B8962E] mx-auto mb-6 animate-bounce" />
          <h2 className="font-serif text-2xl tracking-wide uppercase text-[#111111] mb-2">Access Shield Active</h2>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8962E] font-bold block mb-4">Staff & Atelier Only</span>
          <p className="text-[#777777] text-xs font-light leading-relaxed mb-8">
            Your current credential set does not possess authorization keypaths to access the Yolanda Fabrics Admin Atelier. 
            Please sign in with a verified administrative profile.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate("/auth")}
              className="w-full bg-[#111111] hover:bg-[#B8962E] text-white font-sans text-[10px] tracking-[0.25em] uppercase font-bold py-4 px-6 border-none cursor-pointer transition-all duration-300"
            >
              Sign In as Admin
            </button>
            <button 
              onClick={() => navigate("/")}
              className="w-full bg-transparent hover:bg-[#FAFAF7] text-[#777777] hover:text-[#111111] font-sans text-[10px] tracking-[0.25em] uppercase font-bold py-4 px-6 border border-[rgba(184,150,46,0.2)] cursor-pointer transition-all duration-300"
            >
              <ArrowLeft size={10} className="inline mr-2" /> Return to Salon
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#111111] font-sans flex selection:bg-[#B8962E]/20">
      
      {/* ─── SIDEBAR (WHITE & GOLD) ─── */}
      <aside className="w-[260px] bg-[#FFFFFF] border-r border-[rgba(184,150,46,0.18)] flex flex-col justify-between shrink-0 select-none shadow-sm">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-[rgba(184,150,46,0.1)] flex items-center gap-3">
            <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 object-contain rounded-full border border-[#B8962E]/20" />
            <div className="text-left">
              <span className="font-serif text-xs tracking-widest uppercase text-[#111111] block font-bold">Yolanda Fabrics</span>
              <span className="text-[6px] tracking-[0.35em] text-[#B8962E] block font-light uppercase">Control Panel</span>
            </div>
          </div>

          {/* Nav List */}
          <div className="p-4 space-y-2 mt-6" role="navigation">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left font-sans text-[9px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-xl cursor-pointer border-none flex items-center gap-3 transition-all duration-300 ${activeTab === "dashboard" ? "bg-[#B8962E] text-white shadow-md shadow-[#B8962E]/15" : "bg-transparent text-[#777777] hover:bg-[#FAFAF7] hover:text-[#111111]"}`}
            >
              <BarChart3 size={14} />
              Dashboard Stats
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left font-sans text-[9px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-xl cursor-pointer border-none flex items-center gap-3 transition-all duration-300 ${activeTab === "orders" ? "bg-[#B8962E] text-white shadow-md shadow-[#B8962E]/15" : "bg-transparent text-[#777777] hover:bg-[#FAFAF7] hover:text-[#111111]"}`}
            >
              <ShoppingBag size={14} />
              Atelier Orders
            </button>
            <button 
              onClick={() => setActiveTab("custom")}
              className={`w-full text-left font-sans text-[9px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-xl cursor-pointer border-none flex items-center gap-3 transition-all duration-300 ${activeTab === "custom" ? "bg-[#B8962E] text-white shadow-md shadow-[#B8962E]/15" : "bg-transparent text-[#777777] hover:bg-[#FAFAF7] hover:text-[#111111]"}`}
            >
              <Layers size={14} />
              Bespoke Sketches
            </button>
            <button 
              onClick={() => setActiveTab("customers")}
              className={`w-full text-left font-sans text-[9px] uppercase tracking-wider font-bold py-3.5 px-4 rounded-xl cursor-pointer border-none flex items-center gap-3 transition-all duration-300 ${activeTab === "customers" ? "bg-[#B8962E] text-white shadow-md shadow-[#B8962E]/15" : "bg-transparent text-[#777777] hover:bg-[#FAFAF7] hover:text-[#111111]"}`}
            >
              <Users size={14} />
              Bespoke Patrons
            </button>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-[rgba(184,150,46,0.1)] space-y-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-[#B8962E]/10 border border-[#B8962E]/30 flex items-center justify-center text-[10px] font-bold text-[#B8962E] uppercase">
              {user.full_name?.substring(0,2) || "AD"}
            </div>
            <div className="text-left overflow-hidden">
              <span className="text-[10px] font-semibold text-[#111111] block truncate">{user.full_name || "Admin Master"}</span>
              <span className="text-[7px] text-[#777777] block truncate">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full bg-[#FAFAF7] hover:bg-red-50 text-[#777777] hover:text-white font-sans text-[8px] uppercase tracking-wider font-bold py-3 px-4 rounded-xl border border-[rgba(184,150,46,0.12)] cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LogOut size={12} />
            Exit Panel
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Header (WHITE & GOLD) */}
        <header className="h-[80px] bg-[#FFFFFF] border-b border-[rgba(184,150,46,0.18)] flex items-center justify-between px-8 select-none z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-lg tracking-wider font-light uppercase text-[#111111] m-0">
              {activeTab === "dashboard" && "Atelier Analytics"}
              {activeTab === "orders" && "Active Salon Orders"}
              {activeTab === "custom" && "Custom Tailor Sketches"}
              {activeTab === "customers" && "Registered Patrons"}
            </h1>
            {isFetching && <RefreshCw size={14} className="text-[#B8962E] animate-spin" />}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="bg-[#FAFAF7] hover:bg-[#B8962E]/10 text-[#B8962E] p-2.5 rounded-full border border-[rgba(184,150,46,0.2)] cursor-pointer transition-colors"
            >
              <RefreshCw size={14} />
            </button>
            <button 
              onClick={() => navigate("/")}
              className="bg-transparent hover:bg-[#FAFAF7] text-[#777777] hover:text-[#111111] font-sans text-[8px] uppercase tracking-widest font-bold py-2.5 px-4 rounded-lg border border-[rgba(184,150,46,0.25)] cursor-pointer transition-all flex items-center gap-2"
            >
              <ArrowLeft size={10} /> View Frontpage
            </button>
          </div>
        </header>

        {/* Tab content area */}
        <div className="flex-grow overflow-y-auto p-8 relative">
          
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-10 max-w-7xl mx-auto">
              
              {/* Section 1: Stats Header & Cards */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-[rgba(184,150,46,0.12)]">
                  <div>
                    <h3 className="font-serif text-[11px] uppercase tracking-widest text-[#B8962E] m-0 font-bold">Atelier Performance Summary</h3>
                    <span className="text-[7px] tracking-[0.25em] text-[#777777] block uppercase mt-1">Real-time ledger overview & catalog metrics</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FAFAF7] border border-[rgba(184,150,46,0.15)] p-0.5 rounded-lg shrink-0">
                    <span className="bg-[#B8962E] text-white font-sans text-[6px] uppercase tracking-wider font-bold py-1 px-2.5 rounded-md">Live Stream</span>
                    <span className="text-[#777777] font-sans text-[6px] uppercase tracking-wider font-bold py-1 px-2.5">Synced</span>
                  </div>
                </div>

                {/* Summary Cards (WHITE & GOLD STYLE) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* Revenue */}
                  <div 
                    onClick={() => setActiveTab("orders")}
                    className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] p-6 rounded-2xl relative overflow-hidden group hover:border-[#B8962E]/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-[#111111] shrink-0 group-hover:scale-110 transition-transform">
                      <BarChart3 size={40} />
                    </div>
                    <span className="text-[8px] uppercase tracking-wider text-[#777777] font-bold block mb-1">Total Sales Revenue</span>
                    <h3 className="font-sans text-2xl font-semibold text-[#B8962E] m-0">
                      ₦{(stats?.totalRevenue || 0).toLocaleString()}
                    </h3>
                    <div className="h-1 w-[40px] bg-[#B8962E] rounded mt-4" />
                  </div>

                  {/* Orders */}
                  <div 
                    onClick={() => setActiveTab("orders")}
                    className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] p-6 rounded-2xl relative overflow-hidden group hover:border-[#B8962E]/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-[#111111] shrink-0 group-hover:scale-110 transition-transform">
                      <ShoppingBag size={40} />
                    </div>
                    <span className="text-[8px] uppercase tracking-wider text-[#777777] font-bold block mb-1">Total Orders</span>
                    <h3 className="font-sans text-2xl font-semibold text-[#111111] m-0">
                      {stats?.totalOrders || 0}
                    </h3>
                    <div className="h-1 w-[40px] bg-[#B8962E]/40 rounded mt-4" />
                  </div>

                  {/* Customers */}
                  <div 
                    onClick={() => setActiveTab("customers")}
                    className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] p-6 rounded-2xl relative overflow-hidden group hover:border-[#B8962E]/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-[#111111] shrink-0 group-hover:scale-110 transition-transform">
                      <Users size={40} />
                    </div>
                    <span className="text-[8px] uppercase tracking-wider text-[#777777] font-bold block mb-1">Bespoke Patrons</span>
                    <h3 className="font-sans text-2xl font-semibold text-[#111111] m-0">
                      {stats?.totalCustomers || 0}
                    </h3>
                    <div className="h-1 w-[40px] bg-[#B8962E]/40 rounded mt-4" />
                  </div>

                  {/* Products */}
                  <div 
                    onClick={() => setActiveTab("custom")}
                    className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] p-6 rounded-2xl relative overflow-hidden group hover:border-[#B8962E]/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-[#111111] shrink-0 group-hover:scale-110 transition-transform">
                      <Layers size={40} />
                    </div>
                    <span className="text-[8px] uppercase tracking-wider text-[#777777] font-bold block mb-1">Catalog Products</span>
                    <h3 className="font-sans text-2xl font-semibold text-[#111111] m-0">
                      {stats?.totalProducts || 0}
                    </h3>
                    <div className="h-1 w-[40px] bg-[#B8962E]/40 rounded mt-4" />
                  </div>
                </div>
              </div>

              {/* Section 2: Splits */}
              <div className="space-y-4">
                <div className="pb-3 border-b border-[rgba(184,150,46,0.12)]">
                  <h3 className="font-serif text-[11px] uppercase tracking-widest text-[#B8962E] m-0 font-bold">Recent Salon Transactions</h3>
                  <span className="text-[7px] tracking-[0.25em] text-[#777777] block uppercase mt-1">Direct feeds of current purchases & processing queues</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Recent Orders List (2/3 cols) */}
                  <div className="lg:col-span-2 bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6 pb-3 border-b border-[rgba(184,150,46,0.1)]">
                      <h3 className="font-serif text-[9px] uppercase tracking-widest text-[#B8962E] m-0">Recent Atelier Sales</h3>
                      <button 
                        onClick={() => setActiveTab("orders")}
                      className="bg-transparent border-none text-[#B8962E] hover:text-[#111111] text-[8px] uppercase tracking-widest font-bold cursor-pointer transition-colors flex items-center gap-1"
                    >
                      View All Orders <ChevronRight size={10} />
                    </button>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="text-center py-12 text-[#777777] text-xs font-light">No sales transactions found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[rgba(184,150,46,0.1)]">
                            <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Order #</th>
                            <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Patron Name</th>
                            <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Amount</th>
                            <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Status</th>
                            <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {recentOrders.map((o) => (
                            <tr key={o.id} className="hover:bg-[#FAFAF7] transition-colors">
                              <td className="py-4 font-mono text-[9px] font-bold text-[#111111]">{o.order_number}</td>
                              <td className="py-4 text-xs font-light text-[#111111]/90">{o.customer_name}</td>
                              <td className="py-4 text-xs font-serif text-[#B8962E] font-medium">₦{o.total.toLocaleString()}</td>
                              <td className="py-4">
                                <span className={`inline-block text-[7px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${o.status === "paid" || o.status === "delivered" ? "bg-green-500/10 text-green-700 border border-green-500/20" : "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20"}`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-4 text-[9px] font-mono text-[#777777]">{new Date(o.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Quick actions panel (1/3 col) */}
                <div className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="font-serif text-xs uppercase tracking-widest text-[#B8962E] mb-6 pb-3 border-b border-[rgba(184,150,46,0.1)] m-0">Atelier Quick Actions</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-[#FAFAF7] border border-[rgba(184,150,46,0.15)] rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-[#777777] font-bold block mb-0.5">Pending Orders</span>
                          <span className="text-xs font-semibold text-[#111111]">{orders.filter(o => o.status === "pending").length} outstanding</span>
                        </div>
                        <button 
                          onClick={() => setActiveTab("orders")}
                          className="bg-[#B8962E]/10 hover:bg-[#B8962E] text-[#B8962E] hover:text-white px-3 py-1.5 rounded-lg border-none font-bold text-[8px] uppercase tracking-wider cursor-pointer transition-all"
                        >
                          Resolve
                        </button>
                      </div>

                      <div className="p-4 bg-[#FAFAF7] border border-[rgba(184,150,46,0.15)] rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[8px] uppercase tracking-wider text-[#777777] font-bold block mb-0.5">Bespoke Inquiries</span>
                          <span className="text-xs font-semibold text-[#111111]">{customOrders.filter(co => co.status === "pending").length} active sketches</span>
                        </div>
                        <button 
                          onClick={() => setActiveTab("custom")}
                          className="bg-[#B8962E]/10 hover:bg-[#B8962E] text-[#B8962E] hover:text-white px-3 py-1.5 rounded-lg border-none font-bold text-[8px] uppercase tracking-wider cursor-pointer transition-all"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="max-w-7xl mx-auto space-y-6">
              {orders.length === 0 ? (
                <div className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] p-12 text-center rounded-2xl shadow-sm">
                  <ShoppingBag size={36} className="text-[#B8962E]/40 mx-auto mb-4" />
                  <h3 className="font-serif text-sm tracking-widest uppercase text-[#111111] m-0">No Orders Registered</h3>
                  <p className="text-[#777777] text-xs font-light mt-1">Carts that are currently being populated will show here once checked out.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] rounded-2xl overflow-hidden hover:border-[#B8962E]/40 transition-all shadow-sm">
                      
                      {/* Order Header Grid */}
                      <div className="bg-[#FAFAF7] p-6 border-b border-[rgba(184,150,46,0.1)] grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <span className="text-[7px] uppercase tracking-widest text-[#B8962E] font-bold block mb-1">Order Identifier</span>
                          <span className="font-mono text-xs font-bold text-[#111111]">{order.order_number}</span>
                        </div>
                        <div>
                          <span className="text-[7px] uppercase tracking-widest text-[#777777] font-bold block mb-1">Patron</span>
                          <span className="text-xs font-semibold text-[#111111]">{order.customer_name}</span>
                        </div>
                        <div>
                          <span className="text-[7px] uppercase tracking-widest text-[#777777] font-bold block mb-1">Receipt Value</span>
                          <span className="font-serif text-xs font-bold text-[#B8962E]">₦{order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-end items-center gap-3">
                          <span className="text-[8px] uppercase tracking-wider text-[#777777] font-bold block md:hidden mb-1">Action</span>
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className="bg-white border border-[rgba(184,150,46,0.3)] text-[#111111] px-3 py-2 text-[8px] uppercase tracking-widest font-bold rounded-lg cursor-pointer focus:outline-none focus:border-[#B8962E]"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>
                      </div>

                      {/* Split details body */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* Items Column (7 cols) */}
                        <div className="md:col-span-7 space-y-4">
                          <h4 className="font-serif text-[10px] uppercase tracking-widest text-[#777777] m-0 border-b border-gray-100 pb-2">Line Items</h4>
                          
                          <div className="space-y-3">
                            {order.order_items?.map((item) => (
                              <div key={item.id} className="flex justify-between items-center bg-[#FAFAF7] p-3.5 border border-[rgba(184,150,46,0.1)] rounded-xl">
                                <div>
                                  <span className="text-xs font-semibold text-[#111111] block">{item.product_name}</span>
                                  <span className="text-[8px] uppercase tracking-wider text-[#B8962E] font-bold">
                                    ₦{item.price_per_yard.toLocaleString()} per yard
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-mono font-medium text-[#111111] block">{item.yards_ordered} Yards</span>
                                  <span className="text-[10px] font-serif text-[#777777]">
                                    ₦{item.line_total.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer & Shipping Column (5 cols) */}
                        <div className="md:col-span-5 space-y-6 bg-[#FAFAF7]/40 border border-[rgba(184,150,46,0.12)] p-6 rounded-xl">
                          <div>
                            <h4 className="font-serif text-[10px] uppercase tracking-widest text-[#777777] m-0 border-b border-gray-100 pb-2 mb-3">Delivery Parameters</h4>
                            <div className="space-y-2 text-xs font-light text-[#111111]/70">
                              <div><strong className="text-[#111111]/90 font-semibold">Email:</strong> {order.customer_email}</div>
                              <div><strong className="text-[#111111]/90 font-semibold">Phone:</strong> {order.customer_phone}</div>
                              <div><strong className="text-[#111111]/90 font-semibold">Address:</strong> {order.shipping_address}, {order.shipping_city}, {order.shipping_state}</div>
                              {order.notes && <div className="bg-[#FAFAF7] p-3 rounded-lg border border-[rgba(184,150,46,0.15)] mt-2 italic text-[10px] text-[#777777]">"{order.notes}"</div>}
                            </div>
                          </div>

                          {/* Tracking Number Input */}
                          <div className="space-y-2 pt-2 border-t border-gray-200">
                            <span className="text-[7px] uppercase tracking-widest text-[#777777] font-bold block">Shipping Air Waybill / Tracking #</span>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                placeholder="Enter tracking / airwaybill ID"
                                value={trackingNumber[order.id] || ""}
                                onChange={(e) => setTrackingNumber({...trackingNumber, [order.id]: e.target.value})}
                                className="bg-white border border-[rgba(184,150,46,0.22)] px-3 py-2 rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#B8962E] flex-grow font-mono"
                              />
                              <button 
                                onClick={() => handleUpdateOrderStatus(order.id, "shipped")}
                                disabled={updatingId === order.id}
                                className="bg-[#111111] hover:bg-[#B8962E] text-white px-4 py-2 text-[8px] uppercase tracking-wider font-bold rounded-lg border-none cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
                              >
                                <Send size={10} /> Dispatch
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Custom Sketches Tab */}
          {activeTab === "custom" && (
            <div className="max-w-7xl mx-auto space-y-6">
              {customOrders.length === 0 ? (
                <div className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] p-12 text-center rounded-2xl shadow-sm">
                  <Layers size={36} className="text-[#B8962E]/40 mx-auto mb-4" />
                  <h3 className="font-serif text-sm tracking-widest uppercase text-[#111111] m-0">No Sizing Inquiries</h3>
                  <p className="text-[#777777] text-xs font-light mt-1">Patron sizing charts, design descriptions, and tailor requests appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customOrders.map((co) => (
                    <div key={co.id} className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] rounded-2xl overflow-hidden hover:border-[#B8962E]/40 transition-all flex flex-col justify-between shadow-sm">
                      
                      <div>
                        {/* Header banner */}
                        <div className="bg-[#FAFAF7] p-5 border-b border-[rgba(184,150,46,0.1)] flex justify-between items-center">
                          <div>
                            <span className="text-[7px] uppercase tracking-widest text-[#B8962E] font-bold block mb-1">Tailoring Request</span>
                            <span className="text-xs font-bold text-[#111111]">{co.full_name}</span>
                          </div>
                          
                          <select 
                            value={co.status}
                            onChange={(e) => handleUpdateCustomOrder(co.id, e.target.value)}
                            disabled={updatingId === co.id}
                            className="bg-white border border-[rgba(184,150,46,0.3)] text-[#111111] px-2.5 py-1.5 text-[8px] uppercase tracking-widest font-bold rounded-lg cursor-pointer focus:outline-none focus:border-[#B8962E]"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        {/* Request content info */}
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-xs font-light text-[#111111]/70">
                            <div><strong className="text-[#111111] font-semibold">Fabric base:</strong> {co.fabric_type}</div>
                            <div><strong className="text-[#111111] font-semibold">Est. yards:</strong> {co.estimated_yards} Yards</div>
                            <div><strong className="text-[#111111] font-semibold">Phone:</strong> {co.phone}</div>
                            <div><strong className="text-[#111111] font-semibold">Email:</strong> {co.email}</div>
                          </div>

                          <div className="pt-3 border-t border-gray-100">
                            <span className="text-[7px] uppercase tracking-widest text-[#777777] font-bold block mb-1.5">Patron Idea &amp; Sizing Specs</span>
                            <p className="bg-[#FAFAF7] p-4 rounded-xl border border-[rgba(184,150,46,0.12)] text-xs text-[#111111]/80 leading-relaxed font-light italic m-0">
                              "{co.ideas_description}"
                            </p>
                          </div>

                          {/* Sketch Image if Uploaded */}
                          {co.reference_image_url && (
                            <div className="pt-3 border-t border-gray-100">
                              <span className="text-[7px] uppercase tracking-widest text-[#777777] font-bold block mb-2">Design Sketch Attachment</span>
                              <a href={co.reference_image_url} target="_blank" rel="noreferrer" className="block relative group overflow-hidden border border-gray-200 rounded-xl aspect-[16/9]">
                                <img src={co.reference_image_url} alt="Bespoke Design Sketch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-[#111111]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[8px] uppercase tracking-widest font-bold text-white border border-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                    Open Sizing Canvas <ExternalLink size={10} />
                                  </span>
                                </div>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Admin Sizing Notes Response Footer */}
                      <div className="p-5 bg-[#FAFAF7]/30 border-t border-gray-100 space-y-3">
                        <span className="text-[7px] uppercase tracking-widest text-[#777777] font-bold block">Atelier Sizing Notes &amp; Estimation</span>
                        <div className="flex gap-2">
                          <textarea 
                            rows={1}
                            placeholder="Enter custom yardage estimation or atelier responses..."
                            value={customNotes[co.id] || co.admin_notes || ""}
                            onChange={(e) => setCustomNotes({...customNotes, [co.id]: e.target.value})}
                            className="bg-white border border-[rgba(184,150,46,0.22)] px-3 py-2 rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#B8962E] flex-grow resize-none"
                          />
                          <button 
                            onClick={() => handleUpdateCustomOrder(co.id, "approved")}
                            disabled={updatingId === co.id}
                            className="bg-[#111111] hover:bg-[#B8962E] text-white px-4 rounded-lg border-none cursor-pointer transition-all flex items-center justify-center font-bold text-[8px] uppercase tracking-wider shrink-0"
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Patrons Tab */}
          {activeTab === "customers" && (
            <div className="max-w-7xl mx-auto">
              {customers.length === 0 ? (
                <div className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] p-12 text-center rounded-2xl shadow-sm">
                  <Users size={36} className="text-[#B8962E]/40 mx-auto mb-4" />
                  <h3 className="font-serif text-sm tracking-widest uppercase text-[#111111] m-0">No Registered Patrons</h3>
                  <p className="text-[#777777] text-xs font-light mt-1">Customers that sign up via the front salon will populate this database.</p>
                </div>
              ) : (
                <div className="bg-[#FFFFFF] border border-[rgba(184,150,46,0.18)] rounded-2xl overflow-hidden p-6 shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[rgba(184,150,46,0.1)]">
                          <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Patron Name</th>
                          <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Email Address</th>
                          <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Contact Phone</th>
                          <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Atelier Orders</th>
                          <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Role / Access</th>
                          <th className="pb-3 text-[8px] uppercase tracking-wider text-[#777777] font-bold">Join Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {customers.map((c) => (
                          <tr key={c.id} className="hover:bg-[#FAFAF7] transition-colors">
                            <td className="py-4 font-semibold text-xs text-[#111111]">{c.full_name || "Guest Patron"}</td>
                            <td className="py-4 text-xs font-light text-[#111111]/80 font-mono">{c.email}</td>
                            <td className="py-4 text-xs font-mono text-[#111111]/80">{c.phone || "—"}</td>
                            <td className="py-4">
                              <span className="inline-block text-[10px] font-bold text-[#B8962E] bg-[#B8962E]/10 border border-[rgba(184,150,46,0.2)] px-2.5 py-0.5 rounded-lg">
                                {c.orders?.count || 0} purchases
                              </span>
                            </td>
                            <td className="py-4">
                              <select 
                                value={c.role || "customer"}
                                onChange={(e) => handleUpdateCustomerRole(c.id, e.target.value)}
                                disabled={updatingId === c.id || c.id === user.id}
                                className="bg-white border border-[rgba(184,150,46,0.3)] text-[#111111] px-2 py-1 text-[8px] uppercase tracking-widest font-bold rounded-lg cursor-pointer focus:outline-none focus:border-[#B8962E] disabled:opacity-50"
                              >
                                <option value="customer">Customer</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="py-4 text-[9px] font-mono text-[#777777]">{new Date(c.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
