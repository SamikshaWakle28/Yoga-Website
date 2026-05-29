import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Flower2, User, LogOut, LayoutDashboard, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { auth } from "../firebase";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Programs & Classes", href: "/programs" },
    { name: "Academy", href: "/academy" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ];

  const isHome = location.pathname === "/";

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4",
      isScrolled || !isHome ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center text-white">
            <Flower2 size={24} />
          </div>
          <span className={cn(
            "text-2xl font-serif font-bold tracking-tight",
            isScrolled || !isHome ? "text-earth" : "text-white"
          )}>
            Buddhism<span className="text-saffron">Life</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-saffron",
                isScrolled || !isHome ? "text-earth" : "text-white",
                location.pathname === link.href && "text-saffron"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              {user.email === "samikshawakle28@gmail.com" && (
                <Link 
                  to="/admin"
                  className={cn(
                    "text-sm font-bold flex items-center gap-2 transition-colors hover:text-saffron",
                    isScrolled || !isHome ? "text-earth" : "text-white",
                    location.pathname === "/admin" && "text-saffron"
                  )}
                >
                  <LayoutDashboard size={18} />
                  Admin
                </Link>
              )}
              <Link 
                to="/my-bookings"
                className={cn(
                  "text-sm font-bold flex items-center gap-2 transition-colors hover:text-saffron",
                  isScrolled || !isHome ? "text-earth" : "text-white",
                  location.pathname === "/my-bookings" && "text-saffron"
                )}
              >
                <div className="relative">
                  <User size={18} />
                  {user && !user.emailVerified && user.email !== "samikshawakle28@gmail.com" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                  )}
                </div>
                My Bookings
              </Link>
              <button 
                onClick={() => auth.signOut()}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login"
                className={cn(
                  "text-sm font-bold transition-colors hover:text-saffron",
                  isScrolled || !isHome ? "text-earth" : "text-white"
                )}
              >
                Login
              </Link>
              <Link 
                to="/login"
                state={{ isSignUp: true }}
                className="bg-saffron hover:bg-maroon text-white px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-saffron/20 flex items-center gap-2"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className={cn("md:hidden", isScrolled || !isHome ? "text-earth" : "text-white")}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden py-6 px-6 flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-earth text-lg font-medium border-b border-gray-100 pb-2",
                  location.pathname === link.href && "text-saffron"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <div className="flex flex-col gap-4 mt-2">
                {user.email === "samikshawakle28@gmail.com" && (
                  <Link
                    to="/admin"
                    className={cn(
                      "text-earth text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-2",
                      location.pathname === "/admin" && "text-saffron"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard size={20} />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/my-bookings"
                  className={cn(
                    "text-earth text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-2",
                    location.pathname === "/my-bookings" && "text-saffron"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="relative">
                    <User size={20} />
                    {user && !user.emailVerified && user.email !== "samikshawakle28@gmail.com" && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  My Bookings
                </Link>
                <button 
                  onClick={() => {
                    auth.signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-red-500 font-bold flex items-center gap-2 text-lg"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                <Link 
                  to="/login"
                  className="w-full bg-white border-2 border-saffron text-saffron py-4 rounded-2xl font-bold flex items-center justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/login"
                  state={{ isSignUp: true }}
                  className="w-full bg-saffron text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-saffron/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
