import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ContactPage = () => {
  return (
    <div className="pt-20">
      <div className="bg-earth py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Contact Us</h1>
        <p className="text-white/60 max-w-2xl mx-auto">Have questions or want to get involved? We'd love to hear from you. Reach out to us using the form below or through our contact details.</p>
      </div>

      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-earth mb-8">Get in Touch</h2>
            <p className="text-gray-600 text-lg mb-12 leading-relaxed">
              Our community is here to support you on your spiritual journey. Whether you have questions about our programs, want to volunteer, or just want to say hello, we're always happy to connect.
            </p>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center text-saffron shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-earth mb-1">Our Location</h4>
                  <p className="text-gray-600">123 Peace Avenue, Spirit Valley, CA 94103</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center text-saffron shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-earth mb-1">Phone Number</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center text-saffron shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-earth mb-1">Email Address</h4>
                  <p className="text-gray-600">info@buddhismlife.org</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center text-saffron shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-earth mb-1">Opening Hours</h4>
                  <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Sat - Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-peace p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100">
            <h3 className="text-2xl font-serif font-bold text-earth mb-6">Send Us a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-earth ml-1">First Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John"
                    className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-earth ml-1">Last Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Doe"
                    className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-earth ml-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-earth ml-1">Subject</label>
                <input 
                  required
                  type="text" 
                  placeholder="How can we help?"
                  className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-earth ml-1">Message</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Your message here..."
                  className="w-full px-5 py-3 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all resize-none"
                ></textarea>
              </div>

              <button className="w-full py-4 bg-saffron hover:bg-maroon text-white rounded-full font-bold shadow-xl transition-all">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="h-[500px] relative overflow-hidden bg-peace">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.871867167664!2d-117.8931166234375!3d33.99583337317676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c3294336c55555%3A0x7d9f9c9c9c9c9c9c!2sHsi%20Lai%20Temple!5e0!3m2!1sen!2sus!4v1712380000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Buddhism Life Center Location"
          className="grayscale hover:grayscale-0 transition-all duration-700"
        ></iframe>
        
        {/* Overlay Info Card */}
        <div className="absolute bottom-10 left-10 hidden md:block">
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-xs">
            <h4 className="font-serif font-bold text-earth text-xl mb-2">Visit Our Center</h4>
            <p className="text-gray-600 text-sm mb-4">Our doors are open to everyone seeking peace and mindfulness. Join us for daily meditation.</p>
            <div className="flex items-center gap-2 text-saffron font-bold text-sm">
              <MapPin size={16} />
              <span>Get Directions</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
