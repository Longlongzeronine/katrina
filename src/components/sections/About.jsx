import { RevealOnScroll } from "../RevealOnScroll";
import Particles from "../../Particles";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import aboutData from "./Endpoint/about.json";
import ColorBends from "../../ColorBends";

export const About = () => {
  const { about } = aboutData;

  const renderIcon = (icon, color) => {
    const Icon = FaIcons[icon] || SiIcons[icon];
    return <Icon className={`${color} text-lg sm:text-2xl`} />;
  };

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
          <div className="w-full md:w-3/4 mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-white text-center md:text-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {about.title}
            </h2>

            <div className="rounded-xl p-4 sm:p-6 md:p-8 border border-white/20 bg-black/50 backdrop-blur-md hover:-translate-y-1 transition-all cursor-pointer">
              <p className="text-gray-100 mb-6 text-justify text-sm sm:text-base leading-relaxed">
                {about.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Frontend Skills */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{about.sections.frontend}</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {about.frontendSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-white/20 bg-black/40 rounded-lg hover:bg-black/60 hover:scale-105 transition cursor-pointer"
                      >
                        {renderIcon(skill.icon, skill.color)}
                        <span className="text-white text-xs sm:text-sm md:text-base break-words font-medium">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend Skills */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{about.sections.backend}</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {about.backendSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-white/20 bg-black/40 rounded-lg hover:bg-black/60 hover:scale-105 transition cursor-pointer"
                      >
                        {renderIcon(skill.icon, skill.color)}
                        <span className="text-white text-xs sm:text-sm md:text-base break-words font-medium">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="mt-8">
              <div className="p-4 sm:p-6 rounded-xl border border-white/20 bg-black/50 backdrop-blur-md hover:-translate-y-1 transition-all cursor-pointer">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{about.sections.education}</h3>
                <ul className="list-disc list-inside text-gray-100 space-y-3 text-xs sm:text-sm md:text-base">
                  {about.education.map((edu, index) => (
                    <li key={index} className="break-words leading-relaxed">
                      <strong className="text-white">{edu.title}</strong> – {edu.school}{" "}
                      {edu.year && `(${edu.year})`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </RevealOnScroll>
    </section>
  );
};