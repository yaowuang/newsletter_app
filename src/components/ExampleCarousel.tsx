'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const examples = [
  {
    src: '/examples/default.png',
    alt: 'Default newsletter template with clean layout',
    title: 'Classic Template'
  },
  {
    src: '/examples/mission_galaxy.png',
    alt: 'Space-themed newsletter with galaxy background',
    title: 'Mission Galaxy'
  },
  {
    src: '/examples/patriotic.png',
    alt: 'Patriotic theme with American flag elements',
    title: 'Patriotic Theme'
  },
  {
    src: '/examples/retro3d.png',
    alt: 'Retro 3D styled newsletter template',
    title: 'Retro 3D'
  },
  {
    src: '/examples/valentines.png',
    alt: 'Valentine\'s Day themed newsletter with hearts',
    title: 'Valentine\'s Day'
  }
];

export default function ExampleCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examples.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 8 seconds
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  return (
    <div className="relative group">
      {/* Frame & glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-fuchsia-500/20 blur-xl opacity-40 group-hover:opacity-55 transition" aria-hidden />
      
      <div className="relative rounded-3xl ring-1 ring-white/12 bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-800/40 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Carousel container */}
        <div className="relative w-full aspect-[21/9] md:aspect-[18/7] lg:aspect-[16/6] overflow-hidden">
          {/* Images */}
          <div 
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {examples.map((example, index) => (
              <div key={example.src} className="flex-shrink-0 w-full h-full relative">
                <Image
                  src={example.src}
                  alt={example.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 1280px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-blue-500/10 via-transparent to-fuchsia-500/10 transition" />
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-white/20 flex items-center justify-center text-white hover:bg-slate-800/90 transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            aria-label="Previous example"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/80 border border-white/20 flex items-center justify-center text-white hover:bg-slate-800/90 transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            aria-label="Next example"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 text-white rounded-xl border border-white/15 shadow-lg px-4 py-2">
            <h3 className="text-sm font-medium">{examples[currentIndex].title}</h3>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {examples.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white shadow-sm' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to example ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Callouts repositioned for carousel */}
      <div className="hidden md:block absolute -top-6 left-6 bg-slate-900/95 text-slate-100 rounded-xl border border-white/15 shadow-lg px-4 py-3 text-[11px] max-w-[200px] -rotate-2">
        Browse example newsletters & themes.
      </div>
      <div className="hidden md:block absolute -bottom-6 right-8 bg-slate-900/95 text-slate-100 rounded-xl border border-white/15 shadow-lg px-4 py-3 text-[11px] max-w-[210px] rotate-2">
        Click any template to get started.
      </div>
    </div>
  );
}
