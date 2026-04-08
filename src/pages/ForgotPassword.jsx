import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      alert('Please enter a valid @gmail.com email address.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FB] flex flex-col items-center justify-center p-8 relative overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0 bg-primary-50 blur-[120px] rounded-full"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="premium-card space-y-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Reset Access</h1>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Enter your professional email. We'll send a high-security activation link to verify your identity.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <Mail className="absolute left-5 top-5 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="DENTA Email Address"
                      className="input-field pl-14"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full py-5 text-sm uppercase tracking-[0.2em] font-black group">
                    Send Link
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>

                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <p className="text-[10px] text-amber-700 font-medium leading-[1.6] uppercase tracking-tight">
                    Multi-factor authentication may be triggered during reset for restricted roles.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-8"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight mb-3">Transmission Successful</h2>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                    A secure reset package has been dispatched to <span className="text-slate-900 font-bold">{email}</span>. Please authorize within 15 minutes.
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/login')}
                  className="btn-secondary w-full py-5"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
