import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Stethoscope, Users, Building2, ChevronRight, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const RoleCard = ({ icon: Icon, title, role, description, color, onClick }) => (
  <motion.button 
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onClick(role)}
    className="group relative w-full text-left"
  >
    <div className={`absolute inset-0 bg-${color}-500/5 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full`}></div>
    <div className="relative premium-card p-8 flex flex-col h-full !bg-slate-50/50">
      <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-7 h-7 text-${color}-500`} />
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
          {description}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className={`text-[9px] font-black uppercase tracking-[0.4em] text-${color}-500/60`}>Initialize Access</span>
        <div className={`p-2 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:bg-slate-900 group-hover:text-white transition-all`}>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  </motion.button>
);

const SelectRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  const handleRoleSelect = (role) => {
    localStorage.setItem('user_role', role);
    navigate('/login', { state: { from } });
  };

  return (
    <div className="min-h-screen bg-[#F4F8FB] flex flex-col items-center justify-center p-8 relative overflow-y-auto overflow-x-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary-500/5 blur-[150px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl space-y-12 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 mb-4">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">DENTA Identity Gateway</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Choose Your <span className="gradient-text">Role</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-medium text-base leading-relaxed">
            Select your DENTA or administrative protocol to initialize the diagnostic dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RoleCard 
            icon={Stethoscope} 
            title="Dental Doctor" 
            role="Dental Doctor" 
            description="Full access to AI diagnostics, patient records, and treatment planning."
            color="primary"
            onClick={handleRoleSelect}
          />
          <RoleCard 
            icon={Building2} 
            title="Consultant" 
            role="Consultant" 
            description="Specialist access for advanced case review and DENTA oversight."
            color="accent"
            onClick={handleRoleSelect}
          />
          <RoleCard 
            icon={Users} 
            title="Dental Assistant" 
            role="Dental Assistant" 
            description="Managing patient inflow, intake documentation, and records."
            color="accent"
            onClick={handleRoleSelect}
          />
          <RoleCard 
            icon={GraduationCap} 
            title="Dental Intern" 
            role="Dental Intern" 
            description="Educational access for DENTA training and observation."
            color="amber"
            onClick={handleRoleSelect}
          />
          <RoleCard 
            icon={Shield} 
            title="System Admin" 
            role="Admin" 
            description="Global management of staff, audit logs, and security settings."
            color="rose"
            onClick={handleRoleSelect}
          />
        </div>

        <div className="pt-8 text-center">
          <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">DENTA AI ENGINE V4.2.0 • 2026</p>
        </div>
      </motion.div>
    </div>
  );
};

export default SelectRole;
