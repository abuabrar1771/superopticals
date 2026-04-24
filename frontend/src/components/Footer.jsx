import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaRegCopyright,
} from "react-icons/fa";
import {
  LiaCertificateSolid,
  LiaGlassesSolid,
  LiaUserCheckSolid,
  LiaExchangeAltSolid,
  LiaUndoAltSolid,
  LiaHeadsetSolid,
} from "react-icons/lia";

const Footer = () => {
  const qaItems = [
    { icon: <LiaCertificateSolid size={32} />, title: "Certified Quality", desc: "International standard lens tech." },
    { icon: <LiaGlassesSolid size={32} />, title: "100% Accuracy", desc: "Digitally verified prescriptions." },
    { icon: <LiaUserCheckSolid size={32} />, title: "Expert Inspection", desc: "Hand-checked by opticians." },
    { icon: <LiaExchangeAltSolid size={32} />, title: "Easy Exchange", desc: "Hassle-free replacements." },
    { icon: <LiaUndoAltSolid size={32} />, title: "7 Days Return", desc: "No questions asked policy." },
    { icon: <LiaHeadsetSolid size={32} />, title: "Best Support", desc: "24/7 optical assistance." },
  ];

  return (
    <footer className="w-full mt-10 mb-5">
      {/* >>>>>>>>>>>>>>> Quality Assurance Section <<<<<<<<<<<<<<<<<<<<<< */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-10 bg-black rounded-3xl text-gray-400">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-4 text-center">
          {qaItems.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center px-2 ${
                index !== qaItems.length - 1 ? "lg:border-r border-gray-800" : ""
              }`}
            >
              <div className="mb-4 text-cyan-500 transition-colors duration-300 hover:text-white">
                {item.icon}
              </div>
              <h4 className="text-white font-bold uppercase tracking-wider text-[11px] sm:text-[12px]">
                {item.title}
              </h4>
              <p className="text-[10px] mt-2 leading-relaxed max-w-[140px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* >>>>>>>>>>>>>>> Main Footer Section <<<<<<<<<<<<<<<<<<<<<< */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 py-10 border border-blue-400 shadow-lg rounded-3xl bg-blue-500 mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-black font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-blue-50">
              <li><Link to="/About" className="hover:text-black transition">About Us</Link></li>
              <li><Link to="/Careers" className="hover:text-black transition">Career</Link></li>
              <li><Link to="/Blog" className="hover:text-black transition">Blog</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-black font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-blue-50">
              <li><Link to="/HelpCenter" className="hover:text-black transition">Help Center</Link></li>
              <li><Link to="/Returns" className="hover:text-black transition">Returns</Link></li>
              <li><Link to="/Warranty" className="hover:text-black transition">Warranty</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-black font-bold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-blue-50">
              <li><Link to="/Men" className="hover:text-black transition">Men</Link></li>
              <li><Link to="/Women" className="hover:text-black transition">Women</Link></li>
              <li><Link to="/Kids" className="hover:text-black transition">Kids</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-black font-bold mb-4">Policies</h3>
            <ul className="space-y-2 text-sm text-blue-50">
              <li><Link to="/PrivacyPolicy" className="hover:text-black transition">Privacy Policy</Link></li>
              <li><Link to="/TermsCondition" className="hover:text-black transition">Terms & Conditions</Link></li>
              <li><Link to="/RefundPolicy" className="hover:text-black transition">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="text-black font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-blue-50">
              <li className="flex items-center gap-2"><FaPhoneAlt size={12}/> +91 98765 43210</li>
              <li className="flex items-center gap-2 truncate"><FaEnvelope size={12}/> info@superoptical.com</li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt size={12}/> Salem, TN</li>
            </ul>
          </div>

          {/* Column 6: Socials */}
          <div>
            <h3 className="text-black font-bold mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <FaInstagram />, href: "https://instagram.com" },
                { icon: <FaFacebookF />, href: "https://facebook.com" },
                { icon: <FaTwitter />, href: "https://twitter.com" },
                { icon: <FaYoutube />, href: "https://youtube.com" },
                { icon: <FaWhatsapp />, href: "https://wa.me/919894031949" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="relative w-10 h-10 flex items-center justify-center rounded-full text-xl text-blue-900 border border-blue-400/40 bg-blue-400/10 transition-all duration-300 hover:text-white hover:-translate-y-1 hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Logo & Copyright */}
        <div className="flex flex-col sm:flex-row gap-6 mt-12 pt-6 border-t border-blue-400/30 items-center justify-between">
          <img src={assets.super_footer} alt="Logo" className="w-40 lg:w-48" />
          <p className="text-xs sm:text-sm text-blue-100 flex items-center gap-1">
            <FaRegCopyright /> 2026 Super Opticals. All Rights Reserved.
          </p>
        </div>
      </section>
    </footer>
  );
};

export default Footer;