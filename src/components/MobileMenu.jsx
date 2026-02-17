import { useEffect } from "react";

export const MobileMenu = ({ menuOpen, setMenuOpen, goToPage, currentPage }) => {
  // Close menu when navigating
  const handleNavigation = (page) => {
    goToPage(page);
    setMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-[rgba(10,10,10,0.95)] backdrop-blur-sm flex flex-col items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${
                    menuOpen
                      ? "h-screen opacity-100 z-50 pointer-events-auto"
                      : "h-0 opacity-0 z-[-1] pointer-events-none"
                  }
                `}
    >
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-6 right-6 text-white text-4xl focus:outline-none cursor-pointer hover:rotate-90 transition-transform duration-300"
        aria-label="Close Menu"
      >
        &times;
      </button>

      <nav className="flex flex-col items-center">
        <button
          onClick={() => handleNavigation("home")}
          className={`text-2xl font-semibold my-4 transform transition-all duration-300 bg-transparent border-none cursor-pointer
                      hover:scale-110
                      ${
                        menuOpen
                          ? "opacity-100 translate-y-0 delay-[100ms]"
                          : "opacity-0 translate-y-5"
                      }
                      ${currentPage === "home" ? "text-blue-400" : "text-white hover:text-blue-300"}
                    `}
        >
          Home
        </button>
        <button
          onClick={() => handleNavigation("about")}
          className={`text-2xl font-semibold my-4 transform transition-all duration-300 bg-transparent border-none cursor-pointer
                      hover:scale-110
                      ${
                        menuOpen 
                          ? "opacity-100 translate-y-0 delay-[200ms]" 
                          : "opacity-0 translate-y-5"
                      }
                      ${currentPage === "about" ? "text-blue-400" : "text-white hover:text-blue-300"}
                    `}
        >
          About
        </button>
        <button
          onClick={() => handleNavigation("projects")}
          className={`text-2xl font-semibold my-4 transform transition-all duration-300 bg-transparent border-none cursor-pointer
                      hover:scale-110
                      ${
                        menuOpen 
                          ? "opacity-100 translate-y-0 delay-[300ms]" 
                          : "opacity-0 translate-y-5"
                      }
                      ${currentPage === "projects" ? "text-blue-400" : "text-white hover:text-blue-300"}
                    `}
        >
          Projects
        </button>
        <button
          onClick={() => handleNavigation("contact")}
          className={`text-2xl font-semibold my-4 transform transition-all duration-300 bg-transparent border-none cursor-pointer
                      hover:scale-110
                      ${
                        menuOpen 
                          ? "opacity-100 translate-y-0 delay-[400ms]" 
                          : "opacity-0 translate-y-5"
                      }
                      ${currentPage === "contact" ? "text-blue-400" : "text-white hover:text-blue-300"}
                    `}
        >
          Contact
        </button>
      </nav>
    </div>
  );
};