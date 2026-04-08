import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  MoreVertical,
  Zap,
  X,
  CheckCircle2,
  Loader2,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentCard = ({ patient, time, type, status, doctor, id }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/patient/${id}`)}
      className="premium-card group transition-all px-10 py-8 cursor-pointer hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-500/10 active:scale-[0.98] relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl border ${
            status === 'High Priority' ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' : 'bg-primary-500/10 border-primary-500/20 text-primary-600'
          }`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight leading-none">{time}</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{type}</p>
          </div>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
          status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
        }`}>
          {status}
        </span>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 text-lg uppercase italic group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
            {patient[0]}{patient.split(' ')[1]?.[0] || patient[1]?.toUpperCase() || ''}
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1">Patient Name</p>
            <h4 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{patient}</h4>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 mt-4 group-hover:bg-white transition-colors">
          <div className="flex items-center gap-3">
             <User className="w-4 h-4 text-slate-500" />
             <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">
               {String(doctor).startsWith('Dr.') ? doctor : `Dr. ${doctor}`}
             </p>
          </div>
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Ref: {id}</p>
        </div>
      </div>
      
      {/* Visual Indicator of interactivity */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

// Book Slot Modal
const BookSlotModal = ({ onClose, onBook, userName }) => {
  const TIME_SLOTS = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:30 PM - 02:30 PM',
    '02:30 PM - 03:30 PM',
    '03:30 PM - 04:30 PM'
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const fetchPats = async () => {
      try {
        const resp = await apiService.get('api/patients/');
        setPatients(resp.data);
      } catch (e) { console.error(e); }
      finally { setLoadingPatients(false); }
    };
    fetchPats();
  }, []);

  // Fetch booked slots whenever date changes
  useEffect(() => {
    const fetchBooked = async () => {
      if (!selectedDate) return;
      setLoadingSlots(true);
      setSelectedTime('');
      try {
        const res = await apiService.get(`api/patients/booked_slots/?date=${selectedDate}`);
        setBookedSlots(res.data.booked_slots || []);
      } catch { setBookedSlots([]); }
      finally { setLoadingSlots(false); }
    };
    fetchBooked();
  }, [selectedDate]);

  const filtered = patients.filter(p =>
    (p.full_name || p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayDate = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  const handleBook = async () => {
    if (!selectedPatient || !selectedTime || !selectedDate) return;
    setBooking(true);
    try {
      await apiService.post('api/patients/set_schedule/', {
        patient_id: selectedPatient.patient_id || selectedPatient.id,
        date: selectedDate,
        time: selectedTime,
        doctor: userName
      });
      setBooked(true);
      setTimeout(() => { onBook(); onClose(); }, 1500);
    } catch (err) {
      console.error('Booking error:', err);
      setBooking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden z-10"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tight">Book Clinical Slot</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Select patient and time window</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Patient Picker */}
          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 block">Select Patient</label>
            <div className="relative mb-3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="input-field pl-11 py-3 text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {loadingPatients ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {filtered.map(p => (
                  <button
                    key={p.patient_id || p.id}
                    onClick={() => setSelectedPatient(p)}
                    className={`w-full flex items-center gap-4 p-3 rounded-2xl border text-left transition-all ${
                      selectedPatient?.patient_id === p.patient_id || selectedPatient?.id === p.id
                        ? 'bg-primary-50 border-primary-200'
                        : 'bg-slate-50 border-slate-100 hover:border-primary-100'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-black uppercase text-sm italic shrink-0">
                      {(p.full_name || p.name || '?')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 uppercase truncate">{p.full_name || p.name}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest">ID: {p.patient_id || p.id}</p>
                    </div>
                    {(selectedPatient?.patient_id === p.patient_id || selectedPatient?.id === p.id) && (
                      <CheckCircle2 className="w-4 h-4 text-primary-600 shrink-0" />
                    )}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-4 italic">No patients found</p>
                )}
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 block">Select Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="input-field pl-11 py-3 text-sm font-bold cursor-pointer"
              />
            </div>
            {selectedDate && <p className="text-[9px] text-primary-600 font-black uppercase tracking-widest mt-1 ml-1">{displayDate}</p>}
          </div>

          {/* Time Picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Select Time Slot</label>
              {loadingSlots && <Loader2 className="w-3 h-3 animate-spin text-primary-400" />}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(slot => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    onClick={() => !isBooked && setSelectedTime(slot)}
                    disabled={isBooked || loadingSlots}
                    className={`py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all relative ${
                      isBooked
                        ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                        : isSelected
                          ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20'
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-primary-200 hover:bg-primary-50'
                    }`}
                  >
                    {slot}
                    {isBooked && <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />}
                  </button>
                );
              })}
            </div>
            {bookedSlots.length > 0 && (
              <p className="text-[8px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                <span className="inline-block w-2 h-2 rounded-full bg-rose-400 mr-1" />
                {bookedSlots.length} slot{bookedSlots.length > 1 ? 's' : ''} already booked for this date
              </p>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-slate-100">
          <button
            onClick={handleBook}
            disabled={!selectedPatient || !selectedTime || !selectedDate || booking || booked}
            className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 ${
              selectedPatient && selectedTime && selectedDate && !booking && !booked
                ? 'bg-slate-900 text-white hover:bg-primary-600 shadow-2xl shadow-primary-500/10'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {booked ? (
              <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Slot Confirmed</>
            ) : booking ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
            ) : (
              <><Plus className="w-4 h-4" /> Confirm Slot</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('Today');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const userName = localStorage.getItem('user_full_name') || '';

  // Live clock auto-updating
  const [now, setNow] = useState(new Date());
  const clockRef = useRef(null);

  useEffect(() => {
    // Update clock every minute so the date stays current
    clockRef.current = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(clockRef.current);
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('api/patients/today_schedule/');
      const mappedData = response.data.map(p => ({
        id: p.id,
        patient_id: p.patient_id,
        patient: p.name,
        time: p.next_schedule_time || 'TBD',
        type: p.complaint || 'Dental Consultation',
        status: p.treatment_payment_info?.includes('Urgent') ? 'High Priority' : 'Confirmed',
        doctor: p.assigned_doctor_name || 'General'
      }));
      setAppointments(mappedData);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Today') {
      fetchAppointments();
    } else {
      setAppointments([]);
      setLoading(false);
    }
  }, [activeTab, userName]);

  // Format today's date
  const todayStr = now.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Synchronizing Clinical Schedule...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-12 pb-20">
      <div className="absolute top-[-50px] right-[-100px] w-[400px] h-[400px] bg-primary-500/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-[10%] left-[-150px] w-[500px] h-[500px] bg-accent-500/5 blur-[150px] rounded-full -z-10"></div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] border border-primary-100">Scheduler</div>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Global <span className="text-primary-600">Schedule.</span></h1>
            <div className="w-16 h-16 rounded-3xl bg-primary-600 shadow-xl shadow-primary-500/20 flex items-center justify-center -rotate-6">
               <CalendarIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          {/* Real-time date display */}
          <p className="text-slate-500 font-medium italic">
            <span className="text-slate-900 font-black uppercase tracking-tight">{todayStr}</span>
            {' · '}Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass-morphism rounded-2xl p-1 flex items-center">
             {['Today', 'Upcoming', 'History'].map(tab => (
               <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-slate-700'
                }`}
               >
                {tab}
               </button>
             ))}
          </div>
          <button onClick={() => setShowBookModal(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            Book Slot
          </button>
        </div>
      </div>

      {/* Grid - Expanded width for better detail visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {appointments.length > 0 ? (
          appointments.map((app, idx) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <AppointmentCard {...app} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass-morphism rounded-[3rem] border-dashed border-2 border-slate-100">
             <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-bold italic">No appointments scheduled for {activeTab === 'Today' ? 'today' : 'this period'}.</p>
             <button 
               onClick={() => setShowBookModal(true)}
               className="mt-6 px-8 py-3 rounded-2xl bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all"
             >
               + Book First Slot
             </button>
          </div>
        )}
      </div>

      {/* Capacity Footer */}
      <div className="premium-card bg-primary-50/50 flex flex-col md:flex-row items-center justify-between gap-6 border-primary-100">
         <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
               <Zap className="w-6 h-6" />
            </div>
            <div>
               <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Operational Capacity</h4>
               <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Current Slot Utilization: <span className="text-primary-600">{appointments.length > 0 ? Math.min(100, Math.round((appointments.length / 18) * 100)) : 0}%</span></p>
            </div>
         </div>
         <button onClick={() => setShowBookModal(true)} className="btn-secondary whitespace-nowrap px-8">
            + New Appointment
         </button>
      </div>

      {/* Book Slot Modal */}
      <AnimatePresence>
        {showBookModal && (
          <BookSlotModal
            onClose={() => setShowBookModal(false)}
            onBook={() => fetchAppointments()}
            userName={userName}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appointments;
