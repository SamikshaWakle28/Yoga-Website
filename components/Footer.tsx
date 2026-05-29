import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  Flower2 
} from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-earth text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center text-white">
                <Flower2 size={24} />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight">
                Buddhism<span className="text-saffron">Life</span>
              </span>
            </div>
            <p className="text-white/60 leading-relaxed mb-8">
              Experience peace of life through the ancient wisdom of Buddhism. Join our community and start your spiritual journey today.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-saffron transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8 text-gold">Site Links</h4>
            <ul className="space-y-4 text-white/60">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Programs & Classes", href: "/programs" },
                { name: "Academy", href: "/academy" },
                { name: "Specialists", href: "/team" },
                { name: "Contact", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="hover:text-saffron transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8 text-gold">Support</h4>
            <ul className="space-y-4 text-white/60">
              {["Help Center", "Community", "Login", "Privacy Policy", "Terms of Use"].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-saffron transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-8 text-gold">Information</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin className="text-saffron shrink-0" size={20} />
                <span className="text-white/60">123 Peace Avenue, <br />Spirit Valley, CA 94103</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-saffron shrink-0" size={20} />
                <span className="text-white/60">+1 (555) 123-4567</span>
              </li>
              <li className="flex gap-4">
                <Mail className="text-saffron shrink-0" size={20} />
                <span className="text-white/60">info@buddhismlife.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 text-center text-white/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Buddhism Life. All rights reserved. Designed with Peace.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
