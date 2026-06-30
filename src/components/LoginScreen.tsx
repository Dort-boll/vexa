import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Cpu, Activity, ChevronRight, Lock, Sparkles, Brain } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [sliderX, setSliderX] = useState(0);

  const slides = [
    {
      title: "Welcome to VEXA",
      subtitle: "AI Engineering Operating System",
      description: "Diagnose, improve, secure, and optimize complex AI systems with elite engineering analysis. VEXA isn't a chatbot — it's an AI Doctor built for modern developers.",
      icon: <Activity className="w-16 h-16 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />,
      tag: "VAYU AGI ENGINE"
    },
    {
      title: "Detect Vulnerabilities & Hallucinations",
      subtitle: "Interactive Diagnostic Pipeline",
      description: "VEXA's pipeline checks code leaks, API security bounds, hallucination entropy, and prompt injection vulnerabilities, outputting actionable plans in real-time.",
      icon: <Shield className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />,
      tag: "SECURITY & LOGIC AUDITING"
    },
    {
      title: "Isolated Local Engine",
      subtitle: "Powered by Vayu Secure Sync",
      description: "Runs entirely inside the browser using secure local sessions. Scalable edge deployment with zero backend servers required. Built with full data privacy guarantees.",
      icon: <Cpu className="w-16 h-16 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />,
      tag: "VAYU SECURE STORAGE"
    }
  ];

  // Auto-advance slides with premium timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handlePuterSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const { PuterService } = await import('../lib/puterService');
      const user = await PuterService.signIn();
      if (user) {
        onLoginSuccess(user);
      }
    } catch (e) {
      console.error('Sign in failed:', e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSandboxSignIn = async () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      localStorage.setItem('vexa_sandbox_signed_in', 'true');
      const user = {
        username: 'vayu_architect',
        email: 'guest@vayu.agi',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
        isSandbox: true
      };
      localStorage.setItem('vexa_sandbox_user', JSON.stringify(user));
      onLoginSuccess(user);
      setIsLoggingIn(false);
    }, 800);
  };

  return (
    <div id="login-container" className="relative min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden">
      
      {/* 1. Perspective 3D Grid Illusion Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
          transform: 'perspective(400px) rotateX(65deg) translateY(-80px) scale(2.2)',
          transformOrigin: 'top center',
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 85%)'
        }}
      ></div>

      {/* 2. Concentric Orbiting Moiré Illusion Rings (SVG Spirograph) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-25 select-none">
        <div className="absolute w-[200vw] h-[200vw] bg-[radial-gradient(ellipse_at_center,transparent_40%,#000_90%)] z-10"></div>
        <svg className="w-[1100px] h-[1100px] animate-[spin_180s_linear_infinite]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" stroke="rgba(99, 102, 241, 0.12)" strokeWidth="0.08" fill="none" strokeDasharray="1 1" />
          <circle cx="50" cy="50" r="44" stroke="rgba(168, 85, 247, 0.14)" strokeWidth="0.12" fill="none" strokeDasharray="3 1" className="animate-[spin_60s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
          <circle cx="50" cy="50" r="39" stroke="rgba(34, 211, 238, 0.14)" strokeWidth="0.15" fill="none" strokeDasharray="2 2" className="animate-[spin_45s_linear_infinite]" style={{ transformOrigin: 'center' }} />
          <circle cx="50" cy="50" r="33" stroke="rgba(99, 102, 241, 0.18)" strokeWidth="0.2" fill="none" strokeDasharray="5 3" className="animate-[spin_30s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
          <circle cx="50" cy="50" r="27" stroke="rgba(168, 85, 247, 0.18)" strokeWidth="0.25" fill="none" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: 'center' }} />
          <circle cx="50" cy="50" r="21" stroke="rgba(34, 211, 238, 0.22)" strokeWidth="0.3" fill="none" strokeDasharray="8 4" className="animate-[spin_12s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }} />
          
          {/* Radial Rays creating optical angle lines */}
          {Array.from({ length: 32 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 48 * Math.cos((i * 11.25 * Math.PI) / 180)}
              y2={50 + 48 * Math.sin((i * 11.25 * Math.PI) / 180)}
              stroke="rgba(99, 102, 241, 0.05)"
              strokeWidth="0.04"
            />
          ))}
        </svg>
      </div>

      {/* 3. Dynamic Soft Light Glow Emitters */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/10 to-purple-500/0 rounded-full filter blur-[160px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 to-indigo-500/0 rounded-full filter blur-[160px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_2s]"></div>

      {/* Sticky Blurglass Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-black/45 border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-6 py-4 md:py-5 flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl blur-sm opacity-55"></div>
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-wider text-white">VEXA</span>
              <span className="text-[10px] block font-mono text-indigo-400 tracking-widest leading-none uppercase">BY VAYU AGI</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-white/[0.03] backdrop-blur-md px-4 py-2 rounded-full border border-white/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-slate-300">Vayu Core: Active</span>
          </div>
        </div>
      </header>

      {/* Main Content (Swipe & Sliders) */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full px-6 z-10 py-12">
        <div className="relative w-full overflow-hidden flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center flex flex-col items-center select-none"
            >
              {/* Premium Rotating Frame Illusion around Slide Icon */}
              <div className="mb-8 relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative p-7 bg-white/[0.02] border border-white/[0.08] rounded-3xl backdrop-blur-md shadow-2xl flex items-center justify-center w-28 h-28">
                  {/* Subtle rotating helper frame */}
                  <div className="absolute inset-2 border border-dashed border-indigo-500/30 rounded-2xl animate-[spin_40s_linear_infinite]"></div>
                  {slides[currentSlide].icon}
                </div>
              </div>

              <span className="font-mono text-[10px] text-indigo-300 tracking-widest uppercase mb-4 font-bold px-3 py-1 bg-white/[0.03] rounded-full border border-white/[0.06]">
                {slides[currentSlide].tag}
              </span>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 max-w-2xl leading-tight bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </h1>
              
              <p className="font-sans text-base sm:text-lg text-indigo-200/80 mb-5 max-w-xl font-medium">
                {slides[currentSlide].subtitle}
              </p>

              <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-2xl mb-8 leading-relaxed">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Slide Dots / Quick-jump */}
          <div className="flex gap-2.5 mb-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                id={`slide-dot-${idx}`}
                onClick={() => setCurrentSlide(idx)}
                className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_12px_rgba(99,102,241,0.7)]' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Swipe-to-Login Controller */}
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          
          {/* Elite Swipe-to-Unlock Component */}
          <div className="w-full">
            <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase block text-center mb-3.5">
              Secure Gateway Authentication
            </span>
            
            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-full p-1.5 h-16 w-full flex items-center justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-lg">
              
              {/* Shimmer Track Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-12 text-center">
                <span className="text-xs font-mono font-medium tracking-wide bg-gradient-to-r from-indigo-400 via-slate-200 to-indigo-400 bg-clip-text text-transparent animate-pulse whitespace-nowrap">
                  {isLoggingIn ? "Initializing secure context..." : "Slide handle right to login"}
                </span>
              </div>

              {/* Slider Progress Bar */}
              <div 
                className="absolute left-1.5 h-12 bg-indigo-500/10 rounded-full pointer-events-none transition-all duration-75"
                style={{ width: `calc(${sliderX}px + 48px)` }}
              ></div>

              {/* Slider Drag Handler */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 280 }}
                dragElastic={0.05}
                dragMomentum={false}
                style={{ x: sliderX }}
                onDrag={(event, info) => {
                  const currentX = Math.max(0, Math.min(280, info.offset.x));
                  setSliderX(currentX);
                }}
                onDragEnd={(event, info) => {
                  // Threshold checked via offset
                  if (info.offset.x > 180) {
                    setSliderX(280);
                    handlePuterSignIn();
                  } else {
                    setSliderX(0);
                  }
                }}
                className="relative z-10 w-12 h-12 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg hover:brightness-115 active:brightness-95 transition-all duration-150"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.div>

              <button
                id="fallback-login"
                onClick={handlePuterSignIn}
                className="mr-3 relative z-10 p-2 text-[11px] font-mono font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
              >
                Or Tap Here
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full py-1">
            <hr className="flex-1 border-white/[0.05]" />
            <span className="text-slate-500 font-mono text-[9px] uppercase tracking-widest font-bold">OR OFFLINE ACCESS</span>
            <hr className="flex-1 border-white/[0.05]" />
          </div>

          {/* Secondary Action */}
          <button
            id="btn-sandbox-login"
            onClick={handleSandboxSignIn}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] text-slate-300 hover:text-white font-medium text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 font-mono shadow-md"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Launch Local VEXA Sandbox Mode</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-white/[0.05] z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[10px] font-mono text-slate-500">
          <span>POWERED BY VAYU AGI</span>
          <span>•</span>
          <span>SECURE END-TO-END CRYPTO ENGINE</span>
          <span>•</span>
          <span>LOCAL BROWSER BUFFERING ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
