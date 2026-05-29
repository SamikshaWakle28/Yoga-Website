import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Search, Filter, Calendar, Clock, User, Video, 
  Trash2, Edit3, ChevronRight, LogOut, LayoutDashboard, 
  Users, BookOpen, CheckCircle2, AlertCircle, X, Save, Phone, Upload, Loader2 as Spinner,
  BarChart3, TrendingUp, PieChart as PieChartIcon, DollarSign, ClipboardList, UserCheck, UserMinus, Info
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  collection, addDoc, getDocs, query, orderBy, 
  where, deleteDoc, doc, updateDoc, onSnapshot, serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../firebase";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

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
  capacity: number;
}

interface Booking {
  id: string;
  classId: string;
  classTitle: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  amountPaid: number;
  bookingDate: any;
  classDate: string;
  classTime: string;
  attended?: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"bookings" | "classes" | "analytics" | "operations">("operations");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [classes, setClasses] = useState<OnlineClass[]>([]);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [editingClass, setEditingClass] = useState<OnlineClass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");

  // New Class Form
  const [newClass, setNewClass] = useState({
    title: "",
    description: "",
    instructor: "",
    date: "",
    time: "",
    duration: "60 mins",
    price: 0,
    meetingLink: "",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
    capacity: 20
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const isSimulated = localStorage.getItem("admin_simulated") === "true";

      if (!user && !isSimulated) {
        navigate("/login");
        return;
      }
      
      if (user && (user.email !== "samikshawakle28@gmail.com" || !user.emailVerified)) {
        navigate("/");
        return;
      }
      
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const unsubClasses = onSnapshot(collection(db, "classes"), (snapshot) => {
      const classesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OnlineClass));
      setClasses(classesData);
      setIsLoading(false);
    }, (err) => {
      console.error("Classes snapshot error:", err);
      setError("Failed to load classes. Permission denied.");
    });

    const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(bookingsData);
    }, (err) => {
      console.error("Bookings snapshot error:", err);
      setError("Failed to load bookings. Permission denied.");
    });

    return () => {
      unsubClasses();
      unsubBookings();
    };
  }, []);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `classes/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      if (editingClass) {
        setEditingClass({ ...editingClass, image: url });
      } else {
        setNewClass({ ...newClass, image: url });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "classes"), {
        ...newClass,
        createdAt: serverTimestamp()
      });
      setIsAddingClass(false);
      setNewClass({
        title: "",
        description: "",
        instructor: "",
        date: "",
        time: "",
        duration: "60 mins",
        price: 0,
        meetingLink: "",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop"
      });
    } catch (err) {
      setError("Failed to add class. Check permissions.");
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteDoc(doc(db, "classes", id));
      } catch (err) {
        setError("Failed to delete class.");
      }
    }
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    try {
      const { id, ...data } = editingClass;
      await updateDoc(doc(db, "classes", id), data);
      setEditingClass(null);
    } catch (err) {
      setError("Failed to update class.");
    }
  };

  const handleToggleAttendance = async (bookingId: string, currentAttended: boolean) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        attended: !currentAttended
      });
    } catch (err) {
      setError("Failed to update attendance.");
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: newStatus
      });
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "All" || b.classTitle === classFilter;
    const matchesTime = timeFilter === "All" || b.classTime === timeFilter;
    return matchesSearch && matchesClass && matchesTime;
  });

  const uniqueClassTitles = ["All", ...new Set(classes.map(c => c.title))];
  const uniqueTimes = ["All", ...new Set(classes.map(c => c.time))];

  // Analytics Data Processing
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amountPaid, 0);
  const totalBookings = bookings.length;
  const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  // Revenue by Class
  const revenueByClass = classes.map(c => {
    const classBookings = bookings.filter(b => b.classId === c.id || b.classTitle === c.title);
    return {
      name: c.title,
      revenue: classBookings.reduce((sum, b) => sum + b.amountPaid, 0),
      bookings: classBookings.length
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Bookings by Date
  const bookingsByDate = bookings.reduce((acc: any, b) => {
    const date = b.classDate;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const lineChartData = Object.keys(bookingsByDate)
    .map(date => ({ date, count: bookingsByDate[date] }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Popularity (Pie Chart)
  const pieData = revenueByClass.map(item => ({
    name: item.name,
    value: item.bookings
  })).filter(item => item.value > 0);

  const COLORS = ['#D97706', '#991B1B', '#065F46', '#1E3A8A', '#4C1D95', '#BE185D'];

  // Operations Data
  const today = new Date().toISOString().split('T')[0];
  const dailyRoster = bookings.filter(b => b.classDate === today);
  
  const getWaitlist = (classId: string) => {
    const classObj = classes.find(c => c.id === classId);
    if (!classObj) return [];
    const classBookings = bookings
      .filter(b => b.classId === classId && b.status !== 'cancelled')
      .sort((a, b) => (a.bookingDate?.seconds || 0) - (b.bookingDate?.seconds || 0));
    
    return classBookings.slice(classObj.capacity || 20);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-peace flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-saffron"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-peace flex">
      {/* Sidebar */}
      <div className="w-64 bg-earth text-white flex flex-col p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight">Admin<span className="text-saffron">Panel</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab("bookings")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
              activeTab === "bookings" ? "bg-saffron text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Users size={20} />
            Bookings
          </button>
          <button 
            onClick={() => setActiveTab("classes")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
              activeTab === "classes" ? "bg-saffron text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <BookOpen size={20} />
            Classes
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
              activeTab === "analytics" ? "bg-saffron text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <BarChart3 size={20} />
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab("operations")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold",
              activeTab === "operations" ? "bg-saffron text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <ClipboardList size={20} />
            Operations
          </button>
        </nav>

        <button 
          onClick={() => {
            localStorage.removeItem("admin_simulated");
            auth.signOut().then(() => navigate("/"));
          }}
          className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-red-400 font-bold transition-all mt-auto"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif font-bold text-earth mb-2">
              {activeTab === "bookings" ? "Customer Bookings" : activeTab === "classes" ? "Manage Classes" : activeTab === "analytics" ? "Business Analytics" : "Daily Operations"}
            </h1>
            <p className="text-gray-500">
              {activeTab === "bookings" 
                ? `You have ${bookings.length} total bookings.` 
                : activeTab === "classes"
                ? `You are managing ${classes.length} active classes.`
                : activeTab === "analytics"
                ? "Insightful data about your spiritual community's growth."
                : `Daily Roster: ${dailyRoster.length} students scheduled for today.`}
            </p>
          </div>
          
          {activeTab === "classes" && (
            <button 
              onClick={() => setIsAddingClass(true)}
              className="bg-saffron text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-maroon transition-all shadow-lg shadow-saffron/20"
            >
              <Plus size={20} />
              New Class
            </button>
          )}
        </header>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3">
            <AlertCircle size={20} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
          </div>
        )}

        {activeTab === "operations" ? (
          <div className="space-y-8">
            {/* Daily Roster Section */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-peace rounded-full flex items-center justify-center text-saffron">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-earth">Daily Roster ({today})</h3>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-50">
                <table className="w-full text-left">
                  <thead className="bg-peace/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Class & Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Attended</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {dailyRoster.length > 0 ? dailyRoster.map((b) => (
                      <tr key={b.id} className="hover:bg-peace/20 transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-earth">{b.customerName}</div>
                          <div className="text-xs text-gray-400">{b.customerEmail}</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-bold text-saffron">{b.classTitle}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} /> {b.classTime}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <select 
                            value={b.status || 'confirmed'}
                            onChange={(e) => handleUpdateStatus(b.id, e.target.value as any)}
                            className={cn(
                              "text-xs font-bold px-3 py-1 rounded-full border-none focus:ring-0 cursor-pointer",
                              (b.status === 'confirmed' || !b.status) && "bg-green-50 text-green-600",
                              b.status === 'pending' && "bg-amber-50 text-amber-600",
                              b.status === 'cancelled' && "bg-red-50 text-red-600"
                            )}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button 
                            onClick={() => handleToggleAttendance(b.id, !!b.attended)}
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                              b.attended ? "bg-green-500 text-white shadow-lg shadow-green-200" : "bg-peace text-gray-300 hover:text-gray-400"
                            )}
                          >
                            <UserCheck size={20} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                          No students scheduled for today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Waitlist Management */}
            <div className="grid lg:grid-cols-2 gap-8">
              {classes.map(c => {
                const waitlist = getWaitlist(c.id);
                if (waitlist.length === 0) return null;
                return (
                  <div key={c.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                          <UserMinus size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-bold text-earth">{c.title}</h3>
                          <p className="text-xs text-gray-400">Waitlist Management</p>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
                        {waitlist.length} Waiting
                      </span>
                    </div>

                    <div className="space-y-3">
                      {waitlist.map((w, idx) => (
                        <div key={w.id} className="flex items-center justify-between p-4 bg-peace/50 rounded-2xl border border-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-gray-400">
                              #{idx + 1}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-earth">{w.customerName}</div>
                              <div className="text-[10px] text-gray-400">{new Date(w.bookingDate?.seconds * 1000).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 text-gray-400 hover:text-saffron transition-colors" title="Contact">
                              <Phone size={14} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === "analytics" ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6"
              >
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <DollarSign size={28} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Revenue</div>
                  <div className="text-3xl font-serif font-bold text-earth">${totalRevenue.toLocaleString()}</div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6"
              >
                <div className="w-14 h-14 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center">
                  <Users size={28} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Total Bookings</div>
                  <div className="text-3xl font-serif font-bold text-earth">{totalBookings}</div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-6"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Avg. Booking</div>
                  <div className="text-3xl font-serif font-bold text-earth">${avgBookingValue.toFixed(2)}</div>
                </div>
              </motion.div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 size={20} className="text-saffron" />
                  <h3 className="text-xl font-serif font-bold text-earth">Revenue by Class</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueByClass}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f9fafb' }}
                      />
                      <Bar dataKey="revenue" fill="#D97706" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp size={20} className="text-saffron" />
                  <h3 className="text-xl font-serif font-bold text-earth">Booking Trends</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="count" stroke="#D97706" strokeWidth={3} dot={{ r: 4, fill: '#D97706' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <PieChartIcon size={20} className="text-saffron" />
                  <h3 className="text-xl font-serif font-bold text-earth">Class Popularity</h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle2 size={20} className="text-saffron" />
                  <h3 className="text-xl font-serif font-bold text-earth">Top Performing Classes</h3>
                </div>
                <div className="space-y-6">
                  {revenueByClass.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-peace rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-saffron shadow-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-bold text-earth">{item.name}</div>
                          <div className="text-xs text-gray-400">{item.bookings} bookings</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-earth">${item.revenue}</div>
                        <div className="text-xs text-green-600 font-bold">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "bookings" ? (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-peace border border-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron/50"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-400" />
                <select 
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-peace border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-earth focus:outline-none"
                >
                  {uniqueClassTitles.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-peace border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-earth focus:outline-none"
                >
                  {uniqueTimes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-peace border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Class</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Schedule</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Paid</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-peace/50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="font-bold text-earth">{b.customerName}</div>
                        <div className="text-sm text-gray-500">{b.customerEmail}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-saffron font-bold">{b.classTitle}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-sm text-earth font-medium">
                          <Calendar size={14} /> {b.classDate}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={14} /> {b.classTime}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <a 
                          href={`https://wa.me/${b.customerWhatsapp.replace(/\D/g, "")}`} 
                          target="_blank" 
                          className="flex items-center gap-2 text-green-600 font-bold hover:underline"
                        >
                          <Phone size={14} /> {b.customerWhatsapp}
                        </a>
                      </td>
                      <td className="px-6 py-6">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                          ${b.amountPaid}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold",
                          (b.status === 'confirmed' || !b.status) && "bg-green-100 text-green-700",
                          b.status === 'pending' && "bg-amber-100 text-amber-700",
                          b.status === 'cancelled' && "bg-red-100 text-red-700"
                        )}>
                          {b.status || 'confirmed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-peace rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Search size={32} />
                  </div>
                  <p className="text-gray-500 font-medium">No bookings found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {classes.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
                <div className="w-40 h-full relative">
                  <img src={c.image} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-xs font-bold text-saffron uppercase tracking-widest mb-1">{c.instructor}</div>
                      <h3 className="text-xl font-serif font-bold text-earth">{c.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingClass(c)}
                        className="p-2 text-gray-400 hover:text-earth transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClass(c.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} className="text-saffron" /> {c.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} className="text-saffron" /> {c.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users size={14} className="text-saffron" /> Capacity: {c.capacity || 20}
                    </div>
                  </div>

                  <div className="bg-peace p-3 rounded-xl flex items-center gap-3">
                    <Video size={16} className="text-saffron" />
                    <span className="text-xs font-mono text-gray-600 truncate flex-1">{c.meetingLink}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Class Modal */}
      <AnimatePresence>
        {(isAddingClass || editingClass) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddingClass(false); setEditingClass(null); }}
              className="absolute inset-0 bg-earth/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <form onSubmit={editingClass ? handleUpdateClass : handleAddClass} className="p-12">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-serif font-bold text-earth">
                    {editingClass ? "Edit Class" : "Create New Class"}
                  </h2>
                  <button type="button" onClick={() => { setIsAddingClass(false); setEditingClass(null); }} className="text-gray-400 hover:text-earth">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Class Title</label>
                    <input 
                      required
                      type="text" 
                      value={editingClass ? editingClass.title : newClass.title}
                      onChange={(e) => editingClass ? setEditingClass({...editingClass, title: e.target.value}) : setNewClass({...newClass, title: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Instructor</label>
                    <input 
                      required
                      type="text" 
                      value={editingClass ? editingClass.instructor : newClass.instructor}
                      onChange={(e) => editingClass ? setEditingClass({...editingClass, instructor: e.target.value}) : setNewClass({...newClass, instructor: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Capacity</label>
                    <input 
                      required
                      type="number" 
                      value={editingClass ? editingClass.capacity : newClass.capacity}
                      onChange={(e) => editingClass ? setEditingClass({...editingClass, capacity: Number(e.target.value)}) : setNewClass({...newClass, capacity: Number(e.target.value)})}
                      className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Price ($)</label>
                    <input 
                      required
                      type="number" 
                      value={editingClass ? editingClass.price : newClass.price}
                      onChange={(e) => editingClass ? setEditingClass({...editingClass, price: Number(e.target.value)}) : setNewClass({...newClass, price: Number(e.target.value)})}
                      className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Date</label>
                    <input 
                      required
                      type="date" 
                      value={editingClass ? editingClass.date : newClass.date}
                      onChange={(e) => editingClass ? setEditingClass({...editingClass, date: e.target.value}) : setNewClass({...newClass, date: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Time</label>
                    <input 
                      required
                      type="text" 
                      placeholder="10:00 AM"
                      value={editingClass ? editingClass.time : newClass.time}
                      onChange={(e) => editingClass ? setEditingClass({...editingClass, time: e.target.value}) : setNewClass({...newClass, time: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron/50"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Meeting Link</label>
                    <input 
                      required
                      type="url" 
                      placeholder="https://zoom.us/j/..."
                      value={editingClass ? editingClass.meetingLink : newClass.meetingLink}
                      onChange={(e) => editingClass ? setEditingClass({...editingClass, meetingLink: e.target.value}) : setNewClass({...newClass, meetingLink: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron/50"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Class Image</label>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-2xl bg-peace border border-gray-100 overflow-hidden relative group">
                        <img 
                          src={editingClass ? editingClass.image : newClass.image} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer" 
                        />
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Spinner className="animate-spin text-white" size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-peace hover:bg-gray-100 text-earth rounded-xl font-bold cursor-pointer transition-all border border-gray-200">
                          <Upload size={18} className="text-saffron" />
                          {isUploading ? "Uploading..." : "Upload Image"}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                          />
                        </label>
                        <p className="text-xs text-gray-400 mt-2">Recommended: 1200x800px, max 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Description</label>
                    <textarea 
                      rows={3}
                      value={editingClass ? editingClass.description : newClass.description}
                      onChange={(e) => editingClass ? setEditingClass({...editingClass, description: e.target.value}) : setNewClass({...newClass, description: e.target.value})}
                      className="w-full px-5 py-4 rounded-2xl bg-peace border border-gray-100 focus:outline-none focus:ring-2 focus:ring-saffron/50 resize-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-8 py-4 bg-saffron hover:bg-maroon text-white rounded-2xl font-bold shadow-xl shadow-saffron/20 transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingClass ? "Update Class" : "Create Class"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
