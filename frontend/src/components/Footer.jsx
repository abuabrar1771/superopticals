import React from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
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
import Title from "./Title";

const Footer = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 border border-blue-400 shadow-lg rounded-3xl bg-blue-500 ">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mt-3">
        {/* Column 1 */}

        <div>
          <h3 className="text-block font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/About" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/Careers" className="hover:text-white transition">
                Career
              </Link>
            </li>
            <li>
              <Link to="/Blog" className="hover:text-white transition">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-block font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm ">
            <li>
              <Link to="/HelpCenter" className="hover:text-white transition">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/Returns" className="hover:text-white transition">
                Returns
              </Link>
            </li>
            <li>
              <Link to="/Warranty" className="hover:text-white transition">
                Warranty
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-block font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/Men" className="hover:text-white transition">
                Men
              </Link>
            </li>
            <li>
              <Link to="/Women" className="hover:text-white transition">
                Women
              </Link>
            </li>
            <li>
              <Link to="/Kids" className="hover:text-white transition">
                Kids
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-block font-semibold mb-4">Policies</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/PrivacyPolicy"
                className="hover:text-white transition"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/TermsCondition"
                className="hover:text-white transition"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/RefundPolicy"
                className="hover:text-white transition"
              >
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
        {/* 5 */}
        <div>
          <h3 className="text-block font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope /> info@superoptical.com
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt /> Salem, TN
            </li>
          </ul>
        </div>

        {/* 6 */}
        <div>
          <h3 className="text-block font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="
                      relative
    w-[50px] h-[50px]
    flex items-center justify-center
    rounded-full
    text-[28px]
    text-blue-900
    border border-blue-400/40
    cursor-pointer
    transition-all duration-300 ease-in-out
    hover:text-white
    hover:-translate-y-1
    hover:scale-105
    hover:shadow-[0_0_10px_rgba(96,165,250,0.7),0_0_25px_rgba(96,165,250,0.7),0_0_40px_rgba(96,165,250,0.7)]
    before:content-['']
    before:absolute
    before:inset-[-6px]
    before:rounded-full
    before:bg-blue-800
    before:blur-xl
    before:opacity-0
    before:transition
    hover:before:opacity-100
    before:-z-10
    "
            >
              <FaInstagram />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="
                      relative
    w-[50px] h-[50px]
    flex items-center justify-center
    rounded-full
    text-[28px]
    text-blue-900
    border border-blue-400/40
    cursor-pointer
    transition-all duration-300 ease-in-out
    hover:text-white
    hover:-translate-y-1
    hover:scale-105
    hover:shadow-[0_0_10px_rgba(96,165,250,0.7),0_0_25px_rgba(96,165,250,0.7),0_0_40px_rgba(96,165,250,0.7)]
    before:content-['']
    before:absolute
    before:inset-[-6px]
    before:rounded-full
    before:bg-blue-800
    before:blur-xl
    before:opacity-0
    before:transition
    hover:before:opacity-100
    before:-z-10
    "
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="
                     relative
    w-[50px] h-[50px]
    flex items-center justify-center
    rounded-full
    text-[28px]
    text-blue-900
    border border-blue-400/40
    cursor-pointer
    transition-all duration-300 ease-in-out
    hover:text-white
    hover:-translate-y-1
    hover:scale-105
    hover:shadow-[0_0_10px_rgba(96,165,250,0.7),0_0_25px_rgba(96,165,250,0.7),0_0_40px_rgba(96,165,250,0.7)]
    before:content-['']
    before:absolute
    before:inset-[-6px]
    before:rounded-full
    before:bg-blue-800
    before:blur-xl
    before:opacity-0
    before:transition
    hover:before:opacity-100
    before:-z-10"
            >
              <FaTwitter />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="
                     relative
    w-[50px] h-[50px]
    flex items-center justify-center
    rounded-full
    text-[28px]
    text-blue-900
    border border-blue-900/40
    cursor-pointer
    transition-all duration-300 ease-in-out
    hover:text-white
    hover:-translate-y-1
    hover:scale-105
    hover:shadow-[0_0_10px_rgba(96,165,250,0.7),0_0_25px_rgba(96,165,250,0.7),0_0_40px_rgba(96,165,250,0.7)]
    before:content-['']
    before:absolute
    before:inset-[-6px]
    before:rounded-full
    before:bg-blue-800
    before:blur-xl
    before:opacity-0
    before:transition
    hover:before:opacity-100
    before:-z-10"
            >
              <FaYoutube />
            </a>

            <a
              href="https://wa.me/919894031949"
              target="_blank"
              rel="noreferrer"
              className="
                     relative
    w-[50px] h-[50px]
    flex items-center justify-center
    rounded-full
    text-[28px]
    text-blue-900
    border border-blue-400/40
    cursor-pointer
    transition-all duration-300 ease-in-out
    hover:text-white
    hover:-translate-y-1
    hover:scale-105
    hover:shadow-[0_0_10px_rgba(96,165,250,0.7),0_0_25px_rgba(96,165,250,0.7),0_0_40px_rgba(96,165,250,0.7)]
    before:content-['']
    before:absolute
    before:inset-[-6px]
    before:rounded-full
    before:bg-blue-800
    before:blur-xl
    before:opacity-0
    before:transition
    hover:before:opacity-100
    before:-z-10"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 mt-8 justify-between">
        <img
          src={assets.super_footer}
          alt=""
          className="w-40 sm:w-52 lg:w-60"
        />
        <p className="text-sm text-gray-200 flex items-center justify-center gap-1 mt-10">
          <FaRegCopyright />
          2026 Super Opticals. All Rights Reserved.
        </p>
      </div>
    </section>
  );
};

export default Footer;
