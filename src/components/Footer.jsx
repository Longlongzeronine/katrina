// components/Footer.jsx
import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full py-6 bg-slate-950 text-center text-sm text-white">
      <p>&copy; {new Date().getFullYear()} Francis on Web.</p>
    </footer>
  );
};
