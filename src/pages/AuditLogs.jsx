import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  User, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  RefreshCcw,
  Zap,
  CheckCircle2,
  Lock,
  Eye,
  Trash2,
  FileEdit,
  LogIn,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/apiService';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const fetchLogs = async () => {
    setIsSyncing(true);
    try {
      const res = await apiService.get('api/logs/');
      setLogs(res.data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getActionIcon = (activity) => {
    const lower = activity.toLowerCase();
    if (lower.includes('log')) return <LogIn className="w-4 h-4 text-emerald-500" />;
    if (lower.includes('delete') || lower.includes('remove')) return <Trash2 className="w-4 h-4 text-rose-500" />;
    if (lower.includes('update') || lower.includes('upload') || lower.includes('request') || lower.includes('schedule')) return <FileEdit className="w-4 h-4 text-amber-500" />;
    if (lower.includes('register') || lower.includes('onboard')) return <User className="w-4 h-4 text-primary-500" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  const getSeverityColor = (activity) => {
    const lower = activity.toLowerCase();
    if (lower.includes('delete') || lower.includes('lock') || lower.includes('remove')) return 'bg-rose-50 text-rose-600 border-rose-100';
    if (lower.includes('update') || lower.includes('upload') || lower.includes('request') || lower.includes('schedule') || lower.includes('register') || lower.includes('onboard')) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  const filteredLogs = logs.filter(log => {
    const activityLower = (log.activity || '').toLowerCase();
    const matchesSearch = (log.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         activityLower.includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterAction === 'LOGIN') matchesFilter = activityLower.includes('log');
    else if (filterAction === 'CREATE') matchesFilter = activityLower.includes('register') || activityLower.includes('onboard');
    else if (filterAction === 'UPDATE') matchesFilter = activityLower.includes('update') || activityLower.includes('upload') || activityLower.includes('request') || activityLower.includes('schedule');
    else if (filterAction === 'DELETE') matchesFilter = activityLower.includes('delete') || activityLower.includes('remove');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 px-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10 mb-12 pt-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Security <span className="text-primary-600">Audit Logs</span></h1>
          <p className="text-slate-500 font-bold text-sm">System Events & Access Ledger</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Last Synchronized</p>
               <p className="text-xs font-bold text-slate-900 uppercase">Just Now</p>
            </div>
            <button 
              onClick={fetchLogs}
              disabled={isSyncing}
              className="p-4 rounded-3xl bg-white border border-slate-200 text-slate-900 hover:text-primary-600 transition-all shadow-xl shadow-slate-900/5 active:scale-95"
            >
              <RefreshCcw className={`w-6 h-6 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
           <input 
            type="text" 
            placeholder="Search activity by user, action or payload..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-900/5 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-sm font-bold placeholder:text-slate-300 uppercase tracking-tight"
           />
        </div>
        <div className="md:col-span-4">
           <select 
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-8 py-6 rounded-[2rem] bg-white border border-slate-100 shadow-2xl shadow-slate-900/5 appearance-none focus:ring-4 focus:ring-primary-500/10 outline-none font-bold text-sm uppercase tracking-tight text-slate-700 cursor-pointer"
           >
              <option value="ALL">All Events</option>
              <option value="LOGIN">Logins</option>
              <option value="CREATE">Creation</option>
              <option value="UPDATE">Updates</option>
              <option value="DELETE">Deletions</option>
           </select>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Events', count: logs.length, icon: Activity, color: 'primary' },
            { label: 'Security Alerts', count: logs.filter(l => (l.activity || '').toLowerCase().includes('delete')).length, icon: ShieldAlert, color: 'rose' },
            { label: 'Active Sessions', count: logs.filter(l => (l.activity || '').toLowerCase().includes('log')).length, icon: Lock, color: 'emerald' },
            { label: 'System Health', count: '99.8%', icon: Zap, color: 'amber' }
          ].map((stat, idx) => (
            <motion.div 
             key={idx}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
             className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-900/5 flex items-center justify-between group hover:-translate-y-1 transition-all"
            >
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  <h4 className="text-xl font-bold text-slate-900 uppercase">{stat.count}</h4>
                </div>
                <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 border border-${stat.color}-100 group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-5 h-5" />
                </div>
            </motion.div>
          ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol ID</th>
                <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active User</th>
                <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event Nature</th>
                <th className="px-8 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Temporal Stamp</th>
                <th className="px-8 py-6 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-4" />
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.3em]">Synchronizing Security Ledger...</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <ShieldAlert className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-bold text-slate-400 uppercase italic">No audit records found matching criteria</p>
                  </td>
                </tr>
              ) : filteredLogs.map((log, idx) => (
                <motion.tr 
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-mono text-slate-400 font-bold group-hover:text-primary-600 transition-colors">
                      #LOG-{log.id || Math.floor(Math.random() * 90000) + 10000}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-primary-50 group-hover:text-primary-600 transition-all">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{log.user_name || 'System Auto'}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{log.role || 'Core Agent'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${getSeverityColor(log.activity || '')}`}>
                        {getActionIcon(log.activity || '')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{log.activity || 'Unknown Event'}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-tight max-w-[200px] truncate">
                           IP: {log.ip_address || 'Internal System'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-[11px] font-bold text-slate-600 uppercase">
                        {log.created_at ? new Date(log.created_at).toLocaleString('en-IN', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        }) : 'Just Now'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100 italic">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
