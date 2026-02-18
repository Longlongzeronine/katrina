import { useEffect } from "react";
import ColorBends from "../ColorBends"; // adjust path as needed

export const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-6 bg-slate-950">

      {/* ── Particles background ── */}
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

      {/* ── Content sits above particles ── */}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        {/* Hello World typing animation */}
        <h1 className="text-2xl md:text-4xl font-mono font-bold text-white typewriter">
          {"<MyPortfolio!>"}
        </h1>

        {/* Typing indicator */}
        <div className="typing-indicator">
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          <div className="typing-circle"></div>
          <div className="typing-shadow"></div>
          <div className="typing-shadow"></div>
          <div className="typing-shadow"></div>
        </div>
      </div>

      {/* CSS styles */}
      <style jsx>{`
        .typewriter {
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid white;
          width: 0;
          animation: typing 2s steps(20, end) forwards, blink 0.75s step-end infinite;
        }

        @keyframes typing {
          from { width: 0; }
          to   { width: 14ch; }
        }

        @keyframes blink {
          50% { border-color: transparent; }
        }

        .typing-indicator {
          width: 60px;
          height: 30px;
          position: relative;
          z-index: 4;
        }

        .typing-circle {
          width: 8px;
          height: 8px;
          position: absolute;
          border-radius: 50%;
          background-color: #fff;
          left: 15%;
          transform-origin: 50%;
          animation: typing-circle 0.5s alternate infinite ease;
        }

        .typing-circle:nth-child(2) {
          left: 45%;
          animation-delay: 0.2s;
        }

        .typing-circle:nth-child(3) {
          left: auto;
          right: 15%;
          animation-delay: 0.3s;
        }

        @keyframes typing-circle {
          0% {
            top: 20px;
            height: 5px;
            border-radius: 50px 50px 25px 25px;
            transform: scaleX(1.7);
          }
          40% {
            height: 8px;
            border-radius: 50%;
            transform: scaleX(1);
          }
          100% {
            top: 0%;
          }
        }

        .typing-shadow {
          width: 5px;
          height: 4px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          position: absolute;
          top: 30px;
          transform-origin: 50%;
          z-index: 3;
          left: 15%;
          filter: blur(1px);
          animation: typing-shadow 0.5s alternate infinite ease;
        }

        .typing-shadow:nth-child(4) {
          left: 45%;
          animation-delay: 0.2s;
        }

        .typing-shadow:nth-child(5) {
          left: auto;
          right: 15%;
          animation-delay: 0.3s;
        }

        @keyframes typing-shadow {
          0%   { transform: scaleX(1.5); }
          40%  { transform: scaleX(1); opacity: 0.7; }
          100% { transform: scaleX(0.2); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};