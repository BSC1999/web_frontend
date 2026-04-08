import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

const Splash = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3500; // 3.5 seconds
    const interval = 40; // 40ms updates
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate('/home'), 500); // Small pause at 100%
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [navigate]);


  return (
    <div 
      className="h-screen w-screen flex flex-col items-center justify-center bg-[#F4F8FB] cursor-default overflow-y-auto overflow-x-hidden relative"
    >
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500 blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-8 relative z-10"
      >
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-2xl shadow-primary-500/20">
          <Stethoscope className="w-12 h-12 text-white" />
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            DENTA <span className="text-primary-600">AI</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Dental Pathology Engine</p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-64 space-y-4 pt-4">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden relative">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="absolute top-0 left-0 h-full bg-primary-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
             />
          </div>
          <div className="flex justify-between items-center px-1">
            <p className="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] animate-pulse">
              Initializing...
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-6 text-[8px] font-black text-slate-300 uppercase tracking-widest">
        Version 4.2.0 • Build 2026.03
      </div>
    </div>
  );
};

export default Splash;
