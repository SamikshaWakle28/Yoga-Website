import { motion } from "motion/react";
import { Heart, ArrowRight } from "lucide-react";

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

const AboutPage = () => {
  return (
    <div className="pt-20">
      <div className="bg-earth py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">About Us</h1>
        <p className="text-white/60 max-w-2xl mx-auto">Learn more about our mission, our history, and our dedication to the teachings of the Buddha.</p>
      </div>
      <About />
      
      {/* Additional About Content */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-earth mb-8 text-center">Our History</h2>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            Founded over three decades ago, our society began as a small gathering of practitioners dedicated to the study of the Pali Canon. Over the years, we have grown into a global community with centers in multiple countries, offering a wide range of programs and resources for spiritual growth.
          </p>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            Our mission has always been to provide a supportive environment for the study and practice of early Buddhism, emphasizing the importance of mindfulness, compassion, and wisdom in daily life.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div className="bg-peace p-8 rounded-2xl border border-gray-100">
              <h3 className="text-2xl font-serif font-bold text-earth mb-4">Our Vision</h3>
              <p className="text-gray-600">To create a world where mindfulness and compassion are at the heart of human interaction, leading to a more peaceful and harmonious society.</p>
            </div>
            <div className="bg-peace p-8 rounded-2xl border border-gray-100">
              <h3 className="text-2xl font-serif font-bold text-earth mb-4">Our Values</h3>
              <p className="text-gray-600">We are committed to the principles of non-violence, ethical conduct, and the pursuit of wisdom through direct experience and study.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
