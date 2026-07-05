import React, { useEffect, useState, useRef } from 'react';
import ShapeGrid from '@/components/ShapeGrid';
import DotField from '@/components/DotField';
import croppedImg from './assets/croped (1).png';
import dingSound from './assets/iphone_ding_2second.mp3';
import cvFile from './assets/akarsh.docx';
import { ChevronDown, MoreVertical, X, Github, Linkedin, Mail, Instagram } from 'lucide-react';
import GradientText from '@/components/GradientText';
import BorderGlow from '@/components/BorderGlow';
import projectsData from '@/data/projects.json';

const skills = [
  { name: 'HTML/CSS', icon: 'html5' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'Python', icon: 'python' },
  { name: 'Java', icon: 'java' },
  { name: 'C', icon: 'c' },
  { name: 'C++', icon: 'cplusplus' },
  { name: 'Django', icon: 'django' },
  { name: 'Flask', icon: 'flask' },
  { name: 'React', icon: 'react' },
  { name: 'React Native', icon: 'react' },
  { name: 'SQL', icon: 'mysql' },
  { name: 'SQLite', icon: 'sqlite' },
  { name: 'PostgreSQL', icon: 'postgresql' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'Tailwind CSS', icon: 'tailwindcss' }
];

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [typedFirst, setTypedFirst] = useState('');
  const [typedLast, setTypedLast] = useState('');
  const [gridOverflow, setGridOverflow] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (gridRef.current && gridContainerRef.current) {
        const overflow = Math.max(0, gridRef.current.scrollHeight - gridContainerRef.current.clientHeight);
        setGridOverflow(overflow);
      }
    };

    setTimeout(handleResize, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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

  // Automatic text typing on mount
  useEffect(() => {
    let typeInterval: ReturnType<typeof setInterval>;
    const targetFirst = "KARSH\u00A0";
    const targetLast = "ILEEP";

    const startTimeout = setTimeout(() => {
      let firstIndex = 0;
      let lastIndex = 0;

      typeInterval = setInterval(() => {
        if (firstIndex < targetFirst.length) {
          setTypedFirst(targetFirst.slice(0, firstIndex + 1));
          firstIndex++;
        } else if (lastIndex < targetLast.length) {
          setTypedLast(targetLast.slice(0, lastIndex + 1));
          lastIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100); // 100ms per letter typing speed
    }, 800);

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typeInterval);
    };
  }, []);

  // Phase 1: 0 to 500px (Image slides up, bubble types)
  const phase1Progress = Math.min(scrollY / 500, 1);

  // Phase 2: 500px to 1200px (Background & text wipe diagonally)
  const phase2Progress = Math.max(0, Math.min((scrollY - 500) / 700, 1));

  // Phase 3: 1200px to 2000px (Image slides left, Quote fades in at center)
  const phase3Progress = Math.max(0, Math.min((scrollY - 1200) / 800, 1));

  // Phase 4: 2000px to 2800px (Quote slides up, About text fades in)
  const phase4Progress = Math.max(0, Math.min((scrollY - 2000) / 800, 1));

  // Phase 5: 2800px to 3800px (Image & About text 3D move out, Projects slide in)
  const phase5Progress = Math.max(0, Math.min((scrollY - 2800) / 1000, 1));

  // Phase 5b: 3800px to 5800px (Scroll through all projects)
  const phase5bProgress = Math.max(0, Math.min((scrollY - 3800) / 2000, 1));

  // Phase 6: 5800px to 6800px (Projects move out, Contact slides in)
  const phase6Progress = Math.max(0, Math.min((scrollY - 5800) / 1000, 1));

  // Typing effect
  useEffect(() => {
    if (phase1Progress === 1) {
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
      if (phase1Progress < 0.9) {
        setHasPlayedSound(false);
      }
    }
  }, [phase1Progress, fullText, hasPlayedSound]);

  // Phase 1 Interactive animation values
  const imageOpacity = phase1Progress;
  const imageScale = 0.8 + (phase1Progress * 0.2);
  const imageTranslateY = 100 - (phase1Progress * 100); // 100vh to 0vh
  const indicatorOpacity = 1 - (phase1Progress * 2);

  // Phase 1 Background animation values
  const bgSquareSize = 40 - (phase1Progress * 20); // Starts at 40, drops to 20
  const bgSpeed = 0.4 - (phase1Progress * 0.2); // Starts at 0.4, drops to 0.2

  // Phase 2 Transformation values (Diagonal wipe right-to-left)
  const wipeX = -(phase2Progress * 200); // 0 to -200
  const wipeClipPath = `polygon(${wipeX}% 0%, ${wipeX + 200}% 0%, ${wipeX + 100}% 100%, ${wipeX - 100}% 100%)`;

  // Phase 3 & 4 Animation values (Slide image left, animate text)
  const imageTranslateX = -(phase3Progress * 25); // 0 to -25vw

  const quoteTop = 50 - (phase4Progress * 25); // Starts at 50% (center), moves up to 25%
  const aboutTop = 50 - (phase4Progress * 5); // Starts at 50%, moves slightly up to 45%

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitSuccess(true);
        form.reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert("Oops! There was a problem submitting your form.");
      }
    } catch (error) {
      alert("Oops! There was a problem submitting your form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-[1200vh]">
      {/* Success Popup */}
      <div
        className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] bg-black/80 backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl shadow-white/5 border border-white/20 transition-all duration-500 flex items-center gap-3 ${submitSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-medium tracking-wide">Message sent successfully!</span>
      </div>

      {/* Scroll Anchors for Navigation */}
      <div id="home" className="absolute top-0 left-0 w-full h-px pointer-events-none"></div>
      <div id="about" className="absolute top-[2200px] left-0 w-full h-px pointer-events-none"></div>
      <div id="projects" className="absolute top-[3800px] left-0 w-full h-px pointer-events-none"></div>
      <div id="contact" className="absolute top-[6600px] left-0 w-full h-px pointer-events-none"></div>

      {/* 0. DotField Background (Revealed after diagonal wipe) */}
      <div className="fixed inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            gradientFrom="rgba(0, 0, 0, 1)"
            gradientTo="rgba(235, 231, 238, 0.78)"
            glowColor="#0c0c0cff"
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-5 md:px-8 md:py-6 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="font-typewriter font-bold text-2xl tracking-tighter text-black z-50">AD</div>

        {/* Desktop Nav Links & Button */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="uppercase tracking-widest text-sm font-medium text-gray-500 transition-all duration-300 hover:text-gray-900 hover:drop-shadow-md">Home</a>
          <a href="#about" className="uppercase tracking-widest text-sm font-medium text-gray-500 transition-all duration-300 hover:text-gray-900 hover:drop-shadow-md">About</a>
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
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="uppercase tracking-widest text-2xl font-medium text-gray-800 hover:text-black">About</a>
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

      {/* 1. White Background Layer that wipes away diagonally */}
      <div
        className="fixed inset-0 z-10 bg-white pointer-events-none"
        style={{ clipPath: wipeClipPath }}
      >
        <div style={{ width: '100%', height: '1080px', position: 'relative' }}>
          <ShapeGrid
            speed={bgSpeed}
            squareSize={bgSquareSize}
            direction="up"
            borderColor="#999"
            hoverFillColor="#222"
            shape="square"
            hoverTrailAmount={2}
          />
        </div>
      </div>

      {/* Foreground Content - Sticky so it stays in viewport while scrolling */}
      <div className="sticky top-0 w-full h-screen z-20 flex items-end justify-center pointer-events-none overflow-hidden" style={{ perspective: '1500px' }}>

        {/* Center Heading (Wipes away with background) */}
        <div
          className="absolute inset-0 flex items-center justify-center -z-10 pb-32"
          style={{ clipPath: wipeClipPath }}
        >
          <GradientText
            colors={["#02000bff", "#464446ff", "#d5d1d8ff"]}
            animationSpeed={8}
            showBorder={false}
            className="text-6xl md:text-9xl font-extrabold tracking-wide font-stretch-extra-expande text-center font-typewriter drop-shadow-lg"
          >
            <div className="flex items-baseline justify-center w-full">
              <span>A</span>
              <span>{typedFirst}</span>
              <span>D</span>
              <span>{typedLast}</span>
            </div>
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

        {/* Skills Marquee (Behind Image, Below About) */}
        <div
          className="absolute bottom-2 md:bottom-6 left-0 w-full flex overflow-hidden pointer-events-auto transition-all duration-300 ease-out z-0"
          style={{
            opacity: Math.max(0, phase4Progress - (phase6Progress * 2)),
            transform: `translateY(${(1 - phase4Progress) * 50}px)`,
            visibility: phase4Progress > 0 && phase6Progress < 1 ? 'visible' : 'hidden'
          }}
        >
          <div className="flex w-max animate-marquee hover-pause gap-4 px-2 group">
            {[...skills, ...skills, ...skills, ...skills].map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white/90 font-medium hover:bg-white/10 hover:border-white/80 hover:text-white transition-all cursor-pointer whitespace-nowrap"
              >
                <img
                  src={`https://cdn.simpleicons.org/${skill.icon}/white`}
                  alt={skill.name}
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    // Fallback for missing icons
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="tracking-wider text-sm">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links (Replaces Marquee in Phase 6) */}
        <div
          className="absolute bottom-6 left-0 w-full flex justify-center items-center gap-4 pointer-events-auto transition-all duration-300 ease-out z-30"
          style={{
            opacity: phase6Progress,
            transform: `translateY(${(1 - phase6Progress) * 20}px)`,
            visibility: phase6Progress > 0 ? 'visible' : 'hidden'
          }}
        >
          <a href="https://www.linkedin.com/in/akarsh-dileep-5024b8252/" target="_blank" rel="noreferrer" className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all hover:scale-110 hover:border-white/50 backdrop-blur-md shadow-lg">
            <Linkedin size={20} />
          </a>
          <a href="https://github.com/AkarshDileep" target="_blank" rel="noreferrer" className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all hover:scale-110 hover:border-white/50 backdrop-blur-md shadow-lg">
            <Github size={20} />
          </a>
          <a href="mailto:akarshdileepofficial@gmail.com" className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all hover:scale-110 hover:border-white/50 backdrop-blur-md shadow-lg">
            <Mail size={20} />
          </a>
          <a href="https://www.instagram.com/akrshhhhh/" target="_blank" rel="noreferrer" className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all hover:scale-110 hover:border-white/50 backdrop-blur-md shadow-lg">
            <Instagram size={20} />
          </a>
        </div>

        <div
          className="relative md:w-5/6  sm:w-full md:h-5/6 pointer-events-none transition-all duration-75 ease-linear flex items-end justify-center"
          style={{
            opacity: imageOpacity * Math.max(0, 1 - phase5Progress * 1.5),
            transform: `translateY(${imageTranslateY}vh) translateX(${imageTranslateX}vw) scale(${imageScale}) translateZ(-${phase5Progress * 1000}px) rotateY(${phase5Progress * 25}deg)`
          }}
        >
          <img
            src={croppedImg}
            alt="Cropped focus"
            className="w-full h-full object-contain object-bottom drop-shadow-2xl pointer-events-none transition-transform duration-500 ease-out"
          />

          {/* Message Bubble */}
          <div
            className={`absolute right-4 top-[15%] md:right-[22%] md:top-[22%] bg-black/80 backdrop-blur-sm px-6 py-4 rounded-3xl rounded-bl-none shadow-2xl border border-gray-100 transition-all duration-500 ease-out pointer-events-auto ${phase1Progress === 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
          >
            {/* Tail */}
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-black/80 border-b border-l border-gray-100 transform -skew-x-12 rounded-bl-md"></div>

            <span className="uppercase tracking-widest text-sm font-medium text-white relative z-10 flex items-center">
              {displayedText}
              <span className={`w-1.5 h-4 bg-white ml-1 ${phase1Progress === 1 ? 'animate-pulse' : 'hidden'}`}></span>
            </span>
          </div>
        </div>

        {/* Phase 3 & 4 Content: Quote and About Me */}
        <div
          className="absolute right-0 md:right-[5%] top-0 h-screen w-full md:w-5/12 px-8 md:px-0 pointer-events-none transition-all duration-75 ease-linear"
          style={{
            visibility: phase3Progress > 0 ? 'visible' : 'hidden',
            opacity: Math.max(0, 1 - phase5Progress * 1.5),
            transform: `translateZ(-${phase5Progress * 600}px) rotateY(-${phase5Progress * 15}deg) translateX(${phase5Progress * 100}px)`
          }}
        >
          {/* Quote Block */}
          <div
            className="absolute w-full flex flex-col gap-6 transition-all duration-75 ease-linear"
            style={{
              top: `${quoteTop}%`,
              transform: 'translateY(-50%)',
              opacity: phase3Progress
            }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-typewriter text-gray-100 leading-tight drop-shadow-lg">
              "Architecting The Digital World"
            </h2>
            <div className="h-1 w-20 bg-gray-500 rounded-full"></div>
          </div>

          {/* About Block */}
          <div
            className="absolute w-full transition-all duration-75 ease-linear text-sm md:text-base text-gray-300 leading-relaxed font-medium"
            style={{
              top: `${aboutTop}%`,
              opacity: phase4Progress,
              visibility: phase4Progress > 0 ? 'visible' : 'hidden'
            }}
          >
            <p className="mb-4">
              Hello, I'm Akarsh Dileep, a professional web developer experience in creating beautiful, responsive, and functional websites. My passion for web development started when I was 16, and since then, I have honed my skills and kept up-to-date with the latest trends and technologies in the field. I specialize in creating custom websites that are tailored to the unique needs of each client. Whether you're looking for a simple website to showcase your business or a complex web application with multiple features, I can help you achieve your goals.
            </p>
            <p>
              My goal is to provide my clients with exceptional web development services that exceed their expectations. I am committed to delivering projects on time and within budget, and I pride myself on providing ongoing support and maintenance to ensure that my clients' websites continue to perform at their best. If you're looking for a professional, reliable, and expert web developer to create your dream website, look no further. I'm excited to work with you and bring your vision to life!
            </p>
          </div>
        </div>

        {/* Phase 5 Content: Projects Grid */}
        <div
          className="absolute top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-auto px-6 md:px-12 py-24 transition-all duration-75 ease-linear"
          style={{
            opacity: Math.max(0, phase5Progress * (1 - phase6Progress * 1.5)),
            transform: `translateZ(${(1 - phase5Progress) * 500 - (phase6Progress * 800)}px) translateY(${(1 - phase5Progress) * 100}px) rotateY(${phase6Progress * -15}deg)`,
            visibility: phase5Progress > 0 && phase6Progress < 1 ? 'visible' : 'hidden',
          }}
        >
          <div className="w-full max-w-7xl mx-auto h-full flex flex-col justify-center overflow-hidden">
            <h2 className="text-3xl md:text-5xl font-bold font-typewriter text-white mb-8 md:mb-12 text-center drop-shadow-lg tracking-wider uppercase shrink-0">
              Selected Works
            </h2>

            <div
              ref={gridContainerRef}
              className="w-full overflow-hidden flex-grow relative"
            >
              <div
                ref={gridRef}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-12 w-full transition-all duration-75 ease-linear"
                style={{
                  transform: `translateY(-${phase5bProgress * gridOverflow}px)`
                }}
              >
                {projectsData.map((project) => (
                  <div key={project.id} className="h-full">
                    <BorderGlow
                      edgeSensitivity={30}
                      glowColor="40 80 80"
                      backgroundColor="#120F17"
                      borderRadius={28}
                      glowRadius={40}
                      glowIntensity={1}
                      coneSpread={25}
                      animated={false}
                      colors={['#facf42ff', '#ded9dbff', 'rgba(248, 249, 249, 1)']}
                    >
                      <div className="flex flex-col h-full p-8 relative z-10 min-h-[300px]">
                        <h3 className="text-2xl font-bold text-white mb-3 font-typewriter tracking-wide">{project.name}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-8">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                          <a
                            href={project.viewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 transition-colors"
                          >
                            View Live
                          </a>
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-5 py-2.5 border border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-white/10 transition-colors"
                          >
                            GitHub
                          </a>
                        </div>
                      </div>
                    </BorderGlow>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 6 Content: Contact Form */}
        <div
          className="absolute top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-auto px-6 md:px-12 transition-all duration-75 ease-linear"
          style={{
            opacity: phase6Progress,
            transform: `translateZ(${(1 - phase6Progress) * 500}px) translateY(${(1 - phase6Progress) * 100}px)`,
            visibility: phase6Progress > 0 ? 'visible' : 'hidden',
          }}
        >
          <div className="w-full max-w-3xl mx-auto flex flex-col justify-center items-center">
            <h2 className="text-4xl md:text-5xl font-bold font-typewriter text-white mb-4 text-center drop-shadow-lg tracking-wider uppercase">
              Get In Touch
            </h2>
            <p className="text-gray-400 text-center mb-10 max-w-md mx-auto">
              Have a project in mind or just want to say hi? I'd love to hear from you.
            </p>

            <form
              action="https://formsubmit.co/akarshdileepofficial@gmail.com"
              method="POST"
              onSubmit={handleFormSubmit}
              className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col gap-6 relative overflow-hidden"
            >
              {/* FormSubmit Config */}
              <input type="hidden" name="_subject" value="New Contact Form Submission from Website!" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="box" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300 uppercase tracking-widest">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 focus:bg-black/60 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300 uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 focus:bg-black/60 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300 uppercase tracking-widest">Message</label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 focus:bg-black/60 transition-colors resize-none custom-scrollbar"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
