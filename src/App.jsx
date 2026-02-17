import React, { useState } from "react";
import "./App.css";
import { LoadingScreen } from "./components/LoadingScreen";
import { Navbar } from "./components/Navbar";
import { MobileMenu } from "./components/MobileMenu";
import { Home } from "./components/sections/Home";
import { About } from "./components/sections/About";
import { Projects } from "./components/sections/Projects";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/Footer";
import { SocialNavbar } from "./components/SocialNavbar";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPage = (pageName) => {
    const pageNames = ["home", "projects", "about", "contact"];
    const pageIndex = pageNames.indexOf(pageName);
    if (pageIndex !== -1) {
      setCurrentPage(pageIndex);
      setMenuOpen(false);
    }
  };

  const pageNames = ["home", "projects", "about", "contact"];

  // ✅ Render component based on currentPage
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 0:
        return <Home goToPage={goToPage} />;
      case 1:
        return <Projects />;
      case 2:
        return <About />;
      case 3:
        return <Contact />;
      default:
        return <Home goToPage={goToPage} />;
    }
  };

  return (
    <>
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      <div
        className={`flex flex-col w-full h-screen transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } bg-black text-gray-100 overflow-hidden`}
      >
        <Navbar 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
          goToPage={goToPage}
          currentPage={pageNames[currentPage]}
        />
        <MobileMenu 
          menuOpen={menuOpen} 
          setMenuOpen={setMenuOpen} 
          goToPage={goToPage}
          currentPage={pageNames[currentPage]}
        />

        <main className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden">
          <div className="w-full min-h-full">
            {renderCurrentPage()}
          </div>
        </main>

        <SocialNavbar />

        {currentPage === pageNames.length - 1 && <Footer />}
      </div>
    </>
  );
}

export default App;