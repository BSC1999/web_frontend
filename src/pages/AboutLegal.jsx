import { useState } from 'react';
import { 
  FileText, 
  Shield, 
  Info, 
  ExternalLink, 
  ArrowLeft,
  Scale,
  X,
  ShieldCheck,
  Lock,
  Database,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AboutLegal = () => {
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const RefreshIcon = ({ className }) => <FileText className={className} />;

  const docContents = {
    'Cloud Data Security': {
      icon: Shield,
      subtitle: 'Enterprise-Grade SSL/TLS Encryption',
      details: [
        { label: 'Encryption', val: 'AES-256 bit encryption at rest and TLS 1.3 in transit.', icon: Lock },
        { label: 'Hosting', val: 'SOC 2 Type II compliant cloud infrastructure with 99.9% uptime.', icon: Database },
        { label: 'Monitoring', val: '24/7 automated threat detection and clinical data integrity checks.', icon: ShieldCheck }
      ]
    },
    'Portal Terms of Use': {
      icon: FileText,
      subtitle: 'v2.5.0 Professional License',
      details: [
        { label: 'Authorized Use', val: 'Strictly for licensed dental practitioners and clinical staff.', icon: ShieldCheck },
        { label: 'Liability', val: 'AI reports are advisory; clinical oversight is mandatory for treatment.', icon: Info },
        { label: 'Updates', val: 'Terms updated quarterly to reflect evolving clinical and legal standards.', icon: RefreshIcon }
      ]
    },
    'AI Clinical Validation': {
      icon: Scale,
      subtitle: 'Medical Compliance v4.2',
      details: [
        { label: 'Precision', val: '98.4% accuracy across validated clinical radiograph datasets.', icon: Cpu },
        { label: 'Training', val: 'Neural networks trained on 1M+ peer-reviewed dental cases.', icon: Database },
        { label: 'Standard', val: 'DICOM compatible imaging standards with DICOM-AI bridging.', icon: ShieldCheck }
      ]
    },
    'Privacy & HIPAA Standards': {
      icon: Info,
      subtitle: 'Zero-Log Infrastructure',
      details: [
        { label: 'HIPAA BAA', val: 'Standard Business Associate Agreements provided for all clinics.', icon: FileText },
        { label: 'PII Shield', val: 'Patient data is anonymized before neural diagnostic processing.', icon: Lock },
        { label: 'Retention', val: 'Flexible data retention policies with secure, permanent deletion.', icon: Database }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-10">
      <div className="flex items-center gap-4 pt-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">About and <span className="gradient-text">Legal</span></h1>
          <p className="text-slate-500 font-medium italic">Legal frameworks and DENTA clinical web standards.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedDoc ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 gap-6"
          >
            {Object.keys(docContents).map((title) => (
              <button 
                key={title}
                onClick={() => setSelectedDoc(title)}
                className="premium-card p-6 flex items-center justify-between group hover:border-primary-600/30 transition-all bg-white border-slate-100"
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:text-primary-600 transition-colors">
                    {(() => {
                      const Icon = docContents[title].icon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div className="text-left font-black italic uppercase tracking-tighter">
                    <h4 className="text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{title}</h4>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-none">{docContents[title].subtitle}</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-all" />
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-morphism p-10 rounded-[2.5rem] border-primary-100 bg-white relative"
          >
            <button 
              onClick={() => setSelectedDoc(null)}
              className="absolute top-6 right-6 p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
               <div className="p-4 rounded-3xl bg-primary-600 text-white shadow-xl shadow-primary-500/20">
                  {(() => {
                    const Icon = docContents[selectedDoc].icon;
                    return <Icon className="w-8 h-8" />;
                  })()}
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{selectedDoc}</h3>
                  <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest">{docContents[selectedDoc].subtitle}</p>
               </div>
            </div>

            <div className="space-y-8">
               {docContents[selectedDoc].details.map((item, idx) => (
                 <div key={idx} className="flex gap-4">
                    <div className="p-2.5 h-fit rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                       <item.icon className="w-4 h-4" />
                    </div>
                    <div>
                       <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1 italic">{item.label}</h5>
                       <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{item.val}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 italic text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
               Electronic Document Verified by DENTA Compliance Matrix
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-morphism p-10 rounded-[2.5rem] border-slate-200 bg-slate-50/50 text-center space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-50 blur-[100px] rounded-full -ml-32 -mt-32"></div>
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white text-3xl font-black mb-6 shadow-2xl shadow-primary-500/20">
               D
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-2">DENTA AI PORTAL</h3>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic leading-relaxed max-w-lg mx-auto">
                 Engineering the future of dental diagnostics through proprietary cloud neural networks and practitioner-centric excellence.
               </p>
            </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
           {['ISO 27001', 'SOC 2 TYPE II', 'GDPR COMPLIANT', 'HIPAA SECURE'].map(tag => (
             <span key={tag} className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 hover:border-primary-200 transition-all cursor-default italic">
               {tag}
             </span>
           ))}
        </div>
      </div>

      <div className="text-center">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">© 2026 DENTA SYSTEMS. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  );
};

export default AboutLegal;
