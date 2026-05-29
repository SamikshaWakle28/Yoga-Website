import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, MapPin, Clock, ArrowRight, Sun, Video, 
  CheckCircle2, Phone, Mail, User, CreditCard, 
  ExternalLink, Loader2, AlertCircle 
} from "lucide-react";
import { cn } from "../lib/utils";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs, where, getDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";

interface OnlineClass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  meetingLink: string;
  image: string;
}

const BookingModal = ({ 
  selectedClass, 
  onClose 
}: { 
  selectedClass: OnlineClass; 
  onClose: () => void;
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.displayName || "",
          email: user.email || ""
        }));

        // Fetch extra info from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFormData(prev => ({
              ...prev,
              name: userData.name || prev.name,
              whatsapp: userData.mobile || ""
            }));
          }

          if (!user.emailVerified && user.email !== "samikshawakle28@gmail.com") {
            setError("Please verify your email address before booking with your account. Check your inbox for the verification link.");
          }
        } catch (err) {
          console.error("Error fetching user data for booking:", err);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const generateWhatsAppLink = () => {
    const message = encodeURIComponent(
      `Hello! I have booked the online class: ${selectedClass.title}.\n\n` +
      `Details:\n` +
      `- Date: ${selectedClass.date}\n` +
      `- Time: ${selectedClass.time}\n` +
      `- Meeting Link: ${selectedClass.meetingLink}\n\n` +
      `Thank you!`
    );
    return `https://wa.me/${formData.whatsapp.replace(/\D/g, "")}?text=${message}`;
  };

  const handlePayment = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified && auth.currentUser.email !== "samikshawakle28@gmail.com") {
      setError("Please verify your email address to continue booking with your account.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const q = query(
        collection(db, "bookings"),
        where("classId", "==", selectedClass.id),
        where("customerEmail", "==", formData.email),
        where("customerWhatsapp", "==", formData.whatsapp)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError("You have already booked this class with this email and phone number.");
        setIsProcessing(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await addDoc(collection(db, "bookings"), {
        classId: selectedClass.id,
        classTitle: selectedClass.title,
        customerName: formData.name,
        customerEmail: formData.email,
        customerWhatsapp: formData.whatsapp,
        amountPaid: selectedClass.price,
        bookingDate: serverTimestamp(),
        classDate: selectedClass.date,
        classTime: selectedClass.time
      });

      setIsProcessing(false);
      setStep(3);

      setTimeout(() => {
        window.open(generateWhatsAppLink(), "_blank");
      }, 1000);

    } catch (err) {
      console.error("Booking failed:", err);
      setIsProcessing(false);
      alert("Booking failed. Please try again.");
    }
  };

  const generateCalendarLink = () => {
    const title = encodeURIComponent(selectedClass.title);
    const details = encodeURIComponent(`${selectedClass.description}\n\nMeeting Link: ${selectedClass.meetingLink}`);
    const dateStr = selectedClass.date.replace(/-/g, "");
    const startTime = "100000Z"; 
    const endTime = "110000Z";
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}T${startTime}/${dateStr}T${endTime}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-earth/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-500",
                  step >= s ? "bg-saffron" : "bg-gray-100"
                )}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-serif font-bold text-earth mb-2">Your Details</h2>
                <p className="text-gray-500">Registration is not compulsory. Just provide your contact info.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-earth ml-1">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-earth ml-1">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-earth ml-1">WhatsApp Number</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      placeholder="+1 234 567 890"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>

              <button 
                disabled={!formData.name || !formData.email || !formData.whatsapp}
                onClick={handleNext}
                className="w-full py-4 bg-saffron hover:bg-maroon disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-xl shadow-saffron/20 transition-all flex items-center justify-center gap-2 group"
              >
                Continue to Payment
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-serif font-bold text-earth mb-2">Payment</h2>
                <p className="text-gray-500">Secure payment for your online class.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="bg-peace p-6 rounded-2xl border border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Class Fee</span>
                  <span className="font-bold text-earth">${selectedClass.price}</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-earth">Total</span>
                  <span className="font-bold text-saffron">${selectedClass.price}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-earth ml-1">Card Details</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                    />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="MM/YY"
                    className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                  />
                  <input 
                    type="text" 
                    placeholder="CVC"
                    className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleBack}
                  className="flex-1 py-4 border border-gray-200 text-earth rounded-2xl font-bold hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-[2] py-4 bg-saffron hover:bg-maroon text-white rounded-2xl font-bold shadow-xl shadow-saffron/20 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={20} /> : `Pay $${selectedClass.price}`}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-8 py-4">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={48} />
              </div>
              
              <div>
                <h2 className="text-3xl font-serif font-bold text-earth mb-2">Booking Confirmed!</h2>
                <p className="text-gray-500">A confirmation message has been sent to your WhatsApp.</p>
              </div>

              <div className="bg-peace p-6 rounded-[2rem] text-left space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-saffron shadow-sm">
                    <Video size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-widest font-bold">Meeting Link</div>
                    <a 
                      href={selectedClass.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-saffron font-bold hover:underline flex items-center gap-1"
                    >
                      Join Class <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Phone size={18} />
                  Open WhatsApp
                </a>
                <a 
                  href={generateCalendarLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 bg-earth hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Calendar size={18} />
                  Add to Calendar
                </a>
              </div>

              <button 
                onClick={onClose}
                className="text-gray-400 font-bold hover:text-earth transition-colors"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const FeaturedEvent = ({ onSelectEvent }: { onSelectEvent: (event: any) => void }) => {
  const featuredEvent = {
    date: "May 23, 2026",
    fullDate: "Saturday, May 23, 2026",
    title: "Grand Buddha Purnima 2026",
    location: "Main Temple Complex",
    time: "05:00 AM - 09:00 PM",
    category: "Celebration",
    img: "https://images.unsplash.com/photo-1545063914-a1a6ec821c88?q=80&w=2070&auto=format&fit=crop",
    description: "Celebrate the birth, enlightenment, and passing of the Buddha in our grand annual event. This day-long program includes traditional chanting, guided group meditations, a ceremonial bathing of the Buddha, and insightful Dharma talks by esteemed monks from around the world.",
    speaker: {
      name: "Ven. Bodhi",
      role: "Chief Abbot",
      bio: "A renowned scholar of early Buddhist texts with over 40 years of monastic experience.",
      img: "https://images.unsplash.com/photo-1590059393160-5807908b9845?q=80&w=2070&auto=format&fit=crop"
    }
  };

  return (
    <section className="py-24 bg-white px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-peace rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row-reverse">
          <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-saffron/10 text-saffron rounded-full text-sm font-bold mb-6 w-fit">
              <Sun size={16} />
              <span>Featured Event</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-earth mb-6 leading-tight">
              Grand Buddha <br />
              <span className="text-saffron italic">Purnima 2026</span>
            </h2>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Join us for the most sacred day in the Buddhist calendar. A day of reflection, meditation, and celebration of the Buddha's birth, enlightenment, and passing.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Days", value: "45" },
                { label: "Hours", value: "12" },
                { label: "Mins", value: "30" },
                { label: "Secs", value: "15" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl text-center shadow-sm border border-gray-100">
                  <div className="text-2xl font-bold text-earth">{item.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onSelectEvent(featuredEvent)}
                className="bg-saffron text-white px-8 py-4 rounded-full font-bold hover:bg-maroon transition-all shadow-lg flex items-center gap-2"
              >
                Book Your Seat <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative min-h-[500px]">
            <img 
              src="https://images.unsplash.com/photo-1545063914-a1a6ec821c88?q=80&w=2070&auto=format&fit=crop" 
              alt="Buddha Purnima" 
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-peace via-transparent to-transparent hidden lg:block" />
            
            <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/50">
              <div className="text-saffron font-bold text-3xl mb-1">May 23</div>
              <div className="text-earth font-medium uppercase tracking-widest text-xs">Save the Date</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Events = ({ onSelectEvent }: { onSelectEvent: (event: any) => void }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Celebration", "Retreat", "Dharma Talk"];

  const events = [
    {
      date: "July 11, 2025",
      fullDate: "Friday, July 11, 2025",
      title: "Buddha Purnima Celebration",
      location: "Main Temple Hall",
      time: "09:00 AM - 05:00 PM",
      img: "https://images.unsplash.com/photo-1545063914-a1a6ec821c88?q=80&w=2070&auto=format&fit=crop",
      category: "Celebration",
      description: "A day of profound spiritual practice and community gathering to honor the Buddha's life. Includes chanting, meditation, and a communal vegetarian lunch.",
      speaker: {
        name: "Ven. Bodhi",
        role: "Chief Abbot",
        bio: "Monastic scholar with deep roots in Pali tradition.",
        img: "https://images.unsplash.com/photo-1590059393160-5807908b9845?q=80&w=2070&auto=format&fit=crop"
      }
    },
    {
      date: "Aug 05, 2025",
      fullDate: "Tuesday, August 5, 2025",
      title: "Mindfulness Retreat",
      location: "Mountain Sanctuary",
      time: "Weekend Program",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
      category: "Retreat",
      description: "Escape the noise of modern life in this immersive weekend retreat. Learn advanced mindfulness techniques and practice noble silence in a beautiful mountain setting.",
      speaker: {
        name: "Sister Metta",
        role: "Meditation Guide",
        bio: "Specialist in Vipassana and loving-kindness meditation.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
      }
    },
    {
      date: "Sept 20, 2025",
      fullDate: "Saturday, September 20, 2025",
      title: "Dharma Talk Series",
      location: "Community Center",
      time: "06:30 PM - 08:30 PM",
      img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2050&auto=format&fit=crop",
      category: "Dharma Talk",
      description: "An evening of intellectual and spiritual exploration. This session focuses on applying ancient Buddhist wisdom to modern ethical dilemmas and daily challenges.",
      speaker: {
        name: "Dr. Ananda",
        role: "Philosophy Head",
        bio: "Academic expert in Buddhist philosophy and ethics.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
      }
    }
  ];

  const filteredEvents = activeCategory === "All" 
    ? events 
    : events.filter(e => e.category === activeCategory);

  return (
    <section id="programs" className="py-24 bg-earth text-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-saffron font-bold uppercase tracking-widest text-sm mb-4 block">Upcoming Programs</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
              Join Our Next <span className="text-gold italic">Events</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all border",
                  activeCategory === cat 
                    ? "bg-saffron border-saffron text-white" 
                    : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((e) => (
              <motion.div
                key={e.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-saffron/50 transition-all"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={e.img} 
                    alt={e.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-saffron text-white text-xs font-bold px-3 py-1 rounded-full">
                    {e.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-saffron font-bold mb-4">
                    <Calendar size={18} />
                    <span>{e.date}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-6 group-hover:text-gold transition-colors">{e.title}</h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-white/70">
                      <MapPin size={16} />
                      <span className="text-sm">{e.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <Clock size={16} />
                      <span className="text-sm">{e.time}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onSelectEvent(e)}
                    className="w-full py-3 rounded-xl border border-white/20 group-hover:bg-saffron group-hover:border-saffron transition-all font-bold"
                  >
                    Register Now
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ProgramsPage = ({ onSelectEvent }: { onSelectEvent: (event: any) => void }) => {
  const [selectedClass, setSelectedClass] = useState<OnlineClass | null>(null);
  const [classes, setClasses] = useState<OnlineClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "classes"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OnlineClass));
      setClasses(classesData);
      setIsLoading(false);
    }, (err) => {
      console.error("Classes snapshot error:", err);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-20">
      <div className="bg-earth py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Programs & Online Classes</h1>
        <p className="text-white/60 max-w-2xl mx-auto">Discover our upcoming events, retreats, and live interactive sessions designed to deepen your practice.</p>
      </div>
      
      <FeaturedEvent onSelectEvent={onSelectEvent} />
      
      <Events onSelectEvent={onSelectEvent} />

      {/* Online Classes Section */}
      <section id="online-classes" className="py-24 bg-peace px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-saffron font-bold uppercase tracking-widest text-sm mb-4 block">Interactive Learning</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-earth mb-6">Live Online Classes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Join our live interactive sessions from anywhere in the world. Deepen your practice with expert guidance in real-time.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-saffron" size={48} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classes.map((cls) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100 group"
                >
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={cls.image} 
                      alt={cls.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-saffron font-bold text-sm shadow-lg">
                      ${cls.price}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-saffron" />
                        <span>{cls.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-saffron" />
                        <span>{cls.time}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-earth mb-4 group-hover:text-saffron transition-colors">
                      {cls.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-8 line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-peace flex items-center justify-center text-earth">
                          <User size={16} />
                        </div>
                        <span className="text-sm font-bold text-earth">{cls.instructor}</span>
                      </div>
                      <button 
                        onClick={() => setSelectedClass(cls)}
                        className="bg-peace hover:bg-saffron hover:text-white text-saffron px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2"
                      >
                        Book Now <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {classes.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-500 text-lg">No online classes scheduled at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedClass && (
          <BookingModal 
            selectedClass={selectedClass} 
            onClose={() => setSelectedClass(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgramsPage;
