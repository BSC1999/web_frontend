import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import {
  Download,
  Pill,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Prescription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const patientName = location.state?.patientName || 'Patient Record';
  const diagnosis = location.state?.diagnosis || 'General Consultation';
  const tooth = location.state?.tooth || 'Global';
  const selectedDrugs = location.state?.selectedDrugs || [];
  
  const doctorName = localStorage.getItem('user_full_name') || 'DENTA Operator';
  const date = new Date().toLocaleDateString();

  const [content, setContent] = useState(() => {
    let initial = localStorage.getItem('draft_prescription') || '';
    if (selectedDrugs.length > 0) {
      const drugText = selectedDrugs.map(d => `[RX] ${d.name}\n     Dose: ${d.dosage} | Freq: ${d.frequency}\n     ${d.instructions ? `Note: ${d.instructions}` : ''}`).join('\n\n');
      if (!initial.includes(selectedDrugs[0].name)) {
        initial = initial ? `${initial}\n\n---\n\n${drugText}` : drugText;
      }
    }
    return initial;
  });
  
  const handleFinalizePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    
    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(14, 165, 233); // Primary-600
    doc.text('DENTA AI', margin, 30);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text('PREMIUM CLINICAL DIAGNOSTIC SUITE', margin, 38);
    
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(margin, 45, 190, 45);
    
    // Practitioner Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text(`Dr. ${doctorName}`, margin, 60);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Registration: DENTA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, margin, 66);
    
    // Patient & Date Info
    doc.setDrawColor(241, 245, 249); // Slate-100
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.rect(130, 52, 60, 30, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('PATIENT IDENTIFIER', 135, 60);
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(patientName, 135, 65);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CLINICAL PROTOCOL', 135, 73);
    doc.setFontSize(9);
    doc.setTextColor(14, 165, 233); // Primary-600
    doc.text(`${diagnosis.substring(0, 25)} [Tooth #${tooth}]`, 135, 78);
    
    // Content (Rx)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bolditalic');
    doc.setTextColor(14, 165, 233);
    doc.text('Rx', margin, 90);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(30, 41, 59); // Slate-800
    
    // Split text to fit page width
    const splitText = doc.splitTextToSize(content || 'No treatment notes recorded.', 170);
    doc.text(splitText, margin, 105);
    
    // Footer / Signature
    const footerY = 250;
    doc.setDrawColor(226, 232, 240);
    doc.line(130, footerY - 10, 190, footerY - 10);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('AUTHENTICATED DIGITAL SIGNATURE', 130, footerY);
    
    doc.setFontSize(7);
    doc.setTextColor(203, 213, 225); // Slate-300
    doc.text('This document is a computer-generated clinical record from the DENTA AI Engine.', margin, 280);
    doc.text('Scan the QR code on the patient portal to verify integrity.', margin, 285);
    
    doc.save(`Prescription_${patientName.replace(/\s+/g, '_')}_${date}.pdf`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-10 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            <span className="text-primary-600">PRESCRIPTION</span>
          </h1>
          <p className="text-slate-500 font-bold text-sm">Clinical Rx Generation Engine for <span className="text-slate-900">{patientName}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleFinalizePDF} className="btn-primary px-10">
            <Download className="w-4 h-4" />
            Finalize PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-2 space-y-6">
           <div className="premium-card p-0 overflow-hidden min-h-[600px] flex flex-col bg-slate-50">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">DENTA Editor Active</span>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date}</span>
              </div>
              <textarea 
                className="flex-1 p-10 bg-transparent text-slate-800 text-lg leading-relaxed focus:outline-none custom-scrollbar placeholder-slate-400 font-medium italic"
                placeholder="R/&#10;Enter medication, dosage, instructions..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
                 <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Digital Signature Authenticated</p>
                 <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
              </div>
           </div>
        </div>

        {/* Support Side */}
        <div className="space-y-6">
          <div className="glass-morphism p-8 rounded-[2.5rem] border-slate-200 space-y-8">
             <div className="pt-2">
                <button 
                  onClick={() => navigate('/drug-recommendations')}
                  className="btn-secondary w-full py-4 bg-accent-50 border-accent-100 text-accent-600 hover:bg-accent-100"
                >
                   <Pill className="w-4 h-4" />
                   Review AI Suggestions
                </button>
             </div>
          </div>

          <div className="premium-card bg-amber-50 border-amber-100">
             <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">Conflict Warning</h4>
             <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                Ensure patient's <b>Penicillin Allergy</b> is considered if prescribing broad-spectrum antibiotics in this session.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescription;
