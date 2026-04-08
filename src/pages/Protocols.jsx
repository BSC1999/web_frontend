import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BookOpen, Settings, CheckCircle } from 'lucide-react';

const Protocols = () => {
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
            <button onClick={() => navigate('/documentation')} className="hover:text-primary-600 transition-colors uppercase">Diagnostic Engine</button>
          </div>
        </div>
      </nav>

      <div className="pt-32 lg:pt-40 p-8 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <section className="py-20 px-6">
            <div className="space-y-6 mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest border border-primary-100">
                Operating System
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Clinical <br />
                <span className="text-primary-600">Protocols.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-3xl leading-relaxed italic">
                Our protocols ensure absolute precision and security in the clinical application of DENTA AI. Every step is engineered for maximum diagnostic efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Protocol Item */}
               <div className="space-y-8 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-primary-500/5 group hover:border-primary-100 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-primary-600 transition-all">
                    <BookOpen className="w-7 h-7 text-sky-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Clinical Integration SOP</h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                      Standard operating procedures for seamless AI-assisted diagnosis within existing practice workflows.
                    </p>
                    <div className="space-y-3 pt-4">
                      {["Initial Scan Calibration", "AI Findings Review", "Peer-to-Peer Verification", "Patient Counseling Bridge"].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <CheckCircle className="w-4 h-4 text-primary-500" />
                           <span className="text-xs font-black text-slate-700 uppercase tracking-tight italic">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>

               {/* Protocol Item */}
               <div className="space-y-8 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-primary-500/5 group hover:border-primary-100 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-primary-600 transition-all">
                    <Shield className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Security & Privacy Protocol</h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                      Zero-trust architecture ensuring total patient data anonymity and end-to-end encryption.
                    </p>
                    <div className="space-y-3 pt-4">
                      {["Post-Quantum AES-256", "HIPAA/SOC2 Compliance", "Biometric Access Layer", "Audit Trail Preservation"].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <CheckCircle className="w-4 h-4 text-primary-500" />
                           <span className="text-xs font-black text-slate-700 uppercase tracking-tight italic">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>

               {/* Protocol Item */}
                <div className="space-y-8 p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-primary-500/5 group hover:border-primary-100 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-primary-600 transition-all">
                    <Settings className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Hardware Integration Protocol</h3>
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                      Technical guidelines for synchronizing DENTA AI with various digital imaging hardware manufacturers.
                    </p>
                    <div className="space-y-3 pt-4">
                      {["DICOM Standard Sync", "API Handshake Protocol", "Automated Image Enhancement", "Latency Optimization"].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <CheckCircle className="w-4 h-4 text-primary-500" />
                           <span className="text-xs font-black text-slate-700 uppercase tracking-tight italic">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Protocols;
