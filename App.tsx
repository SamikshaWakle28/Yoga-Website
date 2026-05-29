import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// --- Components ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EventModal from "./components/EventModal";
import VerificationBanner from "./components/VerificationBanner";

// --- Pages ---
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import AcademyPage from "./pages/AcademyPage";
import TeamPage from "./pages/TeamPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import MyBookingsPage from "./pages/MyBookingsPage";

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/admin";

  return (
    <div className="min-h-screen font-sans bg-peace selection:bg-saffron/30">
      <VerificationBanner />
      {!isAuthPage && <Navbar />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route 
            path="/programs" 
            element={<ProgramsPage onSelectEvent={setSelectedEvent} />} 
          />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}

      <AnimatePresence>
        {selectedEvent && (
          <EventModal 
            event={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
