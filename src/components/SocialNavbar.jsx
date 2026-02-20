import React from "react";
import {
  FaEnvelope,
  FaCakeCandles,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import profileImage from "../assets/profile.png";
import socialData from "./Endpoint/social.json";

export const SocialNavbar = () => {
  const { social } = socialData;

  const contactIconMap = {
    FaEnvelope,
    FaCakeCandles,
    FaLocationDot,
    FaPhone,
  };

  const socialIconMap = {
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaGithub,
    FaLinkedin,
  };

  return (
    <div
      id="social-navbar"
      className="hidden 3xl:block fixed top-1/2 right-8 -translate-y-1/2 z-50 w-80
      bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-6 backdrop-blur-sm"
    >
      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-1 flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0284c7] to-[#38bdf8] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          <div className="relative w-full h-full bg-slate-900 rounded-3xl p-3 flex items-center justify-center">
            <img
              src={profileImage}
              alt={social.profile.alt}
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Name and Title */}
      <div className="text-center mb-6">
        <h2 className="text-white text-2xl font-bold mb-2 bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent">
          {social.profile.name}
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          {social.profile.title}
        </p>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6"></div>

      {/* Contact Info */}
      <div className="space-y-4 mb-6">
        {social.contactInfo.map((contact, index) => {
          const Icon = contactIconMap[contact.icon];
          return (
            <div key={index} className="flex items-start gap-4 group cursor-pointer">
              <div className={`w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 ${contact.hoverBorder} transition-all duration-300`}>
                <Icon className={`${contact.iconColor} text-lg group-hover:scale-110 transition-transform duration-300`} />
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase mb-1 font-semibold">
                  {contact.label}
                </p>
                <p className="text-slate-200 text-sm break-all">
                  {contact.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6"></div>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-3">
        {social.socialLinks.map((link, index) => {
          const Icon = socialIconMap[link.icon];
          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center
              border border-slate-800 hover:border-[#0ea5e9] transition-all duration-300
              hover:shadow-lg hover:shadow-[#0ea5e9]/20 hover:-translate-y-1 group"
            >
              <Icon className="text-slate-400 text-lg group-hover:text-[#38bdf8] group-hover:scale-110 transition-all duration-300" />
            </a>
          );
        })}
      </div>

      <div className="mt-6 h-1 bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0ea5e9] rounded-full"></div>
    </div>
  );
};