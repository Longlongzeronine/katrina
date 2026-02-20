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
import myImage8 from './sample-proj/p-10.png';
import myImage9 from './sample-proj/p-11.png';
import myImage10 from './sample-proj/p-12.png';
import myImage11 from './sample-proj/p-13.png';
import myImage12 from './sample-proj/p-14.png';
import myImage13 from './sample-proj/p-15.png';
import myImage14 from './sample-proj/p-16.png';
import myImage15 from './sample-proj/p-17.png';
import myImage16 from './sample-proj/p-20.png';
import myImage17 from './sample-proj/p-21.png';
import myImage18 from './sample-proj/p-22.png';
import myImage19 from './sample-proj/p-23.png';
import myImage20 from './sample-proj/p-24.png';
import myImage21 from './sample-proj/p-25.png';
import myImage22 from './sample-proj/p-27.png';
import myImage23 from './sample-proj/p-30.png';

// ✅ Dynamically import only images that actually exist
const allGalleryImages = import.meta.glob('./sample-proj/p-*.png', { eager: true });
import Particles from "../../ColorBends";
import projectsData from './Endpoint/projects.json';

// ✅ Complete imageMap — covers ALL images used anywhere
const imageMap = {
  './sample-proj/p-1.png': myImage,
  './sample-proj/p-2.png': myImage1,
  './sample-proj/p-4.png': myImage3,
  './sample-proj/p-5.png': myImage2,
  './sample-proj/p-6.png': myImage4,
  './sample-proj/p-7.png': myImage5,
  './sample-proj/p-8.png': myImage6,
  './sample-proj/p-9.png': myImage7,
  './sample-proj/p-10.png': myImage8,
  './sample-proj/p-11.png': myImage9,
  './sample-proj/p-12.png': myImage10,
  './sample-proj/p-13.png': myImage11,
  './sample-proj/p-14.png': myImage12,
  './sample-proj/p-15.png': myImage13,
  './sample-proj/p-16.png': myImage14,
  './sample-proj/p-17.png': myImage15,
  './sample-proj/p-20.png': myImage16,
  './sample-proj/p-21.png': myImage17,
  './sample-proj/p-22.png': myImage18,
  './sample-proj/p-23.png': myImage19,
  './sample-proj/p-24.png': myImage20,
  './sample-proj/p-25.png': myImage21,
  './sample-proj/p-27.png': myImage22,
  './sample-proj/p-30.png': myImage23,
};

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
    if (!imageSrc) return;
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
            secondary: rgbToHex(sortedColors[1].r, sortedColors[1].g, sortedColors[1].b),
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

// ✅ Gallery Lightbox with Navigation
const ImageGallery = ({ images, startIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
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
    <div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button onClick={onClose} className="absolute top-5 right-5 text-white text-4xl font-bold z-50 hover:text-gray-300 cursor-pointer transition">&times;</button>
      {hasMultiple && (
        <button onClick={goToPrevious}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-50 cursor-pointer transition-all duration-200 hover:scale-110 select-none flex items-center justify-center text-white text-4xl font-bold"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '52px', height: '52px' }}>‹</button>
      )}
      <div className="flex flex-col items-center justify-center max-w-6xl w-full px-24">
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Screenshot ${currentIndex + 1}`}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
          style={{ animation: 'galleryFadeIn 0.25s ease' }}
        />
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
        <button onClick={goToNext}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-50 cursor-pointer transition-all duration-200 hover:scale-110 select-none flex items-center justify-center text-white text-4xl font-bold"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '52px', height: '52px' }}>›</button>
      )}
      <style>{`@keyframes galleryFadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
};

// ✅ Carousel Card — handles portrait & landscape with object-contain
const CarouselCard = ({ title, description, gallery, colors, onOpenLightbox, onGithubClick }) => {
  const [current, setCurrent] = useState(0);
  const total = gallery.length;
  const prev = (e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + total) % total); };
  const next = (e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % total); };

  return (
    <div
      className="relative rounded-2xl border overflow-hidden bg-black/50 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor: 'rgba(255,255,255,0.15)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${colors.primary}90`;
        e.currentTarget.style.boxShadow = `0 8px 32px ${colors.primary}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Image Carousel Area */}
      <div className="relative w-full bg-black" style={{ height: '320px' }}>
        <img
          key={current}
          src={gallery[current]}
          alt={`${title} ${current + 1}`}
          className="w-full h-full object-contain cursor-pointer"
          style={{ animation: 'cardFadeIn 0.2s ease' }}
          onClick={() => onOpenLightbox(current)}
        />
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={() => onOpenLightbox(current)}
        >
          <span className="text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
            👁️ View Fullscreen
          </span>
        </div>
        {total > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-white text-2xl font-bold transition-all hover:scale-110 z-10 cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '38px', height: '38px' }}>‹</button>
            <button onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-white text-2xl font-bold transition-all hover:scale-110 z-10 cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '38px', height: '38px' }}>›</button>
          </>
        )}
        {total > 1 && (
          <span
            className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full z-10 flex items-center gap-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff', backdropFilter: 'blur(4px)' }}
          >
            🖼️ {current + 1} / {total}
          </span>
        )}
        <span
          className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full z-10"
          style={{ backgroundColor: `${colors.primary}cc`, color: '#fff' }}
        >
          Latest
        </span>
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === current ? '20px' : '7px',
                  height: '7px',
                  backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-5">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={() => onOpenLightbox(current)}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{ border: `1px solid ${colors.primary}`, color: colors.primary, backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.primary; }}
          >
            👁️ Full Screen
          </button>
          <button
            onClick={onGithubClick}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
          >
            📁 GitHub
          </button>
        </div>
      </div>
      <style>{`@keyframes cardFadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

// ✅ Carousel Component for Project Gallery section
const ProjectGalleryCarousel = ({ images, onOpenLightbox }) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const getVisible = () => {
    const indices = [];
    for (let i = -1; i <= 1; i++) indices.push((current + i + total) % total);
    return indices;
  };

  const visible = getVisible();

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-center gap-4 px-12">
        {visible.map((imgIndex, pos) => {
          const isCenter = pos === 1;
          return (
            <div
              key={imgIndex}
              onClick={() => isCenter ? onOpenLightbox(imgIndex) : setCurrent(imgIndex)}
              className="cursor-pointer rounded-xl overflow-hidden border bg-black"
              style={{
                width: isCenter ? '55%' : '22%',
                opacity: isCenter ? 1 : 0.45,
                transform: isCenter ? 'scale(1)' : 'scale(0.88)',
                borderColor: isCenter ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.08)',
                boxShadow: isCenter ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
                flexShrink: 0,
                transition: 'opacity 0.15s ease, transform 0.15s ease',
              }}
            >
              <img
                src={images[imgIndex]}
                alt={`Gallery ${imgIndex + 1}`}
                className="w-full object-contain bg-black"
                style={{ height: '280px' }}
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
      <button onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-white text-3xl font-bold transition-all duration-200 hover:scale-110 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '44px', height: '44px' }}>‹</button>
      <button onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center text-white text-3xl font-bold transition-all duration-200 hover:scale-110 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', borderRadius: '50%', width: '44px', height: '44px' }}>›</button>
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className="rounded-full transition-all duration-300 cursor-pointer"
            style={{ width: i === current ? '24px' : '8px', height: '8px', backgroundColor: i === current ? '#a78bfa' : 'rgba(255,255,255,0.25)' }} />
        ))}
      </div>
      <div className="text-center mt-3">
        <span className="text-white/50 text-sm">{current + 1} / {total}</span>
      </div>
    </div>
  );
};

export const Projects = () => {
  const [lightboxImages, setLightboxImages] = useState(null);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const colors0 = useImageColors(myImage);
  const colors1 = useImageColors(myImage3);
  const colors2 = useImageColors(myImage1);
  const colors3 = useImageColors(myImage23);
  const colorsWV0 = useImageColors(myImage2);
  const colorsOS0 = useImageColors(myImage5); // Color for Offered Services

  useEffect(() => {
    const socialNavbar = document.getElementById('social-navbar');
    if (lightboxImages) {
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
  }, [lightboxImages]);

  const handleGithubClick = () => {
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const openLightbox = (images, startIndex = 0) => {
    setLightboxImages(images);
    setLightboxStartIndex(startIndex);
  };

  // colorMap index matches projects array index (0-based)
  const colorMap = [colors0, colors1, colors2, colors3];

  const projects = projectsData.projects.map((project, index) => ({
    ...project,
    image: imageMap[project.image],
    colors: colorMap[index],
    gallery: project.gallery.map(img => imageMap[img] ?? allGalleryImages[img]?.default ?? null).filter(Boolean),
  }));

  const workValues = projectsData.workValues.map((project) => ({
    ...project,
    image: imageMap[project.image],
    colors: colorsWV0,
    gallery: project.gallery.map(img => imageMap[img] ?? allGalleryImages[img]?.default ?? null).filter(Boolean),
  }));

  // ✅ New: Offered Services data mapping
  const offeredServices = projectsData.offeredServices.map((project) => ({
    ...project,
    image: imageMap[project.image],
    colors: colorsOS0,
    gallery: project.gallery.map(img => imageMap[img] ?? allGalleryImages[img]?.default ?? null).filter(Boolean),
  }));

  const carouselImages = projectsData.projectGallery
    .map(path => imageMap[path] ?? allGalleryImages[path]?.default ?? null)
    .filter(Boolean);

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
              <CarouselCard
                key={index}
                title={project.title}
                description={project.description}
                gallery={project.gallery}
                colors={project.colors}
                onOpenLightbox={(startIndex) => openLightbox(project.gallery, startIndex)}
                onGithubClick={handleGithubClick}
              />
            ))}
          </div>

          {/* ✅ NEW: Offered Services Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Offered{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-5xl mx-auto pt-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Professional services I offer for various projects and clients.
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/50 backdrop-blur-md p-6 mb-24">
            <ProjectGalleryCarousel
              images={offeredServices[0]?.gallery ?? []}
              onOpenLightbox={(startIndex) => openLightbox(offeredServices[0]?.gallery ?? [], startIndex)}
            />
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
          <div className="rounded-xl border border-white/15 bg-black/50 backdrop-blur-md p-6 mb-24">
            <ProjectGalleryCarousel
              images={workValues[0]?.gallery ?? []}
              onOpenLightbox={(startIndex) => openLightbox(workValues[0]?.gallery ?? [], startIndex)}
            />
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
            <ProjectGalleryCarousel
              images={carouselImages}
              onOpenLightbox={(startIndex) => openLightbox(carouselImages, startIndex)}
            />
          </div>

        </div>
      </RevealOnScroll>

      {lightboxImages && (
        <ImageGallery
          images={lightboxImages}
          startIndex={lightboxStartIndex}
          onClose={() => { setLightboxImages(null); setLightboxStartIndex(0); }}
        />
      )}

      <style>{`
        @keyframes slide-in { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        .animate-slide-in { animation: slide-in 0.3s ease forwards; }
      `}</style>
    </section>
  );
};