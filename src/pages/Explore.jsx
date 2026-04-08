import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Activity, ShieldCheck } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, desc, delay, to }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onClick={() => to && navigate(to)}
      className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-500/5 transition-all group ${to ? 'cursor-pointer' : ''}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 transition-all">
        <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic mb-3">{title}</h3>
      <p className="text-slate-400 text-xs font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
};

const Explore = () => {
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
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span className="text-white font-black text-2xl italic uppercase">D</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">DENTA <span className="text-primary-600">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <button onClick={() => navigate('/home')} className="hover:text-primary-600 transition-colors uppercase">Home Screen</button>
            <button onClick={() => navigate('/explore')} className="text-primary-600 transition-colors uppercase">Technical Screen</button>
            <button onClick={() => navigate('/documentation')} className="hover:text-primary-600 transition-colors uppercase">Diagnostic Engine</button>
          </div>
        </div>
      </nav>

      <div className="pt-32 lg:pt-40 p-8 lg:p-16">
        <div className="max-w-7xl mx-auto">
          <section className="py-20 px-6 relative">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-[11px] font-black text-primary-600 uppercase tracking-[0.5em]">Clinical Advantage</h2>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Engineered for <br />
                <span className="gradient-text">Precision.</span>
              </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
              <FeatureCard 
                icon={Cpu} 
                title="Neural Path" 
                desc="Advanced neural network trained on millions of clinical cases for unmatched diagnostic depth. Our architecture ensures zero-latency processing of high-resolution dental scans."
                delay={0.1}
                to="/analysis"
              />
              <FeatureCard 
                icon={Activity} 
                title="Real-time Scans" 
                desc="Immediate analysis of X-rays and intraoral images with instant confidence scoring. Leverage edge computing to get results within milliseconds."
                delay={0.2}
                to="/xray"
              />
              <FeatureCard 
                icon={ShieldCheck} 
                title="Secure Bridge" 
                desc="Bank-grade encryption for all patient data and clinical records across the cloud. Fully HIPAA compliant and SOC2 certified infrastructure."
                delay={0.3}
                to="/documentation"
              />
            </div>

            <div className="p-16 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl shadow-primary-500/5 relative z-10 overflow-hidden group">
              <div className="flex flex-col xl:flex-row items-start gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] border border-primary-100">
                      Infrastructure Protocol
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">The DENTA <br/><span className="text-primary-600">Infrastructure.</span></h3>
                    <p className="text-slate-500 font-medium leading-relaxed max-w-md">
                      Our technical ecosystem is engineered for absolute clinical reliability. A distributed matrix of high-performance compute nodes ensures zero-latency diagnostic delivery.
                    </p>
                    <div className="flex items-center gap-4 py-4 border-t border-slate-50">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Network Status: Optimal</span>
                    </div>
                 </div>
                 
                 <div className="flex-[1.5] w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      { label: "Neural Processor", value: "NVIDIA H100 GPU Cluster" },
                      { label: "Model Architecture", value: "Vision Transformer (ViT-L/14)" },
                      { label: "Training Dataset", value: "10.5M+ Annotated Radiographs" },
                      { label: "Inference Speed", value: "< 150ms System Latency" },
                      { label: "Security Layer", value: "Post-Quantum AES-256 Support" },
                      { label: "Cloud Backbone", value: "Multi-Region Edge Matrix" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2 group/item">
                        <p className="text-[9px] font-black text-primary-600 uppercase tracking-[0.3em] opacity-60 group-hover/item:opacity-100 transition-opacity">{item.label}</p>
                        <p className="text-lg font-black text-slate-900 uppercase tracking-tight italic border-b border-slate-50 pb-2 group-hover/item:border-primary-100 transition-colors">{item.value}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Explore;
