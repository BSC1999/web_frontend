import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  UserCircle,
  Shield,
  Activity,
  ChevronRight,
  Sparkles,
  MoreHorizontal,
  RefreshCcw,
  Monitor
} from 'lucide-react';
import authService from '../services/authService';
import apiService from '../services/apiService';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-primary-50 text-primary-600 border border-primary-100 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`
    }
  >
    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
    <span className="font-medium">{label}</span>
  </NavLink>
);

const Sidebar = ({ isOpen, toggleSidebar, permissions, role }) => {
  const navigate = useNavigate();

  const getMenuItems = () => {
    const items = [
      { to: '/dashboard', icon: LayoutDashboard, label: role === 'Admin' ? 'Admin Dashboard' : 'Dashboard', visible: true },
      { to: '/patients', icon: Users, label: 'Patients', visible: permissions.can_view_patients !== false },
      { to: '/xray', icon: Sparkles, label: 'AI Assistant', visible: !!permissions.can_use_ai },
      { to: '/manage-doctors', icon: UserCircle, label: 'Staff Management', visible: !!permissions.can_add_doctor },
      { to: '/audit-logs', icon: Activity, label: 'Audit Logs', visible: !!permissions.can_view_audit_logs },
      { to: '/role-permissions', icon: Shield, label: 'Access Control', visible: !!permissions.can_manage_settings },
      { to: '/more', icon: MoreHorizontal, label: 'More', visible: role !== 'Admin' },
    ];
    
    return items.filter(item => item.visible);
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-72 glass-morphism border-r border-white/10 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 px-4 py-8 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center shadow-2xl shadow-primary-500/20">
              <span className="text-white font-black text-2xl italic uppercase">D</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">DENTA <span className="text-primary-600">AI</span></h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Diagnostic Dashboard</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4">
              {role === 'Admin' ? 'Administrative Suite' : 'Clinical Suite'}
            </p>
            {menuItems.map(item => (
              <SidebarItem key={item.to} {...item} onClick={toggleSidebar} />
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <SidebarItem to="/settings" icon={Settings} label="Settings" onClick={toggleSidebar} />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const Navbar = ({ toggleSidebar, isSyncing, systemSettings = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('user_full_name') || 'User';
  const role = localStorage.getItem('user_role') || 'Practitioner';

  const getBreadcrumb = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    const mapping = {
      'dashboard': 'Dashboard',
      'patients': 'Patients',
      'xray': 'AI Assistant',
      'settings': 'Settings',
      'role-permissions': 'Access Control',
      'audit-logs': 'Audit Logs',
      'manage-doctors': 'Staff Management'
    };
    const currentLabel = mapping[segments[0]] || 'Dashboard';
    return { parentLabel: 'Dashboard System', currentLabel };
  };

  const { currentLabel } = getBreadcrumb();

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 px-4 lg:px-8 text-black transition-colors duration-700 ultra-dark:bg-[#000000]/80 ultra-dark:border-white/10 ultra-dark:text-white">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-6">
          <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all ultra-dark:bg-white/5 ultra-dark:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {isSyncing && <RefreshCcw className="w-3 h-3 animate-spin text-primary-500" />}
            <span className="hover:text-primary-600 cursor-pointer transition-colors" onClick={() => navigate('/dashboard')}>System</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 ultra-dark:text-white">{currentLabel}</span>
          </div>

          {/* System Calibration Badges */}
          <div className="flex items-center gap-2">
             {systemSettings.aggressive_path_detection && (
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-3 h-3" /> NEURAL ACTIVE
               </div>
             )}
             {systemSettings.dicom_mirror && (
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-600 text-white text-[8px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20">
                  <Monitor className="w-3 h-3" /> MIRRORING
               </div>
             )}
             {systemSettings.vital_overlay && (
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20">
                  <Activity className="w-3 h-3" /> LIVE
               </div>
             )}
          </div>
        </div>
        <div className="flex items-center gap-4 lg:gap-6">

          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 uppercase italic">{userName}</p>
                <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest">{role}</p>
             </div>
             <div className="w-10 h-10 rounded-full border-2 border-primary-500/20 overflow-hidden bg-slate-50 flex items-center justify-center">
                {localStorage.getItem('user_profile_pic') ? (
                  <img src={localStorage.getItem('user_profile_pic')} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-6 h-6 text-slate-300" />
                )}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const BottomNav = ({ permissions, role }) => {
  const getNavItems = () => {
    const items = role === 'Admin' ? [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Admin' },
      { to: '/manage-doctors', icon: UserCircle, label: 'Staff' },
      { to: '/audit-logs', icon: Activity, label: 'Audit' },
      { to: '/role-permissions', icon: Shield, label: 'Security' },
    ] : [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dash', visible: true },
      { to: '/patients', icon: Users, label: 'Patients', visible: permissions.can_view_patients !== false },
      { to: '/xray', icon: Sparkles, label: 'AI', visible: !!permissions.can_use_ai },
      { to: '/more', icon: MoreHorizontal, label: 'More', visible: true },
    ].filter(item => item.visible !== false);
    return items;
  };
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 flex items-center justify-around">
      {getNavItems().map(item => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 ${isActive ? 'text-primary-600' : 'text-slate-400'}`}>
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [permissions, setPermissions] = useState(JSON.parse(localStorage.getItem('user_permissions') || '{}'));
  const [isSyncing, setIsSyncing] = useState(false);
  const role = localStorage.getItem('user_role') || 'Practitioner';

  const [systemSettings, setSystemSettings] = useState({});

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const response = await apiService.get('api/security-settings/GLOBAL/');
        const settings = response.data;
        setSystemSettings(settings);
        
        // Mawa, Ultra Dark Protocol enforcement
        if (settings.ultra_dark_mode) {
          document.body.classList.add('ultra-dark');
        } else {
          document.body.classList.remove('ultra-dark');
        }
      } catch (err) {
        console.error('System calibration sync failed:', err);
      }
    };

    fetchSystemSettings();
    const interval = setInterval(fetchSystemSettings, 20000); // Sync every 20s (Optimized)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const syncPermissions = async () => {
      setIsSyncing(true);
      try {
        await authService.getCurrentUser();
        const updatedPerms = JSON.parse(localStorage.getItem('user_permissions') || '{}');
        setPermissions(updatedPerms);
        
        // Safety Redirect: If user is on a page they no longer have access to
        const path = location.pathname;
        const currentRole = localStorage.getItem('user_role');
        const isNonPractitioner = currentRole === 'Admin' || currentRole === 'Dental Assistant' || currentRole === 'Assistant';
        
        if ((path === '/xray' || path === '/analysis') && (!updatedPerms.can_use_ai || isNonPractitioner)) {
            navigate('/dashboard');
        }
        
        if (path === '/patients' && updatedPerms.can_view_patients === false) navigate('/dashboard');
        if (path === '/manage-doctors' && !updatedPerms.can_add_doctor) navigate('/dashboard');
        if (path === '/role-permissions' && !updatedPerms.can_manage_settings) navigate('/dashboard');
        
      } catch (err) {
        console.error('Permission sync failed:', err);
      } finally {
        setTimeout(() => setIsSyncing(false), 1000);
      }
    };

    const interval = setInterval(syncPermissions, 10000); // Sync every 10 seconds (Optimized)
    return () => clearInterval(interval);
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-[#F4F8FB] text-slate-900 flex overflow-hidden lg:transition-colors duration-700 ultra-dark:bg-[#000000] ultra-dark:text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} permissions={permissions} role={role} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 pb-16 lg:pb-0">
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} isSyncing={isSyncing} systemSettings={systemSettings} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar ultra-dark:bg-[#000000]">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 text-black ultra-dark:text-white">
            {children}
          </div>
        </main>
        <BottomNav permissions={permissions} role={role} />
      </div>
    </div>
  );
};

export default Layout;
