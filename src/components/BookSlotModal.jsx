import { useState, useEffect } from 'react';
import { Calendar, X, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import apiService from '../services/apiService';

const BookSlotModal = ({ patient, onClose, onBooked }) => {
  const TIME_SLOTS = [
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:30 PM - 02:30 PM',
    '02:30 PM - 03:30 PM',
    '03:30 PM - 04:30 PM'
  ];

  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooked = async () => {
      if (!selectedDate) return;
      setLoadingSlots(true);
      setSelectedTime('');
      try {
        const res = await apiService.get(`api/patients/booked_slots/?date=${selectedDate}`);
        setBookedSlots(res.data.booked_slots || []);
      } catch {
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchBooked();
  }, [selectedDate]);

  const handleBook = async () => {
    if (!selectedTime || !selectedDate) return;
    setBooking(true);
    setError('');
    try {
      await apiService.post('api/patients/set_schedule/', {
        patient_id: patient.patient_id,
        date: selectedDate,
        time: selectedTime
      });
      setBooked(true);
      setTimeout(() => { onBooked && onBooked(); onClose(); }, 1500);
    } catch (err) {
      setError('Failed to book slot. Please try again.');
      setBooking(false);
    }
  };

  const displayDate = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden z-10"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Book Appointment</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{patient.name || 'Clinical Patient'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 block">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="input-field pl-11 py-3 text-sm font-bold cursor-pointer border border-slate-200 rounded-xl w-full"
              />
            </div>
            {selectedDate && (
              <p className="text-[9px] text-primary-600 font-bold uppercase tracking-widest mt-1 ml-1">{displayDate}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Select Time Slot</label>
              {loadingSlots && <Loader2 className="w-3 h-3 animate-spin text-primary-400" />}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(slot => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = selectedTime === slot;
                
                if (selectedDate === todayStr) {
                  const [timeArr, modifier] = slot.split(' ');
                  let [hours, minutes] = timeArr.split(':').map(Number);
                  if (modifier === 'PM' && hours < 12) hours += 12;
                  if (modifier === 'AM' && hours === 12) hours = 0;
                  const slotDate = new Date();
                  slotDate.setHours(hours, minutes, 0, 0);
                  if (slotDate < new Date()) return null;
                }

                return (
                  <button
                    key={slot}
                    onClick={() => !isBooked && setSelectedTime(slot)}
                    disabled={isBooked || loadingSlots}
                    className={`py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all relative ${
                      isBooked
                        ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                        : isSelected
                          ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20'
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-primary-200 hover:bg-primary-50'
                    }`}
                  >
                    {slot}
                    {isBooked && (
                      <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
                    )}
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

          {error && <p className="text-[10px] text-rose-500 font-bold uppercase">{error}</p>}
        </div>

        <div className="px-8 pb-8">
          <button
            onClick={handleBook}
            disabled={!selectedTime || !selectedDate || booking || booked}
            className={`w-full py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all ${
              selectedTime && selectedDate && !booking && !booked
                ? 'bg-slate-900 text-white hover:bg-primary-600 shadow-2xl shadow-primary-500/10'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {booked ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Slot Confirmed!</> :
             booking ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> :
             <><Calendar className="w-4 h-4" /> Confirm Slot</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookSlotModal;
