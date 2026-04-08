import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Upload,
  Scan,
  User,
  Phone,
  FileText,
  Activity,
  ChevronRight,
  X,
  CheckCircle2,
  Loader2,
  Search,
  Image as ImageIcon,
  Zap,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService, { BASE_URL } from '../services/apiService';

import BookSlotModal from '../components/BookSlotModal';

// ── Main Component ─────────────────────────────────────────────────────────────
const PatientDetail = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const role = localStorage.getItem('user_role') || 'Dental Doctor';

  const [patient, setPatient] = useState(null);
  const [xrays, setXrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mawa, use direct lookup (handles both UUID and Patient ID)
      const pRes = await apiService.get(`api/patients/${patientId}/`);
      const patientData = pRes.data;
      
      setPatient(patientData);
      
      // Mawa, use xrays embedded in the patient serializer object
      setXrays(patientData.xrays || []);
    } catch (err) {
      console.error('Error fetching patient detail:', err);
      if (err.response && err.response.status === 404) {
        setError('Clinical identifier not discovered in active database.');
      } else {
        setError('Synchronizing node error. Please check connectivity.');
      }
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [patientId]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !patient) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const uploadId = patient.patient_id || patient.id;
      await apiService.post(`api/patients/${uploadId}/upload-xray/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 2000);
      await fetchData();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (xray) => {
    setAnalyzingId(xray.id);
    try {
      navigate('/analysis', {
        state: {
          imageId: xray.id,
          patientId: patient.patient_id,
          patientName: patient.name,
          imageUrl: xray.image?.startsWith('http') ? xray.image : `${BASE_URL.replace(/\/$/, '')}${xray.image?.startsWith('/') ? '' : '/'}${xray.image}`
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
        <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Loading Clinical Record...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Service Disturbance</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-[280px] leading-relaxed">
            {error || 'The patient record could not be localized within the active clinical database.'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/patients')}
          className="btn-secondary px-8 py-4 text-[10px]"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 pt-6">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{patient.name}</h1>
        </div>
        <button onClick={() => setShowBookModal(true)} className="btn-primary hidden sm:flex">
          <Calendar className="w-4 h-4" />
          Book Slot
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/3 p-8 space-y-6">
            <div>
              <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest">{patient.assigned_doctor_name || 'General Clinical'}</p>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-100">
              {[
                { icon: User, label: 'Age / Gender', value: `${patient.age || 'N/A'} Yrs · ${patient.gender || 'N/A'}` },
                { icon: Phone, label: 'Contact', value: patient.phone || 'Not Provided' },
                { icon: FileText, label: 'Complaint', value: patient.complaint || 'General Consultation' },
                { icon: Activity, label: 'Status', value: patient.status || 'Active' },
                { icon: Clock, label: 'Last Visit', value: patient.last_visit_date || 'N/A' },
                { 
                  icon: Calendar, 
                  label: 'Next Schedule', 
                  value: patient.next_schedule_date ? `${patient.next_schedule_date} at ${patient.next_schedule_time || 'TBD'}` : 'Not scheduled',
                  isFuture: (() => {
                    if (!patient.next_schedule_date) return true;
                    try {
                      const today = new Date();
                      const [year, month, day] = patient.next_schedule_date.split('-').map(Number);
                      const schedDate = new Date(year, month - 1, day);
                      if (patient.next_schedule_time) {
                        const [time, modifier] = patient.next_schedule_time.split(' ');
                        let [hours, minutes] = time.split(':').map(Number);
                        if (modifier === 'PM' && hours < 12) hours += 12;
                        if (modifier === 'AM' && hours === 12) hours = 0;
                        schedDate.setHours(hours, minutes, 0, 0);
                      }
                      return schedDate > today;
                    } catch (e) { return true; }
                  })()
                }
              ].filter(item => item.label !== 'Next Schedule' || item.isFuture).map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
                    <p className="text-xs font-bold text-slate-900 uppercase">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setShowBookModal(true)} className="btn-primary w-full sm:hidden">
            <Calendar className="w-4 h-4" /> Book Appointment Slot
          </button>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-8">
          <label className={`flex items-center justify-center gap-5 p-8 rounded-[2.5rem] border-2 border-dashed cursor-pointer transition-all group relative overflow-hidden ${
            uploading ? 'border-primary-300 bg-primary-50/40' : 'border-slate-200 hover:border-primary-300 hover:bg-primary-50/20'
          }`}>
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
            <div className="absolute inset-0 bg-primary-400/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            {uploading ? (
              <><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /><span className="text-[11px] font-bold text-primary-600 uppercase tracking-widest">Uploading X-ray...</span></>
            ) : uploadSuccess ? (
              <><CheckCircle2 className="w-8 h-8 text-emerald-500" /><span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Upload Successful!</span></>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 group-hover:bg-primary-600 group-hover:border-primary-600 group-hover:text-white text-slate-400 transition-all shadow-sm">
                  <Upload className="w-7 h-7" />
                </div>
                <div className="relative z-10 text-left">
                  <span className="block text-sm font-bold text-slate-900 uppercase tracking-tight">Upload Xray</span>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest">Click to access file manager · Saved to backend</span>
                </div>
              </>
            )}
          </label>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Clinical Xray Archive</h3>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{xrays.length} image{xrays.length !== 1 ? 's' : ''}</span>
            </div>

            {xrays.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 rounded-[2.5rem] bg-slate-50 border border-dashed border-slate-200 gap-4">
                <ImageIcon className="w-12 h-12 text-slate-200" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No X-ray scans uploaded yet</p>
                <label className="btn-secondary cursor-pointer">
                  <Upload className="w-4 h-4" /> Upload First Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {xrays.map((xray, idx) => {
                  const imgSrc = xray.image?.startsWith('http') ? xray.image : `${BASE_URL.replace(/\/$/, '')}${xray.image?.startsWith('/') ? '' : '/'}${xray.image}`;
                  return (
                    <motion.div
                      key={xray.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden group"
                    >
                      <div className="aspect-video relative overflow-hidden bg-slate-900">
                        <img src={imgSrc} alt={`X-ray ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="w-full">
                            <div className="h-0.5 w-full bg-primary-400/40 relative overflow-hidden">
                              <div className="absolute inset-y-0 left-0 bg-primary-400 w-1/3 shadow-[0_0_8px_rgba(14,165,233,0.8)] animate-scan" />
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/60 text-white text-[8px] font-bold uppercase tracking-widest">
                          X-ray #{idx + 1}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Uploaded</p>
                            <p className="text-xs font-bold text-slate-900">{xray.uploaded_at ? new Date(xray.uploaded_at).toLocaleDateString('en-IN') : 'N/A'}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">Stored</span>
                        </div>
                        {!(role === 'Dental Assistant' || role === 'Assistant') && (
                          <button
                            onClick={() => handleAnalyze(xray)}
                            disabled={analyzingId === xray.id}
                            className="w-full py-3.5 rounded-2xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/10 active:scale-95"
                          >
                            {analyzingId === xray.id ? (
                              <><Loader2 className="w-4 h-4 animate-spin" /> Initializing...</>
                            ) : (
                              <><Zap className="w-4 h-4" /> Run AI Analysis</>
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showBookModal && (
          <BookSlotModal
            patient={patient}
            onClose={() => setShowBookModal(false)}
            onBooked={() => fetchData()}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientDetail;
