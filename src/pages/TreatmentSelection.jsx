import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

const TreatmentCard = ({ title, code, efficiency, time, isSelected, onSelect }) => (
  <button 
    onClick={onSelect}
    className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${
      isSelected 
        ? 'bg-primary-50 border-primary-600 shadow-2xl shadow-primary-500/10' 
        : 'bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white'
    }`}
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
          isSelected ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
        }`}>
          {code}
        </span>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected ? 'bg-primary-600 border-primary-600' : 'border-slate-200 bg-white'
        }`}>
          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
        </div>
      </div>
      <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tight mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
         <div>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1">Efficiency</p>
            <p className="text-xs font-bold text-slate-900 uppercase italic">{efficiency}</p>
         </div>
         <div>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1">Duration</p>
            <p className="text-xs font-bold text-slate-900 uppercase italic">{time}</p>
         </div>
      </div>
    </div>
    
    {/* Background decoration */}
    <div className={`absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[50px] rounded-full transition-opacity duration-500 ${isSelected ? 'opacity-100' : 'opacity-0'}`}></div>
  </button>
);

const TreatmentSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialDiagnosis = location.state?.diagnosis || 'Periapical Anomaly';
  const initialTooth = location.state?.tooth || '#19';

  const suggestedTreatments = location.state?.suggestedTreatments || [];
  const [selected, setSelected] = useState(null);

  const options = suggestedTreatments.length > 0 
    ? suggestedTreatments.map((t, idx) => ({
        title: t,
        code: idx === 0 ? 'AI-PRIMARY' : 'AI-ALTERNATIVE',
        efficiency: idx === 0 ? '98.2%' : '85.5%',
        time: idx === 0 ? 'Optimal' : 'Standard',
        isAi: true,
        type: idx === 0 ? 'primary' : 'secondary',
        badge: idx === 0 ? 'Primary Recommendation' : 'Alternative Strategy'
      }))
    : [
        { title: 'Root Canal Therapy', code: 'PRO-RCT-01', efficiency: 'High', time: '45-60m', cost: '$$$' },
        { title: 'Tooth Extraction', code: 'PRO-EXT-09', efficiency: 'Medium', time: '30m', cost: '$$' },
        { title: 'Dental Filling', code: 'PRO-FILL-02', efficiency: 'High', time: '20m', cost: '$$' },
        { title: 'Dental Implant', code: 'PRO-IMP-05', efficiency: 'Ultra', time: '90m', cost: '$$$$' },
      ];

  const handleProceed = () => {
    if (selected) {
      navigate('/treatment-plan', { 
        state: { 
          plan: selected, 
          diagnosis: initialDiagnosis, 
          tooth: initialTooth,
          patientId: location.state?.patientId,
          patientName: location.state?.patientName
        } 
      });
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">Intervention <span className="gradient-text">Selection</span></h1>
            <p className="text-slate-500 font-medium italic uppercase tracking-tight text-xs">AI Clinical Strategy for <span className="text-slate-900 font-bold">{initialDiagnosis}</span> at <span className="text-primary-600 font-bold">{initialTooth}</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 font-inter">
             <Zap className="w-4 h-4" />
             Aria Quantum Sync
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-inter">
        {options.map((opt) => (
          <div key={opt.code} className="relative">
            {opt.isAi && (
              <div className={`absolute -top-3 left-6 z-20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm ${
                opt.type === 'primary' ? 'bg-primary-600 text-white' : 'bg-slate-900 text-white'
              }`}>
                {opt.badge}
              </div>
            )}
            <TreatmentCard 
              {...opt} 
              isSelected={selected?.code === opt.code}
              onSelect={() => setSelected(opt)}
            />
          </div>
        ))}
      </div>

      <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 font-inter">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
               <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic leading-tight">Secondary Verification Required</p>
               <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Selected strategy involves surgical intervention.</p>
            </div>
         </div>
         <button 
          onClick={handleProceed}
          disabled={!selected}
          className="btn-primary px-12 py-5 uppercase tracking-[0.2em] font-black text-sm group disabled:opacity-30"
         >
            Finalize Strategy
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default TreatmentSelection;
