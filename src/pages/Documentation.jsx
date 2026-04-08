import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Globe } from 'lucide-react';

const Documentation = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F8FB] overflow-x-hidden selection:bg-primary-100 selection:text-primary-900">
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <span className="text-white font-black text-2xl italic uppercase">D</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">DENTA <span className="text-primary-600">AI</span></span>
        </div>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <button onClick={() => navigate('/home')} className="hover:text-primary-600 transition-colors uppercase">Home Screen</button>
            <button onClick={() => navigate('/explore')} className="hover:text-primary-600 transition-colors uppercase">Technical Screen</button>
            <button onClick={() => navigate('/documentation')} className="text-primary-600 transition-colors uppercase">Diagnostic Engine</button>
          </div>
        </div>
      </nav>

      <div className="pt-32 lg:pt-40 p-8 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <section id="ai-core" className="py-20 px-6">
            <div className="flex flex-col lg:flex-row items-start gap-20">
               <div className="flex-1 space-y-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest border border-primary-100">
                    <Globe className="w-3 h-3" />
                    Neural Core Protocol
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                    The AI Engine <br />
                    <span className="text-primary-600">Reimagined.</span>
                  </h1>
                  
                  <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                    Our diagnostic engine is the result of years of clinical research into dental pathology and computer vision.
                  </p>

                  <div className="space-y-6">
                    {[
                      "Proprietary Pathology Modeling",
                      "Automated Treatment Orchestration",
                      "Multi-Modal Imaging Support",
                      "Integrative Patient Insight Matrix"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 tracking-tight italic uppercase">{item}</span>
                      </div>
                    ))}
                  </div>
               </div>
               
               <div className="flex-1 space-y-20 pt-10">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-[10px] font-black uppercase tracking-widest border border-sky-100">
                      Imaging Matrix
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Multi-Modal Imaging</h3>
                    <p className="text-slate-500 font-medium leading-relaxed text-lg italic">
                      Whether it's panoramic, periapical, or bitewing, our AI core handles all standard dental imaging formats with the same high level of accuracy and speed.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      Evolution Core
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Pathology Evolution</h3>
                    <p className="text-slate-500 font-medium leading-relaxed text-lg italic">
                      The engine continuously learns from new data, ensuring that your practice always has the latest in dental diagnostic technology at its fingertips.
                    </p>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
