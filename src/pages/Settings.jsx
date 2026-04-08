import { useState, useEffect } from 'react';
import { 
  Activity,
  Smartphone, 
  Moon, 
  Zap, 
  ArrowLeft,
  ChevronRight,
  Monitor,
  Lock,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/apiService';

const SettingToggle = ({ icon: Icon, title, desc, active, onChange, isLoading }) => (
  <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm hover:border-primary-100 transition-all group">
    <div className="flex items-center gap-5">
      <div className={`p-3 rounded-2xl transition-all ${
        active 
          ? 'bg-primary-50 text-primary-600' 
          : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic mb-1">{title}</h4>
        <p className="text-[10px] text-slate-500 font-medium italic">{desc}</p>
      </div>
    </div>
    <button 
      onClick={onChange}
      disabled={isLoading}
      className={`w-12 h-6 rounded-full relative transition-all duration-500 flex items-center ${
        isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'
      } ${active ? 'bg-primary-600 shadow-lg shadow-primary-500/30' : 'bg-slate-200'}`}
    >
      <div className={`absolute w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-sm ${
        active ? 'left-7' : 'left-1'
      }`}>
        {isLoading && <RefreshCcw className="w-2.5 h-2.5 animate-spin text-primary-600 m-0.5" />}
      </div>
    </button>
  </div>
);

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingField, setUpdatingField] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Calibration Persistent');

  // Password Management State
  const [passwords, setPasswords] = useState({
    old: '',
    new: '',
    confirm: ''
  });
  const [showPass, setShowPass] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiService.get('api/security-settings/GLOBAL/');
        setSettings(response.data);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async (field) => {
    if (!settings) return;
    setUpdatingField(field);
    const newValue = !settings[field];
    try {
      await apiService.patch('api/security-settings/GLOBAL/', { [field]: newValue });
      setSettings(prev => ({ ...prev, [field]: newValue }));
      setToastMessage('Calibration Persistent');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
    } finally {
      setUpdatingField(null);
    }
  };

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { label: 'None', color: 'bg-slate-200', score: 0 };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-rose-500', score: 1 };
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { label: 'Moderate', color: 'bg-amber-500', score: 2 };
    return { label: 'Strong', color: 'bg-emerald-500', score: 3 };
  };

  const strength = calculatePasswordStrength(passwords.new);
  const passwordsMatch = passwords.new === passwords.confirm && passwords.new !== '';
  const canSavePassword = passwords.old !== '' && passwords.new !== '' && passwordsMatch && strength.score >= 1;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!canSavePassword) return;

    setIsChangingPass(true);
    setPassError('');

    try {
      await apiService.post('api/auth/change-password/', {
        old_password: passwords.old,
        new_password: passwords.new
      });
      setPasswords({ old: '', new: '', confirm: '' });
      setToastMessage('Identity Credentials Rotated');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setPassError(err.response?.data?.detail || 'Failed to update credentials. Check old password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Synchronizing Calibration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 relative px-4">
      <div className="pt-12 pb-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">System <span className="text-primary-600">Settings</span></h1>
          <p className="text-slate-500 font-bold text-sm">Global Clinical Configuration Matrix</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Clinical Overrides Section */}
        <section className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Neural Sensitivity Matrix</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingToggle 
                    icon={Zap} 
                    title="Aggressive Path Detection" 
                    desc="Models will highlight even minor anatomical anomalies (98% recall)." 
                    active={settings.aggressive_path_detection}
                    onChange={() => handleToggle('aggressive_path_detection')}
                    isLoading={updatingField === 'aggressive_path_detection'}
                />
                <SettingToggle 
                    icon={Activity} 
                    title="Real-time Vital Overlay" 
                    desc="Stream patient telemetry directly into treatment timeline." 
                    active={settings.vital_overlay}
                    onChange={() => handleToggle('vital_overlay')}
                    isLoading={updatingField === 'vital_overlay'}
                />
            </div>
        </section>

        {/* Interface Section */}
        <section className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-2">Interface Protocol Stack</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SettingToggle 
                    icon={Moon} 
                    title="Ultra Dark Protocol" 
                    desc="Enhanced OLED black mode for diagnostic visual focus." 
                    active={settings.ultra_dark_mode}
                    onChange={() => handleToggle('ultra_dark_mode')}
                    isLoading={updatingField === 'ultra_dark_mode'}
                />
                <SettingToggle 
                    icon={Monitor} 
                    title="External DICOM Mirror" 
                    desc="Auto-broadcast diagnostic feed to laboratory monitors." 
                    active={settings.dicom_mirror}
                    onChange={() => handleToggle('dicom_mirror')}
                    isLoading={updatingField === 'dicom_mirror'}
                />
            </div>
        </section>

        {/* CRITICAL: Password Management Section */}
        <section className="space-y-6">
            <div className="flex items-center justify-between ml-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Clinical Credential Authority</p>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <span className="text-[8px] font-black text-amber-700 uppercase tracking-widest text-wrap">Identity Verification Protocol Active</span>
                </div>
            </div>

            <div className="glass-morphism rounded-[3rem] border border-slate-200 p-10 shadow-2xl shadow-slate-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                
                <form onSubmit={handlePasswordChange} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Key className="w-3 h-3 text-slate-400" /> Existing Password
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPass.old ? "text" : "password"}
                                    className="input-field pr-12"
                                    placeholder="Enter your current password"
                                    value={passwords.old}
                                    onChange={(e) => setPasswords({...passwords, old: e.target.value})}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPass({...showPass, old: !showPass.old})}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                                >
                                    {showPass.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-slate-400" /> Security Node Strength
                            </label>
                            <div className="h-[52px] flex items-center justify-between px-6 rounded-2xl bg-slate-50 border border-slate-100 italic">
                                <span className="text-xs font-black uppercase text-slate-400">Entropy Analysis:</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                    strength.label === 'Strong' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    strength.label === 'Moderate' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    strength.label === 'Weak' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                    'bg-slate-100 text-slate-400 border-slate-200'
                                }`}>
                                    {strength.label}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">New Password</label>
                            <div className="relative">
                                <input 
                                    type={showPass.new ? "text" : "password"}
                                    className="input-field pr-12"
                                    placeholder="Enter your new password"
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPass({...showPass, new: !showPass.new})}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                                >
                                    {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Strength Bar */}
                            <div className="flex gap-1 h-1 mt-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${
                                        i <= strength.score ? strength.color : 'bg-slate-100'
                                    }`}></div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Re-enter Password</label>
                            <input 
                                type="password"
                                className={`input-field transition-all duration-300 ${
                                    passwords.confirm && !passwordsMatch ? 'border-rose-300 bg-rose-50/20' : 
                                    passwordsMatch ? 'border-emerald-300 bg-emerald-50/20' : ''
                                }`}
                                placeholder="Confirm your new password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            />
                            {!passwordsMatch && passwords.confirm && (
                                <p className="text-[8px] font-black text-rose-500 uppercase flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Credentials do not match target sync
                                </p>
                            )}
                        </div>
                    </div>

                    {passError && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                            <AlertCircle className="w-4 h-4" />
                            {passError}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
                        <div className="text-[10px] text-slate-400 font-bold uppercase italic tracking-tight">
                            Identity rotation requires <span className="text-slate-900 font-black">immediate system sync</span>.
                        </div>
                        <button 
                            type="submit"
                            disabled={!canSavePassword || isChangingPass}
                            className={`px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center gap-3 relative overflow-hidden ${
                                canSavePassword && !isChangingPass 
                                    ? 'bg-slate-900 text-white hover:bg-primary-600 shadow-2xl shadow-primary-500/20' 
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {isChangingPass ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    Rotate Identity Credentials
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full bg-slate-900 text-white shadow-3xl flex items-center gap-4 z-50 border border-slate-800"
          >
            <CheckCircle2 className="w-5 h-5 text-primary-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center justify-center pt-12 gap-2 text-center">
         <div className="w-1 h-1 rounded-full bg-slate-300"></div>
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.6em] italic">Engine Core v4.2.0 • Build ID: 89402X-ALPHA</p>
         <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">Encryption Level: MIL-SPEC AES-256</p>
      </div>
    </div>
  );
};

export default Settings;
