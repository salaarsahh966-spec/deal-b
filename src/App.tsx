import React, { useState, useEffect } from "react";
import { 
  MapPin, 
  Search, 
  Tag, 
  Store, 
  User, 
  Heart, 
  TrendingUp, 
  Navigation,
  ChevronRight,
  LogIn,
  LogOut,
  PlusCircle,
  Clock,
  Eye,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { apiFetch } from "./lib/api";

// --- Types ---
interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  shopId: string;
  shopName?: string;
  expiryDate: string;
  lat: number;
  lng: number;
  viewsCount: number;
}

interface UserData {
  userId: string;
  email: string;
}

// --- Components ---

const Navbar = ({ user, onLoginClick, onLogout }: { user: UserData | null, onLoginClick: () => void, onLogout: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Tag size={20} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            LocalDeals
          </span>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search local offers..." 
              className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <Heart size={24} />
              </button>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <User size={14} />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.email}</span>
              </div>
              <button 
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-red-500 font-medium"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
            >
              <LogIn size={18} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const OfferCard = ({ offer }: { offer: Offer }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {/* Abstract Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center">
            <Tag size={48} className="text-indigo-200 opacity-50" />
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
            -{offer.discount}% OFF
          </span>
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors">
          <Heart size={18} />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          <span className="flex items-center gap-1">
            <Store size={12} />
            Local Shop
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Limited Time
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
          {offer.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">
          {offer.description}
        </p>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-gray-900">${offer.price}</span>
              <span className="text-sm text-gray-400 line-through">${offer.originalPrice}</span>
            </div>
          </div>
          <button className="bg-indigo-50 text-indigo-600 p-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
                <Eye size={10} />
                {offer.viewsCount} views
            </span>
            <span className="flex items-center gap-1">
                <MapPin size={10} />
                0.8 km away
            </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const offersData = await apiFetch("/api/offers");
      setOffers(offersData.data);
      
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const profile = await apiFetch("/api/auth/me");
          setUser(profile.data);
        } catch (e) {
          localStorage.removeItem("token");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const result = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", result.data.token);
      setUser({ userId: result.data.userId, email: result.data.email });
      setShowAuthModal(false);
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar user={user} onLoginClick={() => setShowAuthModal(true)} onLogout={handleLogout} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold mb-6 tracking-wide uppercase">
              🔥 Best Deals in your Neighborhood
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
              Discover Hidden <br />
              <span className="text-indigo-600">Local Bargains</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Find exclusive offers from shops around you. Save money while supporting local businesses in your community.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                 <Navigation size={20} />
                 Use My Location
               </button>
               <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95">
                 Browse Categories
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        {/* Filters / Categories */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-12">
            {["All Deals", "Fashion", "Electronics", "Groceries", "Dining", "Services"].map((cat, i) => (
                <button 
                  key={cat}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${i === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-gray-500 border border-gray-100 hover:border-indigo-200'}`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
                    <TrendingUp size={20} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Trending Near You</h2>
            </div>
            <button className="text-indigo-600 font-bold flex items-center gap-1 group">
                View All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {/* Grid */}
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-gray-100" />
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <div key={offer.id}>
                            <OfferCard offer={offer} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                            <Tag size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No offers found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your location or check back later.</p>
                        <button 
                          onClick={async () => {
                              try {
                                  await apiFetch("/api/seed", { method: "POST" });
                                  fetchInitialData();
                              } catch(e) {}
                          }}
                          className="px-6 py-2 bg-indigo-100 text-indigo-600 rounded-full font-bold hover:bg-indigo-200 transition-colors"
                        >
                            Generate Demo Data
                        </button>
                    </div>
                )}
            </div>
        )}
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowAuthModal(false)}
               className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
             >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
                        <User size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {authMode === "login" ? "Welcome Back!" : "Create Account"}
                    </h2>
                    <p className="text-gray-500">
                        {authMode === "login" ? "Enter your credentials to access your account" : "Join our community of local bargain hunters"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                        <input 
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                    <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                         {authMode === "login" ? "Sign In" : "Register"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                      onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                      className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                        {authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Tag className="text-indigo-600" size={24} />
                <span className="text-xl font-black text-gray-900">LocalDeals</span>
              </div>
              <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                Empowering small businesses and helping people save more. Built with ❤️ in your neighborhood.
              </p>
              <div className="flex justify-center gap-6 text-gray-400">
                  <a href="#" className="hover:text-indigo-600 font-bold transition-colors">Privacy</a>
                  <a href="#" className="hover:text-indigo-600 font-bold transition-colors">Terms</a>
                  <a href="#" className="hover:text-indigo-600 font-bold transition-colors">Contact</a>
              </div>
          </div>
      </footer>
    </div>
  );
}
