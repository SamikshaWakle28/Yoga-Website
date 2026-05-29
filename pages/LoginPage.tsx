import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Flower2, ArrowRight, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, User, Phone } from "lucide-react";
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "../firebase";

const LoginPage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp || false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });

  useEffect(() => {
    if (location.state?.isSignUp !== undefined) {
      setIsSignUp(location.state.isSignUp);
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Validation
        if (!formData.name || !formData.mobile || !formData.email || !formData.password) {
          throw new Error("Please fill in all fields.");
        }
        if (formData.password.length < 6) {
          throw new Error("Password should be at least 6 characters.");
        }

        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Send verification email
        await sendEmailVerification(result.user);
        setVerificationSent(true);

        // Update profile with name
        await updateProfile(result.user, {
          displayName: formData.name
        });

        // Save extra info to Firestore
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          role: formData.email === "samikshawakle28@gmail.com" ? "admin" : "user",
          emailVerified: false,
          createdAt: serverTimestamp()
        });

        // We don't navigate yet, we show the verification sent message
      } else {
        // Login
        const result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        
        if (!result.user.emailVerified && result.user.email !== "samikshawakle28@gmail.com") {
          setError("Please verify your email address before logging in. Check your inbox for the verification link.");
          await auth.signOut();
          setIsLoading(false);
          return;
        }

        if (result.user.email === "samikshawakle28@gmail.com") {
          localStorage.setItem("admin_simulated", "true");
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please switch to the 'Login' tab to sign in.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Email/Password sign-in is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method.");
      } else {
        setError(err.message || "Authentication failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setVerificationSent(false);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      // After successful auth, check if it's the admin
      if (email === "samikshawakle28@gmail.com") {
        if (isSignUp) {
          setError("This email is reserved for administrative access. Please use the Login option.");
          await auth.signOut();
          setIsLoading(false);
          return;
        }
        localStorage.setItem("admin_simulated", "true"); // Keep for backward compatibility
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("Login popup was closed before completion. Please try again.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Google Sign-In is not enabled. Please enable it in the Firebase Console under Authentication > Sign-in method.");
      } else {
        setError("Google Sign-In failed. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-peace flex flex-col">
      {/* Simple Login Header */}
      <header className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-saffron rounded-full flex items-center justify-center text-white">
            <Flower2 size={18} />
          </div>
          <span className="text-xl font-serif font-bold text-earth">
            Buddhism<span className="text-saffron">Life</span>
          </span>
        </Link>
        <Link to="/" className="text-sm font-bold text-gray-400 hover:text-saffron transition-colors">
          Back to Home
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
        >
            <div className="p-8 md:p-12">
              {verificationSent ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail size={40} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-earth mb-4">Check Your Email</h2>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    We've sent a verification link to <span className="font-bold text-earth">{formData.email}</span>. 
                    Please click the link in the email to activate your account.
                  </p>
                  <button
                    onClick={() => {
                      setVerificationSent(false);
                      setIsSignUp(false);
                    }}
                    className="w-full py-4 bg-saffron text-white rounded-2xl font-bold shadow-lg shadow-saffron/20"
                  >
                    Back to Login
                  </button>
                  <button
                    onClick={async () => {
                      if (auth.currentUser) {
                        await sendEmailVerification(auth.currentUser);
                        alert("Verification email resent!");
                      }
                    }}
                    className="mt-6 text-sm text-gray-400 hover:text-saffron font-medium transition-colors"
                  >
                    Didn't receive the email? Resend
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-saffron rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-saffron/20">
                      <Flower2 size={32} />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-earth mb-2">
                      {isSignUp ? "User Sign Up" : "Welcome Back"}
                    </h1>
                    <p className="text-gray-500">
                      {isSignUp 
                        ? "Join our community to start your spiritual journey and track your progress." 
                        : "Please sign in with your Google account to access your bookings and programs."}
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3">
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      {isSignUp && (
                        <>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-earth ml-1">Full Name</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                className="w-full pl-12 pr-4 py-4 bg-peace/30 border-2 border-transparent focus:border-saffron/30 focus:bg-white rounded-2xl outline-none transition-all text-earth font-medium"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-earth ml-1">Mobile Number</label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210"
                                className="w-full pl-12 pr-4 py-4 bg-peace/30 border-2 border-transparent focus:border-saffron/30 focus:bg-white rounded-2xl outline-none transition-all text-earth font-medium"
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-earth ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="name@example.com"
                            className="w-full pl-12 pr-4 py-4 bg-peace/30 border-2 border-transparent focus:border-saffron/30 focus:bg-white rounded-2xl outline-none transition-all text-earth font-medium"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-earth ml-1">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-4 bg-peace/30 border-2 border-transparent focus:border-saffron/30 focus:bg-white rounded-2xl outline-none transition-all text-earth font-medium"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-saffron transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 bg-saffron hover:bg-maroon text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-saffron/20 mt-4"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" size={24} />
                        ) : (
                          <>
                            <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                            <ArrowRight size={20} />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400 font-bold tracking-wider">Or continue with</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full py-4 bg-white border-2 border-gray-100 hover:border-saffron/30 hover:bg-peace/30 text-earth rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group shadow-sm"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                      <span>Google</span>
                    </button>

                    <div className="pt-6 text-center">
                      <p className="text-sm text-gray-500">
                        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button 
                          onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(null);
                          }}
                          className="text-saffron font-bold hover:underline"
                        >
                          {isSignUp ? "Login" : "Sign Up"}
                        </button>
                      </p>
                    </div>

                    <div className="pt-4 text-center">
                      <p className="text-xs text-gray-400">
                        By {isSignUp ? "signing up" : "signing in"}, you agree to our terms of service and privacy policy.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
