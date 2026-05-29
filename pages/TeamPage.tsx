import { motion } from "motion/react";

const Team = () => {
  const team = [
    { name: "Ven. Bodhi", role: "Chief Monk", img: "https://images.unsplash.com/photo-1590059393160-5807908b9845?q=80&w=2070&auto=format&fit=crop" },
    { name: "Dr. Ananda", role: "Philosophy Head", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
    { name: "Sister Metta", role: "Meditation Guide", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop" },
    { name: "Ven. Kassapa", role: "Sutra Specialist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop" }
  ];

  return (
    <section id="team" className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-saffron font-bold uppercase tracking-widest text-sm mb-4 block">Our Guides</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-earth mb-4">Specialists Team</h2>
          <div className="w-24 h-1 bg-saffron mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center group"
            >
              <div className="relative mb-6 rounded-3xl overflow-hidden aspect-[4/5]">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-saffron/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-xl font-bold text-earth mb-1">{member.name}</h4>
              <p className="text-saffron font-medium">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamPage = () => {
  return (
    <div className="pt-20">
      <div className="bg-earth py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Our Specialists</h1>
        <p className="text-white/60 max-w-2xl mx-auto">Meet our dedicated team of monks, scholars, and meditation guides who are here to support your journey.</p>
      </div>
      <Team />
      
      {/* Additional Team Content */}
      <section className="py-24 bg-peace px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-earth mb-8">Join Our Community</h2>
          <p className="text-gray-700 text-lg mb-10 leading-relaxed">
            We are always looking for dedicated volunteers and practitioners to join our community and help spread the message of peace and mindfulness. If you are interested in contributing your skills, please get in touch.
          </p>
          <button className="bg-saffron text-white px-10 py-4 rounded-full font-bold hover:bg-maroon transition-all shadow-lg">
            Volunteer With Us
          </button>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
