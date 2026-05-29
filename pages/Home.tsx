import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Heart, 
  Sun, 
  Wind, 
  BookOpen, 
  Users, 
  Flower2 
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

// --- Sub-components (could be further extracted if needed) ---

const Hero = () => {
  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDygGqEieT_CSj7tY-pYdnlECx7lGHiiyqVw&s" 
          alt="Buddhist Temple" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-saffron font-semibold tracking-[0.2em] uppercase mb-4 text-sm md:text-base">
            Welcome to Buddhism Life
          </span>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Seeking a Deeper <br />
            <span className="text-gold italic">Understanding</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the profound wisdom of early Buddhism and find inner peace through our guided programs and community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/about" className="w-full sm:w-auto bg-saffron hover:bg-maroon text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:scale-105 text-center">
              Explore More
            </Link>
            <Link to="/contact" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold text-lg transition-all text-center">
              Join Community
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[80px] fill-peace">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-peace px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop" 
              alt="Buddha Statue" 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-saffron/20 rounded-full blur-3xl -z-0" />
          <div className="absolute -top-8 -left-8 w-64 h-64 bg-gold/10 rounded-full blur-3xl -z-0" />
          
          <div className="absolute bottom-6 left-6 bg-white p-6 rounded-xl shadow-xl max-w-[240px] hidden lg:block">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-saffron/10 rounded-full flex items-center justify-center text-saffron">
                <Heart size={20} />
              </div>
              <span className="font-bold text-earth">Our Mission</span>
            </div>
            <p className="text-sm text-gray-600">Spreading peace, compassion, and mindfulness across the globe.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-saffron font-bold uppercase tracking-widest text-sm mb-4 block">About Our Society</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-earth mb-8 leading-tight">
            The Buddhist Society Focuses on <span className="text-saffron">Early Buddhism</span>
          </h2>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            We are dedicated to the study and practice of the original teachings of the Buddha. Our society provides a sanctuary for those seeking spiritual growth, mental clarity, and a compassionate community.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {[
              { title: "Meditation", desc: "Guided sessions for all levels." },
              { title: "Wisdom", desc: "Ancient teachings for modern life." },
              { title: "Community", desc: "A supportive path for everyone." },
              { title: "Peace", desc: "Finding stillness in a busy world." }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1">
                  <div className="w-5 h-5 rounded-full bg-saffron flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-earth">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="group flex items-center gap-3 text-earth font-bold text-lg hover:text-saffron transition-colors">
            Learn More About Us <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Sun className="text-saffron" size={32} />,
      title: "Spiritual Growth",
      desc: "Nurture your soul with our specialized spiritual development programs."
    },
    {
      icon: <Wind className="text-saffron" size={32} />,
      title: "Mindfulness",
      desc: "Learn techniques to stay present and engaged in every moment of your life."
    },
    {
      icon: <BookOpen className="text-saffron" size={32} />,
      title: "Ancient Wisdom",
      desc: "Access a vast library of sutras and teachings from the early Buddhist era."
    },
    {
      icon: <Users className="text-saffron" size={32} />,
      title: "Global Sangha",
      desc: "Connect with practitioners from around the world in our digital community."
    }
  ];

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-earth mb-4">Our Core Focus</h2>
          <div className="w-24 h-1 bg-saffron mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-peace border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform inline-block">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-earth mb-4">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  return (
    <section className="py-24 bg-saffron px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-maroon/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="text-white font-bold uppercase tracking-widest text-sm mb-4 block">Stay Connected</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">
          Subscribe to Our Newsletter for <br />
          <span className="text-gold italic">Daily Wisdom</span>
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
          Receive weekly updates on upcoming events, meditation sessions, and spiritual teachings directly in your inbox.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your Email Address" 
            className="flex-1 px-6 py-4 rounded-full bg-white text-earth focus:outline-none focus:ring-2 focus:ring-gold shadow-xl"
            required
          />
          <button className="bg-earth text-white px-8 py-4 rounded-full font-bold hover:bg-maroon transition-all shadow-xl whitespace-nowrap">
            Subscribe Now
          </button>
        </form>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Features />
      <Newsletter />
    </>
  );
};

export default Home;
