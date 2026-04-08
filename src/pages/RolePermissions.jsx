import { useState, useEffect } from 'react';
import { 
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/apiService';

const PermissionRow = ({ label, field, value, onToggle, desc }) => (
  <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-primary-100 transition-all group">
    <div className="flex-1 pr-8">
      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-1">{label}</h4>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{desc}</p>
    </div>
    <div className="flex items-center gap-4">
       <button 
        onClick={() => onToggle(field)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          value ? 'bg-primary-600' : 'bg-slate-300'
        }`}
       >
         <span
           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
             value ? 'translate-x-6' : 'translate-x-1'
           }`}
         />
       </button>
       <span className={`text-[9px] font-bold uppercase tracking-widest w-12 ${value ? 'text-primary-600' : 'text-slate-400'}`}>
         {value ? 'ACTIVE' : 'LOCKED'}
       </span>
    </div>
  </div>
);

const RolePermissions = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('ADMIN');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [permissions, setPermissions] = useState({});

  const roleDisplayNames = {
    'ADMIN': 'Administrator',
    'DOCTOR': 'Dental Doctor',
    'CONSULTANT': 'Consultant',
    'ASSISTANT': 'Clinical Assistant',
    'INTERN': 'Dental Intern'
  };

  const permissionMapping = [
    { label: 'Patient Onboarding', field: 'can_add_patient', desc: 'Allow role to register new patients in the registry.' },
    { label: 'Clinical Record Editing', field: 'can_edit_patient', desc: 'Permission to modify existing patient files and history.' },
    { label: 'AI Diagnostics', field: 'can_use_ai', desc: 'Enable X-ray spectral analysis and AI diagnostic engine.' },
    { label: 'Prescription Issuance', field: 'can_prescribe_drugs', desc: 'Authorize clinical drug recommendation and Rx writing.' },
    { label: 'Permanent Data Deletion', field: 'can_delete_patient', desc: 'CRITICAL: Permission to permanently remove records.' },
    { label: 'Staff Management', field: 'can_add_doctor', desc: 'Access to practitioner onboarding and HR panel.' },
    { label: 'Global Analytics', field: 'can_view_analytics', desc: 'Detailed practice oversight and financial metrics.' },
    { label: 'Security Audit Logs', field: 'can_view_audit_logs', desc: 'Access to system-wide activity and access logs.' }
  ];

  useEffect(() => {
    fetchPermissions(activeRole);
  }, [activeRole]);

  const fetchPermissions = async (role) => {
    setLoading(true);
    try {
      const response = await apiService.get(`api/role-permissions/${role}/`);
      setPermissions(response.data);
    } catch (err) {
      console.error('Error fetching permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field) => {
    setPermissions(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      await apiService.put(`api/role-permissions/${activeRole}/`, permissions);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10 mb-12 pt-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Role <span className="text-primary-600">Access Matrix</span></h1>
          <p className="text-slate-500 font-bold text-sm">Global Permission Entitlements</p>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 border border-slate-200">
          <ShieldCheck className="w-5 h-5 text-primary-600" />
          <p className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Master Identity Control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
           {Object.entries(roleDisplayNames).map(([code, name]) => (
             <button 
              key={code}
              onClick={() => setActiveRole(code)}
              className={`w-full p-5 rounded-[1.5rem] border text-left transition-all relative overflow-hidden group ${
                activeRole === code 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/30' 
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200'
              }`}
             >
               <span className="text-[11px] font-bold uppercase tracking-tight group-hover:pl-2 transition-all">{name}</span>
               {activeRole === code && (
                 <motion.div layoutId="activeRole" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500">
                    <ChevronRight className="w-4 h-4" />
                 </motion.div>
               )}
             </button>
           ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Permission Configuration</h3>
                    <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest mt-1">Tier: {roleDisplayNames[activeRole]}</p>
                 </div>
                  <div className="flex items-center gap-4">
                    <AnimatePresence mode="wait">
                      {showSuccess && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Saved</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button 
                      onClick={handleSave}
                      disabled={loading || saving}
                      className="btn-primary py-3.5 px-8 !bg-slate-900 hover:!bg-primary-600 shadow-xl"
                    >
                      {saving ? 'Saving...' : 'Apply Protocols'}
                    </button>
                  </div>
              </div>
              
              <div className="p-6">
                 {loading ? (
                   <div className="h-96 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading permissions...</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 gap-4">
                      {permissionMapping.map(item => (
                        <PermissionRow key={item.field} label={item.label} field={item.field} value={permissions[item.field]} onToggle={handleToggle} desc={item.desc} />
                      ))}
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RolePermissions;
