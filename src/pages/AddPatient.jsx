import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Phone, 
  Activity,
  Stethoscope
} from 'lucide-react';

const FormSection = ({ title, icon: Icon, children }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const AddPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_id: `${Math.floor(100000 + Math.random() * 900000)}`,
    name: '', 
    age: '', 
    gender: 'Male', 
    phone: '', 
    email: '', 
    address: '', 
    complaint: ''
  });

  const handleNext = (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      alert('Patient name must contain only alphabets.');
      return;
    }
    if (formData.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      alert('Please enter a valid @gmail.com email address.');
      return;
    }
    if (formData.patient_id.length !== 6) {
      alert('Patient ID must be exactly 6 digits.');
      return;
    }
    navigate('/medical-history', { state: { patientData: formData } });
  };

  return (
    <div className="relative space-y-12 pb-20 max-w-7xl mx-auto px-6">
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      {/* Background Decor */}
      <div className="absolute top-[-100px] left-[-150px] w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full -z-10"></div>
      <div className="absolute bottom-[10%] right-[-100px] w-[400px] h-[400px] bg-accent-500/5 blur-[130px] rounded-full -z-10"></div>

      {/* Step Indicator */}
      <div className="flex items-center gap-6">
        <div className="flex-1 h-3 rounded-full overflow-hidden bg-white border border-slate-100 shadow-sm">
          <div className="h-full bg-primary-600 w-1/2 rounded-full transition-all duration-700 shadow-lg shadow-primary-500/20"></div>
        </div>
        <p className="text-[11px] font-black text-primary-600 uppercase tracking-[0.3em] whitespace-nowrap">Step 01 <span className="text-slate-300">/</span> 02</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-10 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            New <span className="text-primary-600">Patient Registry</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm">Clinical Data Ingestion Gate</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 p-4 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-lg shadow-emerald-500/5">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Form Protocol Active</p>
        </div>
      </div>

      <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
        
        <form onSubmit={handleNext} className="space-y-12 relative z-10">
          <FormSection title="Identity Details" icon={User}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Legal Name</label>
              <input 
                type="text" 
                placeholder="Ex. Rahul Sharma" 
                className="input-field"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^[a-zA-Z\s]+$/.test(val)) {
                    setFormData({...formData, name: val});
                  }
                }}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Patient Number (6-digit)</label>
                  <input 
                    type="text" 
                    placeholder="XXXXXX" 
                    className="input-field bg-slate-100"
                    maxLength="6"
                    value={formData.patient_id}
                    onChange={(e) => setFormData({...formData, patient_id: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                    required
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Age</label>
                  <input 
                    type="number" 
                    placeholder="25" 
                    className="input-field"
                    min="1"
                    value={formData.age}
                    onChange={(e) => {
                       const val = e.target.value;
                       if (val === '' || parseInt(val) > 0) {
                         setFormData({...formData, age: val});
                       }
                    }}
                    required
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gender</label>
                  <select 
                    className="input-field appearance-none cursor-pointer"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
               </div>
            </div>
          </FormSection>

          <FormSection title="Contact Information" icon={Phone}>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mobile Number (10 digits)</label>
                <input 
                  type="tel" 
                  placeholder="98XXXXXXXX" 
                  className="input-field"
                  maxLength="10"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                  required
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="patient@example.ai" 
                  className="input-field lowercase"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value.toLowerCase()})}
                />
             </div>
             <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Residential Address</label>
                <textarea 
                  placeholder="Building, Street, Area, City..." 
                  className="input-field min-h-[100px] py-4"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
             </div>
          </FormSection>

          <FormSection title="DENTA Context" icon={Stethoscope}>
             <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Chief Complaint</label>
                <input 
                  type="text" 
                  placeholder="Ex. Acute pain in upper molar area" 
                  className="input-field"
                  value={formData.complaint}
                  onChange={(e) => setFormData({...formData, complaint: e.target.value})}
                  required
                />
             </div>
          </FormSection>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
             <button type="submit" className="btn-primary px-10 py-5 group">
                Diagnostic Intake
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
