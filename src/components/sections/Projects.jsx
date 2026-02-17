import { useState, useEffect, useCallback } from "react";
import { RevealOnScroll } from "../RevealOnScroll";
import myImage from './sample-proj/p-1.png';
import myImage1 from './sample-proj/p-2.png';
import myImage2 from './sample-proj/p-5.png';
import myImage3 from './sample-proj/p-4.png';
import myImage4 from './sample-proj/p-6.png';
import myImage5 from './sample-proj/p-7.png';
import myImage6 from './sample-proj/p-8.png';
import myImage7 from './sample-proj/p-9.png';
// ✅ Dynamically import only images that actually exist (p-11 to p-29)
const allGalleryImages = import.meta.glob('./sample-proj/p-*.png', { eager: true });
import Particles from "../../ColorBends";
import projectsData from './Endpoint/projects.json';


// ✅ Custom hook to extract colors from an image
const useImageColors = (imageSrc) => {
  const [colors, setColors] = useState({
    primary: '#6b7280',
    secondary: '#9ca3af',
    light: '#e5e7eb',
    dark: '#374151',
    badgeBg: '#e5e7eb',
    badgeText: '#374151'
  });

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const scaleFactor = 0.1;
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const colorCounts = {};
        for (let i = 0; i < pixels.length; i += 4) {
          const r = Math.round(pixels[i] / 32) * 32;
          const g = Math.round(pixels[i + 1] / 32) * 32;
          const b = Math.round(pixels[i + 2] / 32) * 32;
          const brightness = (r + g + b) / 3;
          if (brightness < 30 || brightness > 225) continue;
          const key = `${r},${g},${b}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }
        const sortedColors = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return { r, g, b };
          });
        if (sortedColors.length >= 2) {
          const primary = sortedColors[0];
          const secondary = sortedColors[1];
          const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
            const hex = Math.min(255, Math.max(0, x)).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('');
          const lighten = (color, factor) => rgbToHex(
            Math.round(color.r + (255 - color.r) * factor),
            Math.round(color.g + (255 - color.g) * factor),
            Math.round(color.b + (255 - color.b) * factor)
          );
          const darken = (color, factor) => rgbToHex(
            Math.round(color.r * (1 - factor)),
            Math.round(color.g * (1 - factor)),
            Math.round(color.b * (1 - factor))
          );
          setColors({
            primary: rgbToHex(primary.r, primary.g, primary.b),
            secondary: rgbToHex(secondary.r, secondary.g, secondary.b),
            light: lighten(primary, 0.7),
            dark: darken(primary, 0.4),
            badgeBg: lighten(primary, 0.75),
            badgeText: darken(primary, 0.5)
          });
        }
      } catch (error) {
        console.error('Error extracting colors:', error);
      }
    };
  }, [imageSrc]);

  return colors;
};

// ✅ Reusable Project Card Component — no technologies
const ProjectCard = ({ image, title, description, colors, gallery, onFullScreen, onGithubClick }) => {
  return (
    <div
      className="relative rounded-xl border shadow-lg hover:-translate-y-1 transition cursor-pointer overflow-hidden bg-black/50 backdrop-blur-md"
      style={{ borderColor: 'rgba(255,255,255,0.15)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${colors.primary}90`;
        e.currentTarget.style.boxShadow = `0 4px 24px ${colors.primary}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Latest Badge */}
      <span
        className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm z-10"
        style={{ backgroundColor: `${colors.primary}cc`, color: '#ffffff' }}
      >
        Latest
      </span>

      {/* Image count badge */}
      {gallery && gallery.length > 1 && (
        <span
          className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff', backdropFilter: 'blur(4px)' }}
        >
          🖼️ {gallery.length} photos
        </span>
      )}

      <div className="w-full h-48 overflow-hidden relative group" onClick={onFullScreen}>
        <img src={image} alt={title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-3 py-1 rounded-full">
            👁️ View Gallery
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{title}</h3>
        <p className="text-gray-200 mb-6 leading-relaxed">{description}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onFullScreen}
            className="flex items-center justify-center gap-2 w-55 py-2 rounded-md transition cursor-pointer"
            style={{ border: `1px solid ${colors.primary}`, color: colors.primary, backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.primary; }}
          >
            👁️ Full Screen
          </button>
          <button
            onClick={onGithubClick}
            className="flex items-center justify-center gap-2 w-55 py-2 rounded-md transition cursor-pointer"
            style={{ border: `1px solid rgba(255,255,255,0.35)`, color: 'rgba(255,255,255,0.85)', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
          >
            📁 GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Gallery Lightbox with Navigation
const ImageGallery = ({ images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const goToNext = useCallback(() => setCurrentIndex((prev) => (prev + 1) % images.length), [images.length]);
  const goToPrevious = useCallback(() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNext, goToPrevious, onClose]);

  const hasMultiple = images.length > 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button onClick={onClose} className="absolute top-5 right-5 text-white text-4xl font-bold z-50 hover:text-gray-300 cursor-pointer transition">&times;</button>
      {hasMultiple && (
        <button onClick={goToPrevious} className="absolute left-5 top-1/2 -translate-y-1/2 z-50 cursor-pointer transition-all duration-200 hover:scale-110 select-none flex items-center justify-center text-white text-4xl font-bold"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '52px', height: '52px' }}>‹</button>
      )}
      <div className="flex flex-col items-center justify-center max-w-6xl w-full px-24">
        <img key={currentIndex} src={images[currentIndex]} alt={`Screenshot ${currentIndex + 1}`} className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" style={{ animation: 'galleryFadeIn 0.25s ease' }} />
        <div className="mt-4 text-white text-sm font-semibold bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm">{currentIndex + 1} / {images.length}</div>
        {hasMultiple && (
          <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-2 px-2">
            {images.map((img, index) => (
              <img key={index} src={img} alt={`Thumbnail ${index + 1}`} onClick={() => setCurrentIndex(index)}
                className={`h-16 w-24 object-cover rounded cursor-pointer transition-all duration-200 border-2 flex-shrink-0 ${index === currentIndex ? 'border-blue-400 opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-70'}`} />
            ))}
          </div>
        )}
      </div>
      {hasMultiple && (
        <button onClick={goToNext} className="absolute right-5 top-1/2 -translate-y-1/2 z-50 cursor-pointer transition-all duration-200 hover:scale-110 select-none flex items-center justify-center text-white text-4xl font-bold"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '52px', height: '52px' }}>›</button>
      )}
      <style>{`@keyframes galleryFadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};

// ✅ Carousel Component for Project Gallery section
const ProjectGalleryCarousel = ({ images, onOpenLightbox }) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Show 3 images at a time (center + sides)
  const getVisible = () => {
    const indices = [];
    for (let i = -1; i <= 1; i++) {
      indices.push((current + i + total) % total);
    }
    return indices;
  };

  const visible = getVisible();

  return (
    <div className="relative w-full">
      {/* Main carousel display */}
      <div className="flex items-center justify-center gap-4 px-12">
        {visible.map((imgIndex, pos) => {
          const isCenter = pos === 1;
          return (
            <div
              key={imgIndex}
              onClick={() => isCenter ? onOpenLightbox(imgIndex) : setCurrent(imgIndex)}
              className="cursor-pointer rounded-xl overflow-hidden border"
              style={{
                width: isCenter ? '55%' : '22%',
                opacity: isCenter ? 1 : 0.45,
                transform: isCenter ? 'scale(1)' : 'scale(0.88)',
                borderColor: isCenter ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
                boxShadow: isCenter ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
                flexShrink: 0,
                overflow: 'hidden',
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
            >
              <img
                src={images[imgIndex]}
                alt={`Gallery ${imgIndex + 1}`}
                className="w-full h-64 object-contain bg-black"
              />
              {isCenter && (
                <div className="bg-black/60 px-4 py-2 text-center">
                  <span className="text-white/70 text-xs">Click to view fullscreen</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-white text-3xl font-bold transition-all duration-200 hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '44px', height: '44px' }}
      >‹</button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-white text-3xl font-bold transition-all duration-200 hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '44px', height: '44px' }}
      >›</button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              backgroundColor: i === current ? '#a78bfa' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="text-center mt-3">
        <span className="text-white/50 text-sm">{current + 1} / {total}</span>
      </div>
    </div>
  );
};

export const Projects = () => {
  const [galleryImages, setGalleryImages] = useState(null);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  // Colors for Featured Projects (4 cards)
  const colors0 = useImageColors(myImage);
  const colors1 = useImageColors(myImage3);
  const colors2 = useImageColors(myImage1);
  const colors3 = useImageColors(myImage2);

  // Colors for Work Values Inventory (2 cards)
  const colorsWV0 = useImageColors(myImage2);
  const colorsWV1 = useImageColors(myImage6);

  useEffect(() => {
    const socialNavbar = document.getElementById('social-navbar');
    if (galleryImages) {
      if (socialNavbar) { socialNavbar.style.opacity = '0'; socialNavbar.style.visibility = 'hidden'; socialNavbar.style.pointerEvents = 'none'; }
      document.body.style.overflow = 'hidden';
    } else {
      if (socialNavbar) { socialNavbar.style.opacity = '1'; socialNavbar.style.visibility = 'visible'; socialNavbar.style.pointerEvents = 'auto'; }
      document.body.style.overflow = '';
    }
    return () => {
      if (socialNavbar) { socialNavbar.style.opacity = '1'; socialNavbar.style.visibility = 'visible'; socialNavbar.style.pointerEvents = 'auto'; }
      document.body.style.overflow = '';
    };
  }, [galleryImages]);

  const handleGithubClick = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const imageMap = {
    './sample-proj/p-1.png': myImage,
    './sample-proj/p-2.png': myImage1,
    './sample-proj/p-4.png': myImage3,
    './sample-proj/p-5.png': myImage2,
    './sample-proj/p-6.png': myImage4,
    './sample-proj/p-7.png': myImage5,
    './sample-proj/p-8.png': myImage6,
    './sample-proj/p-9.png': myImage7,
  };

  const colorMap = [colors0, colors1, colors2, colors3];
  const projects = projectsData.projects.map((project, index) => ({
    ...project,
    image: imageMap[project.image],
    colors: colorMap[index],
    gallery: project.gallery.map(img => imageMap[img])
  }));

  const workValuesColorMap = [colorsWV0, colorsWV1];
  const workValues = projectsData.workValues.map((project, index) => ({
    ...project,
    image: imageMap[project.image],
    colors: workValuesColorMap[index],
    gallery: project.gallery.map(img => imageMap[img])
  }));

  // Build carousel images from glob — only files that actually exist
  const carouselImages = projectsData.projectGallery
    .map(path => {
      const key = path; // e.g. "./sample-proj/p-11.png"
      return allGalleryImages[key]?.default ?? null;
    })
    .filter(Boolean);

  const openCarouselLightbox = (startIndex) => {
    setGalleryStartIndex(startIndex);
    setGalleryImages(carouselImages);
  };

  return (
    <section id="projects" className="relative min-h-screen flex items-center justify-center py-20 bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Particles
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0} speed={0.2} scale={1} frequency={1}
          warpStrength={1} mouseInfluence={1} parallax={0.5}
          noise={0.1} transparent={false} autoRotate={5}
        />
      </div>

      {showAlert && (
        <div className="fixed top-5 right-5 bg-yellow-300 text-yellow-900 font-semibold px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          📁 Coming Soon!
        </div>
      )}

      <RevealOnScroll>
        <div className="max-w-5xl mx-auto px-4 pt-10 relative z-10">

          {/* Featured Projects */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Featured{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Projects & </span>
              Certificates
              
            </h1>
            <p className="text-xl text-gray-100 max-w-5xl mx-auto pt-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              A collection of projects that showcase my skills and passion for development.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {projects.map((project, index) => (
              <ProjectCard key={index} image={project.image} title={project.title} description={project.description}
                colors={project.colors} gallery={project.gallery}
                onFullScreen={() => setGalleryImages(project.gallery)}
                onGithubClick={handleGithubClick} />
            ))}
          </div>

          {/* Work Values Inventory */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Work Values{" "}
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">Inventory</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-5xl mx-auto pt-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              A showcase of work and projects aligned with my professional values and growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {workValues.map((project, index) => (
              <ProjectCard key={index} image={project.image} title={project.title} description={project.description}
                colors={project.colors} gallery={project.gallery}
                onFullScreen={() => setGalleryImages(project.gallery)}
                onGithubClick={handleGithubClick} />
            ))}
          </div>

          {/* Project Gallery Carousel */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Project{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Gallery</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-5xl mx-auto pt-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              A visual collection of all the work I've done throughout my journey.
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/50 backdrop-blur-md p-6">
            <ProjectGalleryCarousel images={carouselImages} onOpenLightbox={openCarouselLightbox} />
          </div>

        </div>
      </RevealOnScroll>

      {galleryImages && (
        <ImageGallery images={galleryImages} onClose={() => setGalleryImages(null)} />
      )}

      <style>{`
        @keyframes slide-in { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.3s ease forwards; }
      `}</style>
    </section>
  );
};