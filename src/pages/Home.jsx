import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight
} from 'lucide-react';



const Footer = () => (
  <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm italic uppercase">D</span>
            </div>
                <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">DENTA <span className="text-primary-600">AI</span></span>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">
                The world's most advanced dental pathology engine. Precision AI diagnostics for the next generation of clinical excellence.
              </p>
        </div>
        <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Navigation</h4>
              <ul className="space-y-4 text-sm font-black text-slate-400 uppercase tracking-widest">
            <li className="hover:text-primary-600 cursor-pointer transition-colors">Diagnostics</li>
            <li className="hover:text-primary-600 cursor-pointer transition-colors">System Core</li>
            <li className="hover:text-primary-600 cursor-pointer transition-colors">Cloud Sync</li>
          </ul>
        </div>
        </div>
        <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">System Core</h4>
              <ul className="space-y-4 text-sm font-black text-slate-400 uppercase tracking-widest">
            <li className="hover:text-primary-600 cursor-pointer transition-colors">Protocol Help</li>
            <li className="hover:text-primary-600 cursor-pointer transition-colors">API Docs</li>
            <li className="hover:text-primary-600 cursor-pointer transition-colors">Legal</li>
          </ul>
        </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-100 pt-10 gap-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              © 2026 DENTA AI ENGINE • ADVANCED PATHOLOGY SOLUTIONS
            </p>
            <div className="flex items-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <span className="hover:text-primary-600 cursor-pointer transition-colors">Security Protocol 1.0</span>
              <span className="hover:text-primary-600 cursor-pointer transition-colors">Privacy Matrix</span>
            </div>
      </div>
    </div>
  </footer>
);



const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-white font-black text-2xl italic uppercase">D</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">DENTA <span className="text-primary-600">AI</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <button onClick={() => navigate('/home')} className="hover:text-primary-600 transition-colors uppercase">Home Screen</button>
          <button onClick={() => navigate('/explore')} className="hover:text-primary-600 transition-colors uppercase">Technical Screen</button>
          <button onClick={() => navigate('/documentation')} className="hover:text-primary-600 transition-colors uppercase">Diagnostic Engine</button>
        </div>

      </div>
    </nav>
  );
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F8FB] overflow-x-hidden selection:bg-primary-100 selection:text-primary-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-50 rounded-full border border-primary-100">
              <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></div>
              <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">AI Engine V4.2 Protocol Active</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              The Future of <br />
              <span className="gradient-text">Dental Intelligence</span>
            </h1>
            
            <p className="text-lg font-medium text-slate-500 max-w-xl leading-relaxed">
              The master control terminal for modern dental practices. Precision AI pathology detection and automated clinical orchestration for next-gen specialists.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => navigate('/select-role')}
                className="bg-primary-600 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 hover:bg-primary-700 hover:-translate-y-1 transition-all flex items-center gap-3"
              >
                Select Role
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/protocols')}
                className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
              >
                Learn Protocol
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative h-[500px] w-full"
          >
            <div className="absolute inset-0 bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(15,23,42,0.05)] border border-slate-100 overflow-hidden flex items-center justify-center p-12">
               <div className="absolute w-[70%] h-[70%] bg-primary-50 rounded-full blur-[100px] opacity-60"></div>
               <img 
                 src="/dental-logo.png" 
                 alt="DENTA Logo" 
                 className="relative z-10 w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(42,111,151,0.1)]"
               />
               <div className="absolute top-10 right-10 bg-slate-900/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/50 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                 <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Core Active</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sections moved to separate screens as requested */}

      <Footer />
    </div>
  );
};

export default Home;
