import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Play, CheckCircle, Clock, Plus, User, Car as CarIcon, 
  DollarSign, Loader2, X, Phone, Info 
} from 'lucide-react';

const StaffDashboard = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);
  const [staffName, setStaffName] = useState("Staff Member");
  
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [walkInData, setWalkInData] = useState({
    customerName: '',
    licensePlate: '',
    phone: '',
    service: 'Basic Wash',
    vehicleType: 'Sedan',
    totalPrice: 800,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // 🔄 Wrapped in useCallback to prevent unnecessary re-renders during polling
  const fetchBookings = useCallback(async (isAutoRefresh = false) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter for jobs that are arrived, pending, or in-progress
      const queue = res.data.filter(job => job.status !== 'completed');
      
      setActiveJobs(queue);
      if (!isAutoRefresh) setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      if (!isAutoRefresh) setLoading(false);
    }
  }, []);

  // 📡 THE AUTO-REFRESH (POLLING) EFFECT
  useEffect(() => {
    fetchBookings(); // Initial fetch
    
    const storedName = localStorage.getItem('userName');
    if (storedName) setStaffName(storedName);

    // Set an interval to fetch data every 5 seconds
    const interval = setInterval(() => {
      fetchBookings(true); // true indicates this is an auto-refresh
    }, 5000);

    // 🧹 Cleanup: stop the interval when staff logs out or leaves page
    return () => clearInterval(interval);
  }, [fetchBookings]);

  useEffect(() => {
    let interval;
    if (isTiming) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTiming]);

  const handleServiceChange = (serviceName) => {
    let price = 800;
    if (serviceName === 'Executive Wash') price = 1500;
    if (serviceName === 'Full Detail') price = 3000;
    setWalkInData({ ...walkInData, service: serviceName, totalPrice: price });
  };

  const submitWalkIn = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bookings', walkInData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowWalkInModal(false);
      fetchBookings();
    } catch (err) {
      alert("Error adding walk-in");
    }
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const staffEmail = localStorage.getItem('userEmail');

      await axios.put(`http://localhost:5000/api/bookings/${jobId}`, 
        { 
          status: newStatus,
          assignedTo: newStatus === 'completed' ? staffEmail : null 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (newStatus === 'in-progress') {
        setIsTiming(true);
      } else if (newStatus === 'completed') {
        setIsTiming(false);
        setTimer(0);
      }
      fetchBookings();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">Staff Dashboard</h1>
            <p className="text-slate-400 font-medium italic">Welcome back, <span className="text-blue-400 font-bold">{staffName}</span></p>
          </div>
          <button 
            onClick={() => setShowWalkInModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-5 h-5" /> Quick-Add Walk-in
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Queue */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-blue-400" /> Active Queue ({activeJobs.length})
            </h2>
            
            {activeJobs.length === 0 ? (
              <div className="p-20 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem] text-slate-600">
                <CarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">Queue is currently empty</p>
              </div>
            ) : (
              activeJobs.map(job => (
                <div key={job._id} className={`p-6 rounded-[2rem] border-2 transition-all duration-300 ${job.status === 'in-progress' ? 'border-blue-600 bg-blue-600/5' : job.status === 'arrived' ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800 bg-slate-800/40'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${job.status === 'arrived' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-400/10 text-blue-400'}`}>
                        Plate: {job.licensePlate}
                      </span>
                      <h3 className="text-2xl font-black mt-2">{job.customerName}</h3>
                      <div className="flex items-center gap-3 mt-1 text-slate-400 font-bold text-sm italic">
                        <CarIcon className="w-4 h-4" /> {job.service || job.serviceType}
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === 'in-progress' ? 'bg-blue-600 text-white animate-pulse' : job.status === 'arrived' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    {job.status === 'pending' || job.status === 'arrived' ? (
                      <button onClick={() => updateJobStatus(job._id, 'in-progress')} className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                        <Play className="w-4 h-4" /> Start Wash
                      </button>
                    ) : (
                      <button onClick={() => updateJobStatus(job._id, 'completed')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
                        <CheckCircle className="w-4 h-4" /> Complete Job
                      </button>
                    )}
                    <button onClick={() => setSelectedJob(job)} className="px-6 bg-slate-700 hover:bg-slate-600 rounded-2xl font-black text-xs uppercase transition-all">Details</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-[2.5rem] p-8 border border-slate-700/50 text-center shadow-2xl">
              <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Current Job Timer</h3>
              <div className="text-6xl font-mono font-black text-blue-500 tracking-tighter mb-2">
                {formatTime(timer)}
              </div>
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Efficiency Tracking Active</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/20 border border-white/10">
              <h3 className="font-black text-sm uppercase tracking-widest mb-6 border-b border-white/20 pb-2">Operational Insights</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-100 uppercase">Wait Time</span>
                  <span className="text-2xl font-black italic">~15m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-100 uppercase">Daily Score</span>
                  <span className="text-2xl font-black text-emerald-300">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals remain the same... */}
        {showWalkInModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
             {/* Walk-in Form UI */}
             <form onSubmit={submitWalkIn} className="bg-slate-800 border border-slate-700 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter">New Walk-in</h2>
                <button type="button" onClick={() => setShowWalkInModal(false)} className="bg-slate-700 p-2 rounded-full text-slate-400 hover:text-white transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Customer Name</label>
                  <input required type="text" placeholder="Full Name" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl focus:outline-none focus:border-blue-500"
                    onChange={(e) => setWalkInData({...walkInData, customerName: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Plate Number</label>
                    <input required placeholder="KDA 123X" className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl focus:outline-none focus:border-blue-500 uppercase font-mono"
                      onChange={(e) => setWalkInData({...walkInData, licensePlate: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service</label>
                    <select className="w-full bg-slate-900 border border-slate-700 p-4 rounded-2xl focus:outline-none focus:border-blue-500"
                      onChange={(e) => handleServiceChange(e.target.value)}>
                      <option>Basic Wash</option>
                      <option>Executive Wash</option>
                      <option>Full Detail</option>
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black transition-all shadow-xl">Add to Queue</button>
            </form>
          </div>
        )}

        {selectedJob && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            {/* Details UI */}
             <div className="bg-slate-800 border border-slate-700 p-8 rounded-[2.5rem] max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Info className="text-blue-500" /> Wash Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Customer</span><span className="font-black">{selectedJob.customerName}</span></div>
                <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Plate</span><span className="font-black text-blue-400 font-mono tracking-widest">{selectedJob.licensePlate}</span></div>
                <div className="flex justify-between border-b border-slate-700 pb-2"><span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Phone</span><span className="font-black">{selectedJob.phone || 'N/A'}</span></div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="w-full mt-8 bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Close Details</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;