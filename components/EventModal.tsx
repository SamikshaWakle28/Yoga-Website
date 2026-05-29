import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle2, 
  Info, 
  ArrowRight 
} from "lucide-react";
import { cn } from "../lib/utils";

interface EventModalProps {
  event: any;
  onClose: () => void;
}

const EventModal = ({ event, onClose }: EventModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!event) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-earth/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-earth hover:bg-saffron hover:text-white transition-all shadow-lg"
        >
          <X size={24} />
        </button>

        {/* Left Side: Image & Info */}
        <div className="lg:w-1/2 overflow-y-auto custom-scrollbar bg-peace">
          <div className="h-64 md:h-80 relative">
            <img 
              src={event.img} 
              alt={event.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-saffron text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
              {event.category}
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 text-saffron font-bold mb-4">
              <Calendar size={20} />
              <span>{event.fullDate || event.date}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-earth mb-6 leading-tight">
              {event.title}
            </h2>
            
            <div className="flex flex-wrap gap-6 mb-8 py-6 border-y border-gray-200">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={20} className="text-saffron" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Location</div>
                  <div className="font-medium">{event.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={20} className="text-saffron" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Time</div>
                  <div className="font-medium">{event.time}</div>
                </div>
              </div>
            </div>

            <div className="prose prose-earth max-w-none mb-10">
              <h4 className="text-xl font-bold text-earth mb-4">About the Event</h4>
              <p className="text-gray-700 leading-relaxed">
                {event.description || "Join us for this special event focused on spiritual growth and community. Experience deep meditation, insightful teachings, and a peaceful atmosphere designed to nurture your soul."}
              </p>
            </div>

            {/* Speaker Info */}
            {event.speaker && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-lg font-bold text-earth mb-4 flex items-center gap-2">
                  <User size={20} className="text-saffron" />
                  Featured Speaker
                </h4>
                <div className="flex items-center gap-4">
                  <img 
                    src={event.speaker.img} 
                    alt={event.speaker.name} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-saffron/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-earth">{event.speaker.name}</div>
                    <div className="text-sm text-saffron font-medium">{event.speaker.role}</div>
                    <p className="text-xs text-gray-500 mt-1">{event.speaker.bio}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:w-1/2 p-8 md:p-12 bg-white overflow-y-auto custom-scrollbar border-l border-gray-100">
          <div className="max-w-md mx-auto h-full flex flex-col justify-center">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-earth mb-4">Registration Successful!</h3>
                <p className="text-gray-600 mb-8">
                  Thank you for registering for {event.title}. We've sent a confirmation email with all the details to your inbox.
                </p>
                <button 
                  onClick={onClose}
                  className="bg-earth text-white px-8 py-3 rounded-full font-bold hover:bg-saffron transition-all"
                >
                  Close Window
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-10">
                  <h3 className="text-2xl font-serif font-bold text-earth mb-2">Reserve Your Spot</h3>
                  <p className="text-gray-500">Please fill out the form below to register for this event. Limited seats available.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-earth ml-1">First Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John"
                        className="w-full px-5 py-3 rounded-xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-earth ml-1">Last Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Doe"
                        className="w-full px-5 py-3 rounded-xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full px-5 py-3 rounded-xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-5 py-3 rounded-xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-earth ml-1">Additional Notes</label>
                    <textarea 
                      rows={3}
                      placeholder="Any dietary requirements or special needs?"
                      className="w-full px-5 py-3 rounded-xl bg-peace border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-saffron/5 rounded-xl border border-saffron/10">
                    <Info size={20} className="text-saffron shrink-0" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      By registering, you agree to our terms and conditions. A small donation is appreciated but not mandatory for this event.
                    </p>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className={cn(
                      "w-full py-4 rounded-full font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2",
                      isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-saffron hover:bg-maroon"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Confirm Registration <ArrowRight size={18} /></>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventModal;
