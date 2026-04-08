import { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Zap, 
  ChevronRight,
  Loader2,
  AlertCircle,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/apiService';

const DrugRecommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = location.state?.patientId;
  const patientName = location.state?.patientName || 'Clinical Patient';
  const findings = location.state?.findings || [];
  const diagnosis = location.state?.diagnosis || (findings.length > 0 ? findings[0].condition : 'General Consultation');
  const tooth = location.state?.tooth || 'Global';
  const selected_treatment = location.state?.selected_treatment || 'General Consultation';
  
  const [loading, setLoading] = useState(true);
  const [protocol, setProtocol] = useState({ drugs: [], precautions: [], warnings: [] });

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        // Simulating heavy AI processing for premium UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const response = await apiService.post('api/patients/recommend_drugs/', { 
          patient_id: patientId || "GENERAL",
          diagnosis: diagnosis,
          selected_treatment: selected_treatment
        });
        
        setProtocol({
          drugs: response.data.drugs || [],
          precautions: response.data.precautions || [],
          warnings: response.data.warnings || []
        });
      } catch (err) {
        console.error('Failed to fetch protocol:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [diagnosis, patientId]);

  const finalizeSelection = () => {
    navigate('/prescription', {
      state: {
        patientId,
        patientName,
        diagnosis,
        tooth,
        // The AI output is completely fixed and automatic
        selectedDrugs: protocol.drugs.map(d => ({
          name: d.name,
          dosage: d.dosage,
          frequency: d.timeline,
          instructions: d.reason
        }))
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 px-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10 mb-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Drug <span className="text-primary-600">Recommendation</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm">Automated Clinical Protocol for <span className="text-slate-900">{patientName}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={finalizeSelection}
            disabled={loading || protocol.drugs.length === 0}
            className={`py-4 px-10 rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center gap-3 transition-all ${
              !loading && protocol.drugs.length > 0 
                ? 'bg-primary-600 text-white hover:bg-slate-900 shadow-2xl shadow-primary-500/20' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            Proceed to Prescription
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-32 flex flex-col items-center justify-center space-y-6"
          >
             <div className="relative">
               <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-xl animate-pulse"></div>
               <BrainCircuit className="w-16 h-16 text-primary-500 relative z-10 animate-bounce" />
             </div>
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center max-w-sm">
               Processing medical history, vital conditions, and treatment path...
             </p>
          </motion.div>
        ) : (
          <motion.div 
            key="protocol"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* AI Alerts */}
            {(protocol.warnings.length > 0 || protocol.precautions.length > 0) && (
              <div className="space-y-4">
                {protocol.warnings.map((warn, i) => (
                  <div key={`w-${i}`} className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4 shadow-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Critical Warning</p>
                      <p className="text-sm font-bold text-slate-900">{warn}</p>
                    </div>
                  </div>
                ))}
                {protocol.precautions.map((prec, i) => (
                  <div key={`p-${i}`} className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4 shadow-sm">
                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Clinical Precaution</p>
                      <p className="text-sm font-bold text-slate-900">{prec}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Protocol Timeline */}
            <div className="relative pl-8 space-y-12 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-slate-100">
              {protocol.drugs.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                  No pharmacological intervention required for this protocol.
                </div>
              ) : (
                protocol.drugs.map((drug, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute -left-[37px] top-1 w-6 h-6 rounded-full bg-primary-50 border-4 border-white shadow-sm flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                    </div>
                    
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 hover:border-primary-200 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                              {drug.type || 'MEDICATION'}
                            </span>
                            <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">
                              {drug.timeline}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">
                            {drug.name}
                          </h3>
                        </div>
                        
                        <div className="shrink-0 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-right min-w-[140px]">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dosage Protocol</p>
                          <p className="text-sm font-bold text-slate-900">{drug.dosage}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-primary-50/50 border border-primary-100 text-primary-900 text-sm font-medium italic flex items-start gap-3">
                        <Zap className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                        <p>{drug.reason || 'Symptomatic management mapping.'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrugRecommendations;
