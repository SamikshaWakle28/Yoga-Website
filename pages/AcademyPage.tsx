import { Flower2 } from "lucide-react";

const Academy = () => {
  return (
    <section id="academy" className="py-24 bg-peace px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-12 lg:p-20">
          <span className="text-saffron font-bold uppercase tracking-widest text-sm mb-4 block">Education</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-earth mb-8 leading-tight">
            Best Buddhism <br />
            <span className="text-saffron italic">Academy</span>
          </h2>
          <p className="text-gray-700 text-lg mb-10 leading-relaxed">
            Our academy offers structured courses on Buddhist philosophy, meditation techniques, and Pali language studies. Whether you are a beginner or an advanced practitioner, we have a path for you.
          </p>
          
          <div className="space-y-6 mb-12">
            {[
              "Certified Meditation Instructors",
              "Comprehensive Pali Library",
              "Interactive Online Workshops",
              "Spiritual Guidance Mentorship"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-saffron/10 flex items-center justify-center text-saffron">
                  <Flower2 size={14} />
                </div>
                <span className="font-medium text-earth">{item}</span>
              </div>
            ))}
          </div>

          <button className="bg-earth text-white px-10 py-4 rounded-full font-bold hover:bg-saffron transition-all shadow-lg">
            Enroll Today
          </button>
        </div>
        <div className="lg:w-1/2 relative min-h-[400px]">
          <img 
            src="https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2070&auto=format&fit=crop" 
            alt="Academy" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block" />
        </div>
      </div>
    </section>
  );
};

const AcademyPage = () => {
  return (
    <div className="pt-20">
      <div className="bg-earth py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Buddhism Academy</h1>
        <p className="text-white/60 max-w-2xl mx-auto">Deepen your knowledge through our structured educational programs and workshops.</p>
      </div>
      <Academy />
      
      {/* Additional Academy Content */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Philosophy",
                desc: "Explore the core tenets of Buddhist thought and its application to modern life.",
                img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop"
              },
              {
                title: "Meditation",
                desc: "Master various meditation techniques from Samatha to Vipassana.",
                img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop"
              },
              {
                title: "Pali Studies",
                desc: "Learn the original language of the Buddha to read the sutras in their original form.",
                img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=2050&auto=format&fit=crop"
              }
            ].map((course, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={course.img} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-earth mb-4">{course.title}</h3>
                <p className="text-gray-600 mb-6">{course.desc}</p>
                <button className="text-saffron font-bold hover:text-maroon transition-colors">View Curriculum →</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcademyPage;
