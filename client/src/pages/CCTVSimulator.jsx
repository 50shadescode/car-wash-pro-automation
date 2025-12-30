import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Scan, CheckCircle2, AlertCircle, Loader2, User, ShieldCheck, Clock } from 'lucide-react';

const CCTVSimulator = () => {
  const [plate, setPlate] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [scanResult, setScanResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!plate) return;

    setStatus("scanning");
    try {
      const res = await axios.get(`http://localhost:5000/api/bookings/scan/${plate}`);
      
      // Simulate a small delay for "Processing" realism
      setTimeout(() => {
        setScanResult(res.data.booking);
        setStatus("success");
      }, 1200);
    } catch (err) {
      setStatus("error");
      setScanResult({ msg: err.response?.data?.msg || "Plate not found in database." });
    }
  };

  const closePortal = () => {
    setStatus("idle");
    setScanResult(null);
    setPlate("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col items-center justify-center font-mono">
      <div className="max-w-xl w-full">
        
        {/* Advanced Camera Viewport */}
        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-800 mb-8 shadow-[0_0_50px_rgba(0,0,0,1)]">
          {/* Grid Overlay for realism */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', size: '20px 20px' }} />
          
          <div className="absolute inset-0 flex items-center justify-center">
            {status === "scanning" ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <span className="text-blue-500 animate-pulse font-black tracking-widest text-xs">ANALYZING PIXELS...</span>
              </div>
            ) : (
              <Camera className="w-20 h-20 text-slate-800" />
            )}
          </div>
          
          {status === "scanning" && (
            <div className="absolute inset-x-0 h-1 bg-blue-500 shadow-[0_0_20px_#3b82f6] animate-scan-line top-0 z-10" />
          )}

          {/* Corner Decals */}
          <div className="absolute top-4 left-4 border-t-2 border-l-2 border-slate-500 w-8 h-8" />
          <div className="absolute top-4 right-4 border-t-2 border-r-2 border-slate-500 w-8 h-8" />
          <div className="absolute bottom-4 left-4 border-b-2 border-l-2 border-slate-500 w-8 h-8" />
          <div className="absolute bottom-4 right-4 border-b-2 border-r-2 border-slate-500 w-8 h-8" />
        </div>

        {/* Control Panel */}
        <div className="bg-[#111] border border-slate-800 p-8 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <Scan className="text-blue-500 w-5 h-5" />
            <h2 className="text-sm font-black tracking-[0.3em] uppercase">Security Interface</h2>
          </div>

          <form onSubmit={handleScan} className="space-y-6">
            <input 
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="ENTER PLATE" 
              className="w-full bg-black border border-slate-800 p-5 rounded font-black text-3xl text-center tracking-[0.5em] text-blue-500 outline-none focus:border-blue-500/50 transition-all"
            />

            <button 
              type="submit"
              disabled={status === "scanning"}
              className="w-full bg-white text-black py-5 rounded font-black hover:bg-blue-500 hover:text-white transition-all active:scale-95 disabled:opacity-20 uppercase tracking-widest"
            >
              Initiate Search
            </button>
          </form>
        </div>

        {/* 🛡️ THE SUCCESS MODAL (High-End Overlay) */}
        {status === "success" && scanResult && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[200] p-4">
            <div className="max-w-md w-full border-t-4 border-emerald-500 bg-[#0a0a0a] p-10 rounded-b-xl shadow-[0_0_100px_rgba(16,185,129,0.1)] animate-in zoom-in duration-300">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter uppercase">Identity Verified</h2>
                <div className="h-1 w-12 bg-emerald-500 mt-2" />
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Customer</span>
                  <span className="font-bold text-slate-200">{scanResult.customerName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Plate ID</span>
                  <span className="font-bold text-blue-500">{scanResult.licensePlate}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Authorized Service</span>
                  <span className="font-bold text-slate-200">{scanResult.service}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System Status</span>
                  <span className="text-emerald-500 font-black animate-pulse">MARKED AS ARRIVED</span>
                </div>
              </div>

              <button 
                onClick={closePortal}
                className="w-full py-4 bg-emerald-600 font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all rounded shadow-lg shadow-emerald-900/20"
              >
                Clear Feed & Reset
              </button>
            </div>
          </div>
        )}

        {/* ERROR POPUP */}
        {status === "error" && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
            <div className="max-w-sm w-full bg-[#111] border border-red-500/30 p-8 rounded-xl text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="font-black uppercase mb-2">Access Denied</h3>
              <p className="text-slate-500 text-sm mb-6">{scanResult.msg}</p>
              <button onClick={closePortal} className="text-xs font-black uppercase text-red-500 hover:text-red-400">Try Again</button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan-line { animation: scan 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default CCTVSimulator;