import { useEffect } from "react";

const NAV_LINKS = [
  { href: "home", label: "Home" },
  { href: "about", label: "About" },
  { href: "projects", label: "Projects" },
  { href: "contact", label: "Contact" },
];

export const Navbar = ({ menuOpen, setMenuOpen, goToPage, currentPage }) => {
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <nav className="fixed top-6 left-0 w-full z-50 flex justify-center px-4">
      <div 
        style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        className="flex items-center justify-between md:justify-center bg-white/95 backdrop-blur-sm px-6 py-3 shadow-md border border-gray-200 rounded-xl"
      >
        
        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-10 text-base font-medium">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <button
                onClick={() => goToPage(href)}
                className={`relative transition-colors duration-300 ${
                  currentPage === href
                    ? "text-[#0ea5e9] font-bold"
                    : "text-gray-600 hover:text-[#0ea5e9]"
                }`}
              >
                {label}
                {currentPage === href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0ea5e9] rounded-full" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="w-6 h-5 flex flex-col justify-between z-50 md:hidden focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span 
            className={`h-0.5 w-full bg-black rounded transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`} 
          />
          <span 
            className={`h-0.5 w-full bg-black rounded transition-all duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`} 
          />
          <span 
            className={`h-0.5 w-full bg-black rounded transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2.5" : ""
            }`} 
          />
        </button>
      </div>
    </nav>
  );
};