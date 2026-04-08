import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Activity,
  Target,
  ShieldCheck,
  MoreVertical,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import apiService from '../services/apiService';
import BookSlotModal from '../components/BookSlotModal';

const TimelineStep = ({ step, title, desc, date, badges }) => (
  <div className="flex gap-8 relative group pb-10 last:pb-0">
    {/* Line */}
    <div className="absolute left-[24px] top-10 bottom-[-10px] w-0.5 bg-slate-100 group-last:hidden"></div>
    
    {/* Indicator Pill */}
    <div className="relative z-10 w-[50px] mt-1 shrink-0 text-center">
       <span className="text-primary-500 font-black italic text-2xl drop-shadow-sm leading-none">{step}</span>
    </div>

    <div className="flex-1 mt-1">
       <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">{title}</h3>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 italic mt-2 sm:mt-0">{date}</p>
       </div>
       <div className="premium-card p-6 bg-slate-50/50 mb-4 rounded-3xl border-transparent">
          <p className="text-sm text-slate-600 font-medium leading-relaxed">{desc}</p>
       </div>
       {badges && badges.length > 0 && (
         <div className="flex flex-wrap items-center gap-2">
            {badges.map((badge, idx) => (
              <div 
                key={idx} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                  badge.type === 'primary' ? 'bg-primary-600 text-white border-primary-600' : 
                  'bg-white text-slate-600 border-slate-200'
                }`}
              >
                 {badge.icon && <badge.icon className="w-3 h-3" />}
                 {badge.text}
              </div>
            ))}
         </div>
       )}
    </div>
  </div>
);

const TreatmentPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, diagnosis, tooth, patientName, patientId } = location.state || {};
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeline, setTimeline] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!plan || !diagnosis) {
        setError('Missing clinical data. Go back and select a treatment.');
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.get('api/treatment-plans/', {
          params: {
            treatment: plan.title,
            diagnosis: diagnosis
          }
        });
        setTimeline(response.data);
      } catch (err) {
        console.error('Failed to fetch treatment plan:', err);
        setError('Aria Engine failed to generate timeline. Using fallback protocol.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [plan, diagnosis]);

  // Map API Timeline to Steps exactly matching the requested dynamic architecture
  const steps = [];
  if (timeline?.timeline) {
    const t = timeline.timeline;
    steps.push({
      step: '01',
      title: t.step1_title,
      desc: t.step1_desc,
      date: 'TODAY',
      badges: [
        { text: 'Check-In', icon: Clock, type: 'default' },
        { text: 'In Session', type: 'primary' }
      ]
    });
    steps.push({
      step: '02',
      title: t.step2_title,
      desc: t.step2_desc,
      date: t.step2_day,
      badges: [
        { text: 'Follow-Up', icon: Clock, type: 'default' }
      ]
    });
    if (t.has_step3) {
      steps.push({
        step: '03',
        title: t.step3_title,
        desc: t.step3_desc,
        date: t.step3_day,
        badges: [
          { text: 'Clinical Review', icon: Clock, type: 'default' }
        ]
      });
    }
  }

  const navigateToDrugs = () => {
    navigate('/drug-recommendations', {
      state: {
        patientName,
        diagnosis,
        tooth,
        patientId,
        selected_treatment: plan?.title, // Pass actual treatment name
        findings: [{ condition: diagnosis }] // Required mapping for drug endpoint
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-6">
      {/* Heavy Header identical to image */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-transparent pb-8 mb-8 pt-6">
        <div className="flex items-start gap-6">
          <div>
            <h1 className="text-5xl md:text-[4rem] font-black tracking-tighter uppercase leading-[0.9]">
              <span className="text-slate-900">TREATMENT </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-sky-400">TIMELINE</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-3 italic">
              Strategy: <span className="text-slate-900">{plan?.title || 'Standard Protocol'}</span> <span className="mx-1 text-slate-300">/</span> Tooth: <span className="text-primary-600">#{tooth || 'Global'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 pb-2">
          <button 
             onClick={() => setShowBookModal(true)}
             className="px-8 py-4 rounded-[2rem] bg-slate-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-slate-900/20 hover:scale-105 transition-all"
          >
             <Calendar className="w-4 h-4" />
             Reschedule
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 text-slate-400">
           <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
           <p className="text-[10px] font-black uppercase tracking-[0.3em]">AI Chronology Mapping...</p>
        </div>
      ) : error ? (
        <div className="py-24 flex flex-col items-center justify-center gap-4 text-rose-500">
           <AlertCircle className="w-12 h-12" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em]">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Timeline */}
          <div className="lg:col-span-7 pt-4">
            {steps.map((s, idx) => (
              <TimelineStep key={idx} {...s} />
            ))}
          </div>

          {/* Right Column: Protocol Insight Panel */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-900/5 border border-slate-50 sticky top-10 flex flex-col gap-8">
               
               {/* Insight Header */}
               <div className="text-center">
                  <div className="w-24 h-24 rounded-[2rem] bg-sky-50 flex items-center justify-center mx-auto mb-8 relative">
                     <Target className="w-12 h-12 text-primary-600" />
                     <div className="absolute inset-0 border-2 border-sky-100 rounded-[2rem] scale-90"></div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter mb-2">Protocol Insight</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Aria v65.0 Clinical OS</p>
               </div>

               {/* Metrics Stack */}
               <div className="space-y-4">
                  {/* Duration Matrix */}
                  <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100/50 flex flex-col gap-1">
                     <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Duration Matrix</p>
                     </div>
                     <p className="text-sm text-emerald-700 font-bold italic">{timeline?.timeline?.duration || 'Standard Clinical Flow'}</p>
                  </div>
                  
                  {/* AI Recommendation */}
                  <div className="p-6 rounded-3xl bg-sky-50 border border-sky-100/50 flex flex-col gap-2">
                     <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-primary-600" />
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">AI Recommendation</p>
                     </div>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                        "{timeline?.timeline?.insight}"
                     </p>
                  </div>
               </div>

               {/* Action Button */}
               <button 
                onClick={navigateToDrugs}
                className="w-full py-6 rounded-3xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:scale-[1.02] transition-all"
               >
                  Generate Prescription
               </button>
            </div>
          </div>

        </div>
      )}

      <AnimatePresence>
        {showBookModal && (
          <BookSlotModal
            patient={{ patient_id: patientId, name: patientName }}
            onClose={() => setShowBookModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreatmentPlan;

