import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  FlaskConical, 
  Stethoscope,
  Loader2
} from 'lucide-react';
import apiService from '../services/apiService';

const HistoryItem = ({ label, isSelected, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group ${
      isSelected 
        ? 'bg-primary-50 border-primary-500/50 shadow-lg shadow-primary-500/10' 
        : 'bg-white border-slate-200 hover:border-primary-200 hover:bg-primary-50/30'
    }`}
  >
    <span className={`text-[11px] font-bold uppercase tracking-tight ${isSelected ? 'text-primary-600' : 'text-slate-700 group-hover:text-primary-600'}`}>
      {label}
    </span>
    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
      isSelected ? 'bg-primary-600 border-primary-600' : 'border-slate-300 bg-white'
    }`}>
      {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
    </div>
  </button>
);

const MedicalHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const patientData = location.state?.patientData || { name: 'New Patient' };

  const [medical, setMedical] = useState({
    Diabetes: false, Hypertension: false, Asthma: false, 
    'Heart Condition': false, 'Kidney Issues': false, 'Blood Thinners': false,
    'Drug Allergies': false, Pregnancy: false
  });

  const [dental, setDental] = useState({
    'Previous Extraction': false, 'Gum Bleeding': false, 'Active Sensitivity': false,
    'Oral Surgery': false, 'Orthodontics': false, 'Tooth Grinding': false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggle = (set, key) => {
    set(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinalize = async () => {
    setIsSubmitting(true);
    try {
      const historyString = [
        ...Object.keys(medical).filter(k => medical[k]),
        ...Object.keys(dental).filter(k => dental[k])
      ].join(', ');

      const submissionData = {
        patient_id: patientData.patient_id,
        name: patientData.name,
        age: parseInt(patientData.age),
        gender: patientData.gender,
        phone: patientData.phone,
        email: patientData.email,
        address: patientData.address,
        complaint: patientData.complaint,
        medical_history: historyString,
        assigned_doctor: localStorage.getItem('user_id')
      };

      await apiService.post('api/patients/', submissionData);
      navigate('/patients');
    } catch (err) {
      console.error('Error registering patient:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative space-y-12 pb-20 max-w-7xl mx-auto px-6">
      {/* Background Decor */}
      <div className="absolute top-[-100px] right-[-150px] w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-[20%] left-[-100px] w-[400px] h-[400px] bg-accent-500/5 blur-[130px] rounded-full -z-10"></div>

      {/* Step Indicator */}
      <div className="flex items-center gap-6">
        <div className="flex-1 h-3 rounded-full overflow-hidden bg-white border border-slate-100 shadow-sm">
          <div className="h-full bg-primary-600 w-full rounded-full transition-all duration-700 shadow-lg shadow-primary-500/20"></div>
        </div>
        <p className="text-[11px] font-bold text-primary-600 uppercase tracking-[0.3em] whitespace-nowrap">Step 02 <span className="text-slate-300">/</span> 02</p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Clinical <span className="text-primary-600">Medical History</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm">Historical Patient Data Ledger for <span className="text-slate-900">{patientData.name}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Medical Section */}
        <div className="lg:col-span-6 space-y-8 pr-2 h-fit">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <FlaskConical className="w-5 h-5 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Medical History</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(medical).map(key => (
                <HistoryItem 
                  key={key} 
                  label={key} 
                  isSelected={medical[key]} 
                  onToggle={() => toggle(setMedical, key)} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dental Section */}
        <div className="lg:col-span-6 space-y-8 pr-2 h-fit">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-8 h-fit">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Stethoscope className="w-5 h-5 text-primary-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Dental History</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(dental).map(key => (
                <HistoryItem 
                  key={key} 
                  label={key} 
                  isSelected={dental[key]} 
                  onToggle={() => toggle(setDental, key)} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Final Action */}
        <div className="lg:col-span-12 pt-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 max-w-xl">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mb-1">Clinical Data Verification</p>
                    <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                       Ensure systemic health conditions are accurately logged. This data is critical for precise AI-driven treatment planning.
                    </p>
                  </div>
               </div>
               <button 
                onClick={handleFinalize}
                disabled={isSubmitting}
                className="btn-primary min-w-[300px] py-6 text-sm uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-4 !bg-slate-900 hover:!bg-primary-600 transition-all shadow-2xl shadow-slate-900/20"
               >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Synchronizing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Complete Admission</span>
                    </>
                  )}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
