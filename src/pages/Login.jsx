import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const selectedRole = localStorage.getItem('user_role') || 'Dental Doctor';
    
    try {
      await authService.login(username, password, selectedRole);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      // Backend returns technical error in 'detail'
      const backEndError = err.response?.data?.detail;
      if (backEndError && typeof backEndError === 'string') {
        setError(backEndError);
      } else {
        setError('Authentication failed. Please check your credentials and selected role.');
      }
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-[#F4F8FB] flex relative overflow-y-auto overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/5 blur-[120px] rounded-full"></div>

      {/* Hero Side (Desktop) */}
      <div className="hidden lg:flex flex-1 flex-col p-16 justify-between relative z-10 border-r border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-2xl shadow-primary-500/20">
            <span className="text-white font-black text-2xl tracking-tighter">D</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight uppercase">DENTA <span className="text-primary-600">AI</span></span>
        </div>

        <div className="space-y-6">
          <h2 className="text-6xl font-black text-slate-900 leading-[0.9] uppercase tracking-tighter italic">
            Precision <br /> 
            <span className="gradient-text">Diagnostics.</span>
          </h2>
          <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
            The world's most advanced AI engine for dental pathology detection. Empowering clinicians with real-time insight.
          </p>
          <div className="flex items-center gap-6 pt-8">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-xl shadow-primary-500/10">
                  <img src={`/avatars/doc${i}.png`} alt="Specialist" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-500">Managed by <span className="text-slate-900 font-black">20+ Expert Specialists</span>.</p>
          </div>
        </div>

        <div className="text-xs font-black text-slate-700 uppercase tracking-widest">
            DENTA ENGINE v4.2.0 • 2026
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-10"
        >


          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Welcome Back</h1>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Secure Practitioner Access Terminal</p>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                <span className="text-[9px] font-black text-primary-700 uppercase tracking-widest">{localStorage.getItem('user_role') || 'Dental Doctor'}</span>
                <button 
                  onClick={() => navigate('/select-role')}
                  className="ml-2 pl-2 border-l border-primary-200 text-[8px] font-black text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest"
                >
                  Change
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}
            
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-6 top-5.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                <input 
                  type="text" 
                  placeholder="DENTA Username / ID"
                  className="input-field pl-16 py-5"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-5.5 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors z-10" />
                <input 
                  type="password" 
                  placeholder="Master Password"
                  className="input-field pl-16 py-5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Options block removed for clean UI */}

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full !py-6 !text-[11px] !bg-slate-900 hover:!bg-primary-600 shadow-2xl shadow-slate-900/20"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Synchronizing Protocol...</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <span>Initialize Session</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>

          <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">AES-256 Encrypted</p>
                <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Identity protection active</p>
              </div>
            </div>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">Built for Dental Care Excellence</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
