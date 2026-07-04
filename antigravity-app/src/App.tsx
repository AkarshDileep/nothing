import React, { useEffect, useState, useRef } from 'react';
import ShapeGrid from '@/components/ShapeGrid';
import croppedImg from '../../croped (1).png';
import dingSound from '../../iphone_ding_2second.mp3';
import cvFile from '../../akarsh.docx';
import { ChevronDown, MoreVertical, X } from 'lucide-react';
import GradientText from '@/components/GradientText';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fullText = 'Hii there';

  useEffect(() => {
    audioRef.current = new Audio(dingSound);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const progress = Math.min(scrollY / 500, 1);

  // Typing effect
  useEffect(() => {
    if (progress === 1) {
      // Play notification sound once per reveal
      if (!hasPlayedSound) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.warn('Audio play failed, user must interact with page first.', e));
        }
        setHasPlayedSound(true);
      }

      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
        if (i >= fullText.length) clearInterval(interval);
      }, 150); // Typing speed
      return () => clearInterval(interval);
    } else {
      setDisplayedText('');
      // Reset the sound flag when scrolled back up
      if (progress < 0.9) {
        setHasPlayedSound(false);
      }
    }
  }, [progress, fullText, hasPlayedSound]);

  // Interactive animation values
  const imageOpacity = progress;
  const imageScale = 0.8 + (progress * 0.2);
  const imageTranslateY = 100 - (progress * 100); // 100vh to 0vh
  const indicatorOpacity = 1 - (progress * 2);

  return (
    <div className="relative w-full h-[200vh] bg-white">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-5 md:px-8 md:py-6 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="font-typewriter font-bold text-2xl tracking-tighter text-black z-50">AD</div>
        
        {/* Desktop Nav Links & Button */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="uppercase tracking-widest text-sm font-medium text-gray-500 transition-all duration-300 hover:text-gray-900 hover:drop-shadow-md">Home</a>
          <a href="#projects" className="uppercase tracking-widest text-sm font-medium text-gray-500 transition-all duration-300 hover:text-gray-900 hover:drop-shadow-md">Projects</a>
          <a href="#contact" className="uppercase tracking-widest text-sm font-medium text-gray-500 transition-all duration-300 hover:text-gray-900 hover:drop-shadow-md">Contact</a>
          
          <a 
            href={cvFile} 
            download="Akarsh_Dileep_CV.docx"
            className="uppercase tracking-widest text-sm font-medium bg-black text-white px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-gray-800 hover:shadow-lg ml-4 flex items-center justify-center"
          >
            Download CV
          </a>
        </div>

        {/* Mobile Menu Button (3 Dots) */}
        <button 
          className="md:hidden z-50 p-2 text-gray-800 transition-transform active:scale-90"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={28} /> : <MoreVertical size={28} />}
        </button>

        {/* Mobile Fullscreen Dropdown Menu */}
        <div 
          className={`absolute top-0 left-0 w-full h-screen bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-in-out z-40 md:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
        >
          <a href="#home" onClick={() => setIsMenuOpen(false)} className="uppercase tracking-widest text-2xl font-medium text-gray-800 hover:text-black">Home</a>
          <a href="#projects" onClick={() => setIsMenuOpen(false)} className="uppercase tracking-widest text-2xl font-medium text-gray-800 hover:text-black">Projects</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="uppercase tracking-widest text-2xl font-medium text-gray-800 hover:text-black">Contact</a>
          
          <a 
            href={cvFile} 
            download="Akarsh_Dileep_CV.docx"
            onClick={() => setIsMenuOpen(false)}
            className="uppercase tracking-widest text-lg font-medium bg-black text-white px-10 py-4 rounded-full mt-6 shadow-xl"
          >
            Download CV
          </a>
        </div>
      </nav>

      {/* Background Component Container - Fixed so it doesn't scroll away */}
      <div className="fixed inset-0 z-0">
        <div style={{ width: '100%', height: '1080px', position: 'relative' }}>
          <ShapeGrid
            speed={0.4}
            squareSize={40}
            direction="up"
            borderColor="#999"
            hoverFillColor="#222"
            shape="square"
            hoverTrailAmount={2}
          />
        </div>
      </div>

      {/* Foreground Content - Sticky so it stays in viewport while scrolling */}
      <div className="sticky top-0 w-full h-screen z-10 flex items-end justify-center pointer-events-none overflow-hidden">

        {/* Center Heading */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pb-32">
          <GradientText
            colors={["#02000bff", "#464446ff", "#d5d1d8ff"]}
            animationSpeed={8}
            showBorder={false}
            className="text-6xl md:text-9xl font-extrabold tracking-wide font-stretch-extra-expande text-center font-typewriter drop-shadow-lg"
          >
            AKARSH DILEEP
          </GradientText>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-10 flex flex-col items-center text-gray-500 gap-2 transition-opacity duration-300"
          style={{ opacity: Math.max(indicatorOpacity, 0) }}
        >
          <span className="uppercase tracking-widest text-sm font-medium">Scroll to Reveal</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>

        <div
          className="relative md:w-5/6  sm:w-full md:h-5/6 pointer-events-auto transition-all duration-75 ease-linear flex items-end justify-center"
          style={{
            opacity: imageOpacity,
            transform: `translateY(${imageTranslateY}vh) scale(${imageScale})`
          }}
        >
          <img
            src={croppedImg}
            alt="Cropped focus"
            className="w-full h-full object-contain object-bottom drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Message Bubble */}
          <div
            className={`absolute right-4 top-[15%] md:right-[22%] md:top-[22%] bg-black/80 backdrop-blur-sm px-6 py-4 rounded-3xl rounded-bl-none shadow-2xl border border-gray-100 transition-all duration-500 ease-out ${progress === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
          >
            {/* Tail */}
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-black/80 border-b border-l border-gray-100 transform -skew-x-12 rounded-bl-md"></div>

            <span className="uppercase tracking-widest text-sm font-medium text-white relative z-10 flex items-center">
              {displayedText}
              <span className={`w-1.5 h-4 bg-white ml-1 ${progress === 1 ? 'animate-pulse' : 'hidden'}`}></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
