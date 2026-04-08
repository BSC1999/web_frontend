import { useNavigate } from 'react-router-dom';
import { Code2, Globe, Share2 } from 'lucide-react';

const Integration = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16">
      <div className="max-w-6xl mx-auto space-y-16 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Seamless <br />
              <span className="gradient-text">Connectivity.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
              Integrate our advanced dental AI engine into your existing DENTA workflow with minimal overhead. Our RESTful API supports all major EHR and PACS systems.
            </p>
          </div>
          
          <div className="hidden lg:flex justify-center relative">
            <div className="aspect-square w-full max-w-sm rounded-[3rem] bg-slate-50 border border-slate-100 overflow-hidden group shadow-2xl flex items-center justify-center p-12 relative animate-pulse-slow">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent"></div>
              <img 
                src="/dental-logo.png" 
                alt="Dental AI Integration" 
                className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-110 relative z-10"
              />
              <div className="absolute bottom-8 left-0 right-0 text-center">
                 <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] opacity-40">DENTA Sync Protocol</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary-600">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase">Universal API</h3>
            <p className="text-sm text-slate-500 font-medium">Connect via standard HTTPS protocols with sub-100ms latency for real-time diagnostics.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary-600">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase">HL7/FHIR Support</h3>
            <p className="text-sm text-slate-500 font-medium">Full compatibility with international healthcare data exchange standards.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary-600">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 uppercase">SDK Modules</h3>
            <p className="text-sm text-slate-500 font-medium">Native libraries for Web, iOS, and Android for deep application embedding.</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-10 lg:p-16 text-slate-900 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 blur-[120px] rounded-full -mr-32 -mt-32"></div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight relative z-10">Quick Start <span className="text-primary-600">Snippet</span></h2>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 font-mono text-sm text-slate-700 relative z-10 shadow-sm">
            <pre className="custom-scrollbar overflow-x-auto">
{`const client = new DentalAIClient({
  apiKey: 'YOUR_SECURE_TOKEN',
  endpoint: 'v4.pathology.DENTA.ai'
});

const analysis = await client.analyzeXray(imageBuffer, {
  precision: 'high',
  detectPathologies: true
});

console.log('Detection Confidence:', analysis.confidence);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integration;
