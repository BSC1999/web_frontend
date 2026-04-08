import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle2,
  PlusCircle,
  Image as ImageIcon,
  ClipboardList,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="px-10 py-8 rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-primary-500/5 group hover:border-primary-100 transition-all flex flex-col justify-between h-full relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-48 h-48 bg-${color}-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    <div className="flex items-center justify-between mb-6 relative z-10">
      <div className={`w-20 h-20 rounded-3xl bg-${color}-50 flex items-center justify-center text-${color}-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm shadow-${color}-200/50`}>
        <Icon className="w-10 h-10" />
      </div>
    </div>
    <div className="relative z-10 text-center md:text-left">
      <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className={`text-6xl font-bold text-${color}-600 tracking-tighter uppercase leading-none`}>{value}</h3>
    </div>
  </div>
);

const QuickAction = ({ label, subtext, icon: Icon, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all group gap-6 w-full text-left"
  >
    <div className={`w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform group-hover:bg-primary-600 group-hover:text-white`}>
      <Icon className="w-7 h-7" />
    </div>
    <div className="flex-1">
      <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{label}</h4>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{subtext}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary-600 transition-colors group-hover:translate-x-1" />
  </button>
);



const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('user_role') || 'Dental Doctor';

  const [stats, setStats] = useState({
    today_appointments: '...',
    pending_reports: '...'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint = role === 'Admin' ? 'api/admin-stats/' : 'api/doctor-dashboard-stats/';
        const response = await apiService.get(endpoint);
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, [role]);

  const isAssistant = role === 'Dental Assistant' || role === 'Assistant';
  const permissions = JSON.parse(localStorage.getItem('user_permissions') || '{}');

  return (
    <div className="relative space-y-12 pb-20">
      {/* Background Decor */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-[20%] right-[-100px] w-[400px] h-[400px] bg-accent-500/5 blur-[130px] rounded-full -z-10"></div>

      <div className="space-y-12 max-w-6xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Today’s Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StatCard 
              title="Total Appointments" 
              value={stats.today_appointments || '0'} 
              icon={Calendar} 
              color="primary" 
            />
            {!isAssistant && (
              <StatCard 
                title="Pending AI Reports" 
                value={stats.pending_reports || '0'} 
                icon={CheckCircle2} 
                color="accent" 
              />
            )}
          </div>
        </div>

        {/* Operational Hub */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase">
              {isAssistant ? 'Clinical Operations' : 'Clinical Command Center'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Operational Hub</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction 
              label="Today's Schedule" 
              subtext="View today's clinical queue" 
              icon={Calendar} 
              onClick={() => navigate('/appointments')}
              color="primary"
            />
            {permissions.can_add_patient !== false && (
              <QuickAction 
                label="Add Patient" 
                subtext="Register a new patient" 
                icon={PlusCircle} 
                onClick={() => navigate('/add-patient')}
                color="slate"
              />
            )}
            
            {/* Mawa, for practitioners, we show everything in one unified grid */}
            {!isAssistant && permissions.can_use_ai && (
              <QuickAction 
                label="Upload X-ray" 
                subtext="Spectral Analysis Scan" 
                icon={ImageIcon} 
                onClick={() => navigate('/patients')}
                color="slate"
              />
            )}

            {permissions.can_prescribe_drugs && (
              <QuickAction 
                label="Write Prescription" 
                subtext="Clinical Rx Engine" 
                icon={ClipboardList} 
                onClick={() => navigate('/prescription')}
                color="slate"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
