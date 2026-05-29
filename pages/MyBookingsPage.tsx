import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { motion } from "motion/react";
import { Calendar, CheckCircle2, Clock, CreditCard, ExternalLink, Loader2, Package, User, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

interface Booking {
  id: string;
  classId: string;
  classTitle: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  amountPaid: number;
  bookingDate: any;
  classDate?: string;
  classTime?: string;
  meetingLink?: string;
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("customerEmail", "==", user.email),
      orderBy("bookingDate", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Booking));
      setBookings(bookingsData);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching bookings:", err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredBookings = bookings.filter((booking) => {
    if (!booking.classDate) return activeTab === "upcoming";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(booking.classDate);
    
    if (activeTab === "upcoming") {
      return bookingDate >= today;
    } else {
      return bookingDate < today;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-peace flex items-center justify-center">
        <Loader2 className="animate-spin text-saffron" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-peace flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-saffron/10 rounded-full flex items-center justify-center text-saffron mb-6">
          <User size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-earth mb-4">Sign in to view your bookings</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Please log in with the email you used for booking to see your class schedule and payment history.
        </p>
        <Link 
          to="/login" 
          className="px-8 py-3 bg-saffron text-white rounded-full font-bold shadow-lg shadow-saffron/20 hover:bg-maroon transition-all"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (!user.emailVerified && user.email !== "samikshawakle28@gmail.com") {
    return (
      <div className="min-h-screen bg-peace flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-saffron/10 rounded-full flex items-center justify-center text-saffron mb-6">
          <Mail size={40} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-earth mb-4">Verify your email</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Your account is not fully active yet. Please check your inbox for the verification link sent to <span className="font-bold">{user.email}</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-saffron text-white rounded-full font-bold shadow-lg shadow-saffron/20 hover:bg-maroon transition-all"
          >
            I've Verified
          </button>
          <button 
            onClick={async () => {
              await sendEmailVerification(user);
              alert("Verification email resent!");
            }}
            className="px-8 py-3 bg-white text-earth border-2 border-gray-100 rounded-full font-bold hover:bg-peace transition-all"
          >
            Resend Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-peace pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-earth mb-2">My Bookings</h1>
            <p className="text-gray-500">View your class schedule and payment history</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-saffron/10 rounded-full flex items-center justify-center text-saffron">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Logged in as</p>
              <p className="text-earth font-bold">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={cn(
              "px-8 py-3 rounded-full font-bold transition-all",
              activeTab === "upcoming" 
                ? "bg-saffron text-white shadow-lg shadow-saffron/20" 
                : "bg-white text-earth hover:bg-peace"
            )}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "px-8 py-3 rounded-full font-bold transition-all",
              activeTab === "history" 
                ? "bg-saffron text-white shadow-lg shadow-saffron/20" 
                : "bg-white text-earth hover:bg-peace"
            )}
          >
            History
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-earth/5 border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
              <Package size={40} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-earth mb-4">
              {activeTab === "upcoming" ? "No upcoming bookings" : "No booking history"}
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {activeTab === "upcoming" 
                ? "You don't have any upcoming classes. Explore our programs to join one."
                : "You don't have any past bookings yet."}
            </p>
            <Link 
              to="/programs" 
              className="inline-flex items-center gap-2 text-saffron font-bold hover:text-maroon transition-colors"
            >
              Browse Programs <ExternalLink size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-earth/5 border border-gray-100 flex flex-col md:flex-row gap-8"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-earth mb-1">{booking.classTitle}</h3>
                      <p className="text-sm text-gray-400 font-medium">Booking ID: {booking.id}</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-sm font-bold">
                      Confirmed
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-peace rounded-2xl flex items-center justify-center text-earth">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date</p>
                        <p className="text-earth font-bold">{booking.classDate || "TBA"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-peace rounded-2xl flex items-center justify-center text-earth">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Time</p>
                        <p className="text-earth font-bold">{booking.classTime || "TBA"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-peace rounded-2xl flex items-center justify-center text-earth">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Payment</p>
                        <p className="text-earth font-bold">₹{booking.amountPaid}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-peace rounded-2xl flex items-center justify-center text-earth">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Booked On</p>
                        <p className="text-earth font-bold">
                          {booking.bookingDate?.toDate().toLocaleDateString() || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:w-64 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                  {activeTab === "upcoming" ? (
                    <>
                      <p className="text-sm text-gray-500 text-center md:text-left">
                        The meeting link will be sent to your email and WhatsApp before the class starts.
                      </p>
                      <Link
                        to={`/programs`}
                        className="w-full py-3 bg-peace text-earth hover:bg-gray-100 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
                      >
                        View Class Details
                      </Link>
                    </>
                  ) : (
                    <div className="text-center md:text-left">
                      <p className="text-sm text-gray-500 mb-4">
                        This class has already taken place. We hope you enjoyed the session!
                      </p>
                      <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <CheckCircle2 size={16} /> Completed
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
