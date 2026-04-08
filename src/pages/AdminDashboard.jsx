import { useState, useEffect } from 'react';
import { 
  Users2, 
  ShieldCheck, 
  UserCircle,
  Stethoscope,
  GraduationCap,
  Briefcase,
  UserPlus,
  AlertTriangle
} from 'lucide-react';
import apiService from '../services/apiService';

const AdminStatCard = ({ title, value, icon: Icon, subtext, color = "primary" }) => {
  const colorStyles = {
    primary: "bg-primary-50 border-primary-100 text-primary-600 shadow-primary-500/5",
    slate: "bg-slate-50 border-slate-100 text-slate-600 shadow-slate-500/5",
    emerald: "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-emerald-500/5",
    amber: "bg-amber-50 border-amber-100 text-amber-600 shadow-amber-500/5",
    rose: "bg-rose-50 border-rose-100 text-rose-600 shadow-rose-500/5",
    orange: "bg-orange-50 border-orange-100 text-orange-600 shadow-orange-500/5"
  };

  return (
    <div className="p-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-900/5 group hover:border-primary-100 transition-all flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${colorStyles[color]}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-400 text-[8px] font-bold uppercase tracking-widest border border-slate-100 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
          Real-time
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase mb-0.5 tabular-nums">{value}</h3>
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
           <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${color === 'rose' || color === 'orange' ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
           {subtext}
        </p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: '0',
    consultants: '0',
    assistants: '0',
    interns: '0',
    total_patients: '0',
    alerts: '0'
  });
  const fetchAdminStats = async () => {
    try {
      const response = await apiService.get('api/admin-stats/');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      // End syncing logic removed
    }
  };

  useEffect(() => {
    fetchAdminStats();
    // Auto-update every 10 seconds for real-time feel
    const interval = setInterval(fetchAdminStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative space-y-16 pb-20 max-w-7xl mx-auto px-6">
      {/* Background Decor */}
      <div className="absolute top-[-100px] left-[-150px] w-[600px] h-[600px] bg-primary-500/5 blur-[180px] rounded-full -z-10"></div>
      

      {/* Intelligence Suite */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard 
            title="Surgical Doctors" 
            value={stats.doctors || '0'} 
            subtext="Certified Practitioners"
            icon={Stethoscope} 
            color="primary"
          />
          <AdminStatCard 
            title="Senior Consultants" 
            value={stats.consultants || '0'} 
            subtext="Specialist Reviewers"
            icon={Briefcase} 
            color="emerald"
          />
          <AdminStatCard 
            title="Clinical Assistants" 
            value={stats.assistants || '0'} 
            subtext="Support Operations"
            icon={UserPlus} 
            color="amber"
          />
          <AdminStatCard 
            title="Dental Interns" 
            value={stats.interns || '0'} 
            subtext="Residency Program"
            icon={GraduationCap} 
            color="primary"
          />
          <AdminStatCard 
            title="Total Patients" 
            value={stats.total_patients || '0'} 
            subtext="Consolidated Records"
            icon={UserCircle} 
            color="slate"
          />
          <AdminStatCard 
            title="System Alerts" 
            value={stats.alerts || '0'} 
            subtext={stats.alerts > 0 ? "Critical Node Events" : "All Systems Nominal"}
            icon={AlertTriangle} 
            color={stats.alerts > 0 ? "rose" : "orange"}
          />
        </div>

      {/* Security Footer Decorative */}
      <div className="pt-10 border-t border-slate-100">
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-4">
               <ShieldCheck className="w-8 h-8 text-slate-900" />
               <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] italic text-center md:text-left">Encrypted Real-time Sync Protocol Active</p>
            </div>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-bounce"></div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">LAST SYNC: {new Date().toLocaleTimeString()}</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-bounce delay-150"></div>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">DRUG-ID: V65.0</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
