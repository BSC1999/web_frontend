import { useState, useEffect } from 'react';
import { 
  Save, 
  ShieldCheck, 
  ArrowLeft,
  Camera,
  UserCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('user_role') || 'DOCTOR';
  const fullName = localStorage.getItem('user_full_name') || 'Lead Operator';
  
  const [profileData, setProfileData] = useState({
    title: 'Senior Orthodontist',
    email: 'bhargav.DENTA@DENTAai.com',
    phone: '8847299402',
    location: 'Chennai Central Unit (A-1)',
    bio: 'Specializing in AI-integrated treatment planning for complex orthodontic cases. Focused on maximizing DENTA throughput via digital transformation.'
  });

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!/^[a-zA-Z\s]+$/.test(profileData.title)) newErrors.title = 'Title must contain only alphabets';
    if (!/^\d{10}$/.test(profileData.phone)) newErrors.phone = 'Phone must be exactly 10 digits';
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(profileData.email)) newErrors.email = 'Email must be a valid @gmail.com address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-10">
      <div className="flex items-center gap-4 pt-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Specialist <span className="text-primary-600">Profile</span></h1>
          <p className="text-slate-500 font-bold text-sm">Clinical Identity Protocol</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="premium-card text-center flex flex-col items-center py-10 relative overflow-hidden group border-slate-200 bg-white">
            <div className="absolute inset-0 bg-primary-100/20 blur-[60px] rounded-full"></div>
            <div className="relative mb-8">
               <div className="w-40 h-40 rounded-full border-4 border-slate-100 p-1 bg-white shadow-2xl shadow-primary-500/20 flex items-center justify-center overflow-hidden">
                  {localStorage.getItem('user_profile_pic') ? (
                    <img 
                      src={localStorage.getItem('user_profile_pic')} 
                      className="w-full h-full rounded-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <UserCircle className="w-24 h-24 text-slate-400" />
                  )}
               </div>
               <button className="absolute bottom-2 right-2 p-3 bg-white border border-slate-200 text-slate-900 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                  <Camera className="w-4 h-4" />
               </button>
            </div>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight mb-2">{fullName}</h3>
            <p className="text-[10px] font-black text-primary-700 bg-primary-100 px-4 py-1.5 rounded-full border border-primary-200 uppercase tracking-[0.2em] italic mb-8">DENTA {userRole}</p>
          </div>

          <div className="premium-card bg-primary-950 border-primary-800 flex items-start gap-4 p-5 scale-95 opacity-90">
             <div className="p-2 rounded-xl bg-primary-900 border border-primary-700 text-primary-400 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1 leading-tight">Digital Seal Active</h4>
                <p className="text-[10px] text-primary-300/70 leading-relaxed font-medium italic">Unique DENTA ID attached to all signed prescriptions.</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="glass-morphism p-10 rounded-[2.5rem] border-slate-200 bg-slate-50/50 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Professional Title</label>
                    <input 
                      type="text" 
                      className={`input-field italic ${errors.title ? 'border-rose-500 bg-rose-50' : ''}`}
                      value={profileData.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                          setProfileData({...profileData, title: val});
                        }
                      }}
                    />
                    {errors.title && <p className="text-[8px] text-rose-500 font-bold uppercase ml-1">{errors.title}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">DENTA Email</label>
                    <input 
                      type="email" 
                      className={`input-field italic ${errors.email ? 'border-rose-500 bg-rose-50' : ''}`}
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                    {errors.email && <p className="text-[8px] text-rose-500 font-bold uppercase ml-1">{errors.email}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Contact Terminal (10 Digits)</label>
                    <input 
                      type="tel" 
                      className={`input-field italic ${errors.phone ? 'border-rose-500 bg-rose-50' : ''}`}
                      value={profileData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setProfileData({...profileData, phone: val});
                      }}
                    />
                    {errors.phone && <p className="text-[8px] text-rose-500 font-bold uppercase ml-1">{errors.phone}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Location Node</label>
                    <input 
                      type="text" 
                      className="input-field italic"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Professional Biography</label>
                 <textarea 
                  className="input-field min-h-[150px] py-6 italic leading-relaxed"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                 />
              </div>

              <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-6">
                 {saveSuccess && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                     <CheckCircle2 className="w-4 h-4" /> Profile Updated
                   </motion.div>
                 )}
                 <button 
                  onClick={handleSave}
                  className="btn-primary px-12 py-5 font-black uppercase tracking-[0.3em] flex items-center gap-3 italic text-sm shadow-2xl shadow-primary-500/20"
                 >
                    <Save className="w-5 h-5" />
                    Update Profile
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
