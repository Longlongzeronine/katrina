import { RevealOnScroll } from "../RevealOnScroll";
import ColorBends from "../../ColorBends";
import myImage from "./sample-proj/1.png";
import homeData from "./Endpoint/home.json";

export const Home = ({ goToPage }) => {
  const { home } = homeData;

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative bg-slate-950 pt-10 overflow-hidden"
    >
      {/* ColorBends Shader Background */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff5c7a"]}
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
        <div className="flex flex-col md:flex-row items-center justify-center z-10 px-4 max-w-6xl mx-auto gap-8">

          {/* Profile image with card */}
          <div className="hidden md:block flex-shrink-0 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 shadow-2xl p-3">
            <img
              src={myImage}
              alt={home.name}
              className="w-80 md:w-96 lg:w-[420px] h-auto rounded-xl drop-shadow-[0_8px_32px_rgba(0,0,0,0.7)]"
            />
          </div>

          {/* Text content — frosted glass pill */}
          <div className="text-center z-10 px-6 py-8 sm:py-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 shadow-2xl max-w-lg mx-auto">
            <h1 className="text-3xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {home.title}
              <span className="bg-gradient-to-r from-[#0284c7] via-[#38bdf8] to-[#0ea5e9] bg-clip-text text-transparent">
                Katrina
              </span>
            </h1>

            <p className="text-gray-100 text-base sm:text-lg mb-8 leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {home.description}
            </p>

            {/* Know Me More Button */}
            <button
              onClick={() => goToPage("about")}
              className="border border-white/30 text-white py-3 px-6 rounded font-medium transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:border-[#0ea5e9] hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] cursor-pointer"
            >
              {home.buttons[1].text}
            </button>
          </div>

        </div>
      </RevealOnScroll>
    </section>
  );
};