import { RevealOnScroll } from "../RevealOnScroll";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import aboutData from "./Endpoint/about.json";
import ColorBends from "../../ColorBends";

export const About = () => {
  const { about } = aboutData;

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-start relative bg-slate-950 pt-10 overflow-hidden px-3 sm:px-6 md:pl-44"
    >
      {/* Animated Particles Background */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
          transparent={false}
          autoRotate={5}
        />
      </div>

      <RevealOnScroll>
        <div className="flex flex-col items-center md:items-start justify-between gap-10 w-full max-w-7xl z-10">

          {/* Content */}
          <div className="w-full md:w-4/4 mb-10 pt-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-white text-center md:text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {about.title}
            </h2>

            {/* Description Card */}
            <div className="rounded-xl p-4 sm:p-6 md:p-8 border border-white/20 bg-black/50 backdrop-blur-md hover:-translate-y-1 transition-all cursor-pointer">
              <p className="text-gray-100 text-justify text-sm sm:text-base leading-relaxed">
                {about.description}
              </p>
            </div>

            {/* Skills Cards Section */}
            <div className="mt-8">
              <div className="p-4 sm:p-6 rounded-xl border border-white/20 bg-black/50 backdrop-blur-md">
                <h3 className="text-lg sm:text-xl font-bold mb-6 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  💼 Professional Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {about.skillCards.map((card, index) => {
                    const Icon = FaIcons[card.icon] || SiIcons[card.icon];
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center text-center p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:-translate-y-1 transition-all cursor-pointer group"
                      >
                        {/* Icon Circle */}
                        <div className="w-14 h-14 rounded-full border-2 border-amber-400/60 bg-amber-400/10 flex items-center justify-center mb-3 group-hover:border-amber-300 group-hover:bg-amber-400/20 transition-all">
                          {Icon && (
                            <Icon className="text-amber-300 text-xl" />
                          )}
                        </div>

                        {/* Divider */}
                        <div className="w-12 h-px bg-amber-400/50 mb-3" />

                        {/* Title */}
                        <h4 className="text-white font-semibold text-sm sm:text-base mb-2 leading-snug">
                          {card.title}
                        </h4>

                        {/* Description */}
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      </RevealOnScroll>
    </section>
  );
};