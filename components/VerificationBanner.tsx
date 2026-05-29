import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { sendEmailVerification, onAuthStateChanged, User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, X, Send, CheckCircle2 } from "lucide-react";

const VerificationBanner = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Show banner if user is logged in via email/password but not verified
      // Note: Google users are usually verified, but we check anyway
      if (currentUser && !currentUser.emailVerified && currentUser.email !== "samikshawakle28@gmail.com") {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleResend = async () => {
    if (!user) return;
    setIsResending(true);
    try {
      await sendEmailVerification(user);
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      console.error("Error resending verification email:", error);
    } finally {
      setIsResending(false);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[200] bg-saffron text-white px-6 py-3 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">
              Your email <span className="font-bold underline">{user?.email}</span> is not verified. 
              Please check your inbox to activate your account.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleResend}
              disabled={isResending || resent}
              className="flex items-center gap-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold transition-all disabled:opacity-50"
            >
              {resent ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Sent!</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>{isResending ? "Sending..." : "Resend Email"}</span>
                </>
              )}
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerificationBanner;
