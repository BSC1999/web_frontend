import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  ArrowLeft,
  X,
  Loader2,
  ShieldCheck,
  Stethoscope,
  Briefcase,
  UserCircle,
  GraduationCap,
  RefreshCcw,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/apiService';

const StaffCard = ({ id, name, role, status, specialization, lastActive, email, phone, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete ${name}? This action cannot be undone.`)) {
      setIsDeleting(true);
      try {
        await onDelete(id);
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete user. Please try again.');
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="premium-card group hover:bg-slate-50 transition-all p-6 border-slate-100 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-primary-600 border border-slate-100 uppercase italic">
            {name[0]}
            {name.split(' ')[1]?.[0]}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 italic uppercase tracking-tight group-hover:text-primary-600 transition-colors">{name || 'Unknown Staff'}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{role}</p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-20"
                >
                  <button 
                    onClick={() => { handleDelete(); setShowMenu(false); }}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all text-xs font-black uppercase tracking-widest"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete Specialist
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1 text-black">Focus</p>
            <p className="text-xs font-bold text-slate-900 uppercase italic truncate">{specialization || 'General'}</p>
         </div>
         <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-1 text-black">Status</p>
            <div className="flex items-center gap-1.5">
               <div className={`w-1.5 h-1.5 rounded-full ${status === 'ACTIVE' || status === 'Online' ? 'bg-primary-500' : 'bg-slate-300'}`}></div>
               <p className={`text-[10px] font-black uppercase tracking-tight ${status === 'ACTIVE' || status === 'Online' ? 'text-primary-600' : 'text-slate-400'}`}>{status || 'ACTIVE'}</p>
            </div>
         </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
         <div className="flex gap-2">
            {email && <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 transition-all" title={email}><Mail className="w-4 h-4" /></button>}
            {phone && <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-900 transition-all" title={phone}><Phone className="w-4 h-4" /></button>}
         </div>
         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Active {lastActive || 'Now'}</p>
      </div>
    </div>
  );
};

const OnboardingModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    doctor_id: '202600',
    username: '',
    email: '',
    password: 'Saveetha_Dental',
    role: 'DOCTOR',
    specialization: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { value: 'DOCTOR', label: 'Doctor', icon: Stethoscope },
    { value: 'CONSULTANT', label: 'Specialist', icon: Briefcase },
    { value: 'ASSISTANT', label: 'Assistant', icon: UserCircle },
    { value: 'INTERN', label: 'Intern', icon: GraduationCap },
    { value: 'ADMIN', label: 'System Admin', icon: ShieldCheck },
  ];

  const getPrefixForRole = (role) => {
    switch (role) {
      case 'DOCTOR': return '202600';
      case 'CONSULTANT': return '202611';
      case 'INTERN': return '202622';
      case 'ASSISTANT': return '202633';
      default: return '202699';
    }
  };

  useEffect(() => {
    setFormData(prev => {
        const prefix = getPrefixForRole(prev.role);
        const currentId = prev.doctor_id || '';
        const numericVal = currentId.replace(/[^0-9]/g, '');
        const suffix = numericVal.length >= 6 ? numericVal.substring(6) : '';
        return { ...prev, doctor_id: prefix + suffix };
    });
  }, [formData.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mawa, global validation rules
    if (!/^[a-zA-Z\s]+$/.test(formData.first_name)) {
      setError('First name must contain only alphabets.');
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.last_name)) {
      setError('Last name must contain only alphabets.');
      return;
    }
    if (formData.doctor_id.length !== 10) {
      setError('Doctor ID must be exactly 10 digits.');
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      setError('Invalid email format. Only @gmail.com addresses are allowed.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      await apiService.post('api/users/', formData);
      setSuccess(true);
      setTimeout(() => {
        onRefresh();
        onClose();
        setSuccess(false);
        setFormData({
            first_name: '', last_name: '', doctor_id: '202600', username: '',
            email: '', password: 'Saveetha_Dental', role: 'DOCTOR', specialization: '', phone: ''
        });
      }, 2000);
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err.response?.data?.detail || 'Failed to onboard specialist. Ensure ID/Username is unique.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Staff Onboarding</h2>
                  <p className="text-[10px] text-primary-600 font-black uppercase tracking-[0.3em]">Identity Protocol v4.0</p>
                </div>
                <button onClick={onClose} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {success ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-50 text-emerald-500 flex items-center justify-center scale-110">
                      <CheckCircle2 className="w-12 h-12" />
                   </div>
                   <h3 className="text-3xl font-black text-slate-900 uppercase italic">Onboarded Successfully</h3>
                   <p className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Updating clinical node registry...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100">{error}</div>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="First Name" 
                        required 
                        className="input-field py-4" 
                        value={formData.first_name} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                            setFormData({...formData, first_name: val});
                          }
                        }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Last Name" 
                        required 
                        className="input-field py-4" 
                        value={formData.last_name} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                            setFormData({...formData, last_name: val});
                          }
                        }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Clinical ID / Doctor ID" 
                        required 
                        maxLength={10}
                        className="input-field py-4" 
                        value={formData.doctor_id} 
                        onChange={e => {
                          const val = e.target.value;
                          const numericVal = val.replace(/[^0-9]/g, '');
                          const prefix = getPrefixForRole(formData.role);
                          if (numericVal.startsWith(prefix) || numericVal.length >= prefix.length) {
                             const forcedVal = prefix + numericVal.substring(prefix.length);
                             setFormData({...formData, doctor_id: forcedVal});
                          } else {
                             setFormData({...formData, doctor_id: prefix});
                          }
                        }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Username" 
                        required 
                        className="input-field py-4 font-mono text-sm" 
                        value={formData.username} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '' || /^[a-zA-Z]+$/.test(val)) {
                            setFormData({...formData, username: val});
                          }
                        }} 
                      />
                    </div>
                    <div className="space-y-4">
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        required 
                        className="input-field py-4 lowercase" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value.toLowerCase()})} 
                      />
                      <input type="password" placeholder="Temporary Password" required className="input-field py-4" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                      <input 
                        type="text" 
                        placeholder="Specialization (e.g. Ortho)" 
                        className="input-field py-4" 
                        value={formData.specialization} 
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                            setFormData({...formData, specialization: val});
                          }
                        }} 
                      />
                      <select required className="input-field py-4 cursor-pointer" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                        {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-primary w-full !py-6 !text-[12px] flex items-center justify-center gap-4 bg-slate-900 hover:bg-primary-600 shadow-2xl mt-4"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                    <span>INITIALIZE ONBOARDING SEQUENCE</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ManageDoctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchStaff = async () => {
    setIsSyncing(true);
    try {
      const response = await apiService.get('api/users/');
      setStaff(response.data);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSyncing(false), 800);
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      await apiService.delete(`api/users/${id}/`);
      await fetchStaff();
    } catch (err) {
      console.error('Error deleting staff:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(s => {
    const searchLow = searchTerm.toLowerCase();
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    return fullName.includes(searchLow) || 
           (s.role || '').toLowerCase().includes(searchLow) ||
           (s.specialization || '').toLowerCase().includes(searchLow);
  });

  return (
    <div className="relative space-y-12 pb-20 max-w-7xl mx-auto px-6">
      <div className="absolute top-[-100px] left-[-150px] w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full -z-10"></div>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Manage <span className="text-primary-600">Practitioners</span></h1>
          <p className="text-slate-500 font-bold text-sm">Clinical Personnel Directory</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary !px-10 shadow-2xl shadow-primary-500/20">
          <UserPlus className="w-5 h-5" />
          Onboard Specialist
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Name, Role or Focus..."
            className="input-field pl-14 py-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hydrating Clinical Matrix...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredStaff.map((s, idx) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
              <StaffCard 
                id={s.id}
                name={s.first_name + ' ' + s.last_name} 
                role={s.role} 
                status={s.status} 
                specialization={s.specialization} 
                email={s.email}
                phone={s.phone}
                onDelete={handleDeleteStaff}
              />
            </motion.div>
          ))}
        </div>
      )}

      <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchStaff} />
    </div>
  );
};

export default ManageDoctors;
