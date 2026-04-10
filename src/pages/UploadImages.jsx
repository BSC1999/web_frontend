import { useState, useEffect } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Camera
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiService, { BASE_URL } from '../services/apiService';
import { Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const UploadImages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const patientId = location.state?.patientId || '12345';
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [recentXrays, setRecentXrays] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        preview: URL.createObjectURL(file),
        rawFile: file,
        status: 'Ready'
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const fetchRecent = async () => {
    try {
      const res = await apiService.get('api/xrays/');
      const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setRecentXrays(data.slice(0, 6)); // Show last 6
    } catch (err) {
      console.error('Error fetching recent xrays:', err);
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', files[0].rawFile);
      const response = await apiService.post(`api/patients/${patientId}/upload-xray/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Mawa, refresh recent gallery after upload
      await fetchRecent();
      
      const imageId = response.data.image_id || response.data.id;
      const imageUrl = response.data.url
        ? (response.data.url.startsWith('http') ? response.data.url : `${BASE_URL.replace(/\/$/, '')}${response.data.url}`)
        : files[0].preview;
        
      navigate('/analysis', {
        state: {
          imageId,
          patientId,
          imageUrl,
          ai_analysis: response.data.ai_analysis || null,
          patientName: response.data.patient_name || ''
        }
      });
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="relative space-y-12 pb-20 max-w-7xl mx-auto px-6">
      <div className="absolute top-[-100px] left-[-150px] w-[500px] h-[500px] bg-primary-500/5 blur-[150px] rounded-full -z-10"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">
            X-ray & <span className="text-primary-600">Image Upload</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm">Clinical Diagnostic Gateway</p>
        </div>
      </div>

      <div className="space-y-12">
        {/* Upload Section */}
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex justify-center">
            <label className="w-full h-24 rounded-[2rem] bg-primary-600 text-white font-black uppercase tracking-[0.2em] italic flex items-center justify-center gap-4 hover:translate-y-[-2px] transition-all shadow-2xl shadow-primary-500/20 active:scale-95 cursor-pointer border-4 border-white/10 group overflow-hidden relative">
              <div className="absolute inset-0 bg-primary-400/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <Upload className="w-8 h-8 relative z-10" />
              <div className="text-left relative z-10">
                <span className="block text-lg leading-none mb-1">Upload Xray</span>
                <span className="block text-[8px] font-bold text-primary-200 tracking-widest opacity-60">ACCESS NATIVE FILE SYSTEM</span>
              </div>
              <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
            </label>
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-6 border-primary-100 bg-primary-50/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Pending Upload</h3>
                  <button onClick={() => setFiles([])} className="text-slate-400 hover:text-rose-500"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md">
                    <img src={files[0].preview} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900 uppercase truncate">{files[0].name}</p>
                    <p className="text-[10px] text-primary-600 font-black uppercase tracking-widest">{files[0].status}</p>
                  </div>
                  <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="px-6 py-3 rounded-xl bg-primary-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary-500/20 active:scale-95"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sync Now"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gallery Section */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Recently Uploaded Images</h2>
            {loadingRecent && <Loader2 className="w-4 h-4 animate-spin text-primary-600" />}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentXrays.map((xray, idx) => {
              const imgSrc = xray.image?.startsWith('http') ? xray.image : `${BASE_URL.replace(/\/$/, '')}${xray.image}`;
              return (
                <motion.div 
                  key={xray.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/patient/${xray.patient}`)}
                  className="aspect-video rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden group hover:border-primary-200 transition-all cursor-pointer relative"
                >
                  <img src={imgSrc} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt="Xray" />
                  <div className="absolute inset-0 bg-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[8px] font-black text-white uppercase tracking-widest bg-slate-900/60 px-2 py-1 rounded-lg">View Patient</span>
                  </div>
                </motion.div>
              );
            })}
            {!loadingRecent && recentXrays.length === 0 && (
              <div className="col-span-full py-16 text-center opacity-30 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                <p className="text-[10px] font-black uppercase tracking-widest">No recent scans found in clinical archive</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadImages;
