import { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  UserPlus, 
  ChevronRight, 
  MoreVertical,
  Download,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../services/apiService';
import { Loader2 } from 'lucide-react';

const PatientCard = ({ name, id, patientId, age, gender, status, lastVisit, assignedDoctor, navigate, role }) => (
  <div 
    className="group premium-card hover:bg-slate-50 transition-all p-5 cursor-pointer"
    onClick={() => navigate(`/patient/${patientId}`)}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-primary-600 border border-slate-100 uppercase italic">
          {name[0]}
          {name.split(' ')[1]?.[0]}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{name}</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {id}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary-600 transition-colors group-hover:translate-x-0.5" />
    </div>

    <div className="grid grid-cols-3 gap-2 mb-6">
      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Age</p>
        <p className="text-xs font-bold text-slate-900 uppercase">{age} Yrs</p>
      </div>
      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Gender</p>
        <div className="flex items-center gap-1">
          {gender === 'Male' ? <div className="w-2 h-2 rounded-full bg-primary-600" /> : <div className="w-2 h-2 rounded-full bg-rose-500" />}
          <p className="text-xs font-bold text-slate-900 uppercase">{gender}</p>
        </div>
      </div>
      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Status</p>
        <p className={`text-[10px] font-black uppercase tracking-tight ${
          status === 'Active' ? 'text-primary-600' : 'text-amber-600'
        }`}>{status}</p>
      </div>
      <div className="bg-primary-50 p-2 rounded-xl border border-primary-100 flex-1 col-span-3">
        <p className="text-[8px] text-primary-400 font-black uppercase tracking-widest mb-1">Practitioner</p>
        <p className="text-[10px] font-black text-primary-600 uppercase tracking-tight italic">
          {assignedDoctor || 'General clinical'}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
      <Clock className="w-3 h-3 text-slate-400" />
      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Last Visit: {lastVisit}</p>
    </div>
  </div>
);

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const role = localStorage.getItem('user_role') || 'Dental Doctor';

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await apiService.get('api/patients/');
        setPatients(response.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => 
    (patient.name || patient.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.id_number || patient.id || '').toString().includes(searchTerm)
  );

  return (
    <div className="relative space-y-12 pb-20">
      {/* Background Decor */}
      <div className="absolute top-[-50px] left-[-100px] w-[400px] h-[400px] bg-primary-500/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute top-[20%] right-[-100px] w-[500px] h-[500px] bg-accent-500/5 blur-[150px] rounded-full -z-10"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] border border-primary-100 italic">Database</div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border italic ${
              role === 'Dental Doctor' || role === 'Doctor' 
                ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' 
                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {role === 'Dental Doctor' || role === 'Doctor' ? 'My Registry' : 'Global Registry'}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">Patient <span className="text-primary-600">Registry.</span></h1>
          <p className="text-slate-500 font-medium text-lg italic">
            {role === 'Dental Doctor' || role === 'Doctor' 
              ? 'Monitoring your personal clinical database and patient history.' 
              : 'Managing the centralized DENTA Patient database and global records.'}
          </p>
        </div>
        <div className="flex items-center gap-3">

          {role !== 'Admin' && (
            <button 
              onClick={() => navigate('/add-patient')}
              className="btn-primary"
            >
              <UserPlus className="w-5 h-5" />
              Add Patient
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search patients"
            className="input-field pl-14 py-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="px-8 py-4 rounded-2xl bg-primary-50 border border-primary-100 text-primary-600 font-black uppercase tracking-widest hover:bg-primary-100 transition-all text-xs">
            Recent
          </button>
          <button className="px-8 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 transition-all text-xs">
            All
          </button>
        </div>
      </div>

      {/* Patient Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
           <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Accessing Registry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient, idx) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
            <PatientCard 
                name={patient.full_name || patient.name || 'Unknown'} 
                id={patient.id_number || patient.patient_id} 
                patientId={patient.id}
                age={patient.age || 'N/A'} 
                gender={patient.gender || 'N/A'} 
                status={patient.status || 'Active'} 
                lastVisit={patient.last_visit_date || 'N/A'}
                assignedDoctor={patient.assigned_doctor_name}
                navigate={navigate}
                role={role}
              />
            </motion.div>
          ))}
          {filteredPatients.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-30">
               <p className="text-sm font-black uppercase tracking-widest text-slate-500 italic">No matching records found in database</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination Placeholder */}
      <div className="pt-10 flex items-center justify-between border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Showing {filteredPatients.length} of {patients.length} patients</p>
        <div className="flex items-center gap-2">
          <button className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary-600 disabled:opacity-30" disabled>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
          <button className="p-3 rounded-xl bg-primary-600 text-white border border-primary-500/20 shadow-lg shadow-primary-500/20">
            1
          </button>
          <button className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary-600">
            2
          </button>
          <button className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-primary-600">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Patients;
