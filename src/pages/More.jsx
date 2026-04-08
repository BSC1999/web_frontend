import { 
  UserCircle, 
  Info, 
  LogOut, 
  ChevronRight, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HubCategory = ({ title, icon: Icon, onClick, isLogout }) => (
  <button 
    onClick={onClick}
    className="premium-card p-6 flex items-center gap-6 group hover:bg-slate-50 text-left transition-all relative overflow-hidden w-full"
  >
    <div className={`p-4 rounded-2xl ${isLogout ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'} border border-slate-100 group-hover:scale-110 transition-transform group-hover:bg-primary-600 group-hover:text-white`}>
      <Icon className="w-8 h-8" />
    </div>
    <div className="flex-1">
      <h3 className={`text-xl font-black italic uppercase tracking-tight group-hover:text-primary-600 transition-colors ${isLogout ? 'text-rose-600' : 'text-slate-900'}`}>
        {title}
      </h3>
    </div>
    <div className="p-2 rounded-xl bg-slate-100 text-slate-300 group-hover:text-slate-900 transition-all">
       <ChevronRight className="w-5 h-5" />
    </div>
  </button>
);

const More = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="space-y-12 pb-10 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">More <span className="text-primary-600">Options</span></h1>
          <p className="text-slate-500 font-bold tracking-tight italic">Practice Management & Identity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <HubCategory 
          title="Profile Settings" 
          icon={UserCircle}
          onClick={() => navigate('/doctor-profile')}
        />
        <HubCategory 
          title="About & Legal" 
          icon={Info}
          onClick={() => navigate('/about')}
        />
      </div>

      <div className="flex items-center justify-center gap-10 opacity-20 filter grayscale pt-12">
        <div className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">Denta AI Protocol v2.5.0</div>
      </div>
    </div>
  );
};

export default More;
