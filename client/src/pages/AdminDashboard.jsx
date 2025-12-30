import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrendingUp, Users, DollarSign, Clock, Settings, 
  Download, Search, Eye, Trash2, Loader2, AlertCircle 
} from 'lucide-react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingDetails, setViewingDetails] = useState(null);

  // 1. Fetch live data from MongoDB
  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // 2. LIVE CALCULATIONS (Replacing static mock data)
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const activeWashes = bookings.filter(b => b.status === 'pending' || b.status === 'in-progress').length;
  
  const totalCustomers = new Set(bookings.map(b => b.email)).size;

  const stats = [
    { label: "Total Revenue", value: `Ksh ${totalRevenue.toLocaleString()}`, change: "+12%", icon: <DollarSign className="text-blue-600" />, color: "bg-blue-50" },
    { label: "Active Washes", value: activeWashes.toString(), change: "In Queue", icon: <Clock className="text-emerald-600" />, color: "bg-emerald-50" },
    { label: "Unique Clients", value: totalCustomers.toString(), change: "+5%", icon: <Users className="text-purple-600" />, color: "bg-purple-50" },
    { label: "Satisfaction", value: "98%", change: "High", icon: <TrendingUp className="text-amber-600" />, color: "bg-amber-50" },
  ];

  // 3. Admin Actions (Delete)
  const handleDelete = async (id) => {
    if (window.confirm("Delete this booking record permanently?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(bookings.filter(b => b._id !== id));
      } catch (err) {
        alert("Failed to delete booking.");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-slate-500 font-bold animate-pulse">Syncing Command Center...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Command Center</h1>
            <p className="text-slate-500 font-medium italic">Monitoring business performance live</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Download className="w-4 h-4" /> Export Report
            </button>
            <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`${stat.color} p-4 rounded-2xl`}>{stat.icon}</div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="font-black text-slate-800 uppercase text-sm tracking-tighter">Recent Revenue</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search name or plate..." 
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Customer / Plate</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings
                    .filter(b => b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || b.licensePlate.includes(searchTerm.toUpperCase()))
                    .map((tx) => (
                    <tr key={tx._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-black text-slate-800">{tx.customerName}</div>
                        <div className="text-[10px] font-mono font-bold text-blue-500 uppercase">{tx.licensePlate}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-bold text-sm">{tx.service}</td>
                      <td className="px-6 py-4 font-black text-slate-900">Ksh {tx.totalPrice}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                          tx.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setViewingDetails(tx)} className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(tx._id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side Panel: Staff Efficiency */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h2 className="font-black text-slate-800 mb-6 uppercase text-sm tracking-tighter">Staff Efficiency</h2>
            <div className="space-y-8">
              {[
                { name: "John Smith", efficiency: "94%", color: "bg-blue-600", icon: "👨‍🔧" },
                { name: "Sarah Johnson", efficiency: "88%", color: "bg-emerald-600", icon: "👩‍🔧" },
                { name: "Mike Davis", efficiency: "76%", color: "bg-orange-500", icon: "👨‍🔧" },
              ].map((staff, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center text-sm mb-3">
                    <div className="flex items-center gap-3">
                       <span className="text-xl">{staff.icon}</span>
                       <span className="font-black text-slate-700">{staff.name}</span>
                    </div>
                    <span className="font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs">{staff.efficiency}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <div className={`${staff.color} h-full rounded-full transition-all duration-1000 group-hover:brightness-110`} style={{ width: staff.efficiency }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔍 Details Modal */}
        {viewingDetails && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-200 border-t-8 border-blue-600">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Booking Info</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Transaction: #{viewingDetails._id.slice(-6)}</p>
                </div>
                <button onClick={() => setViewingDetails(null)} className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-all">✕</button>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Customer</span>
                  <span className="font-black text-slate-800">{viewingDetails.customerName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">License Plate</span>
                  <span className="font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg font-mono">{viewingDetails.licensePlate}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Phone</span>
                  <span className="font-black text-slate-800">{viewingDetails.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Amount Paid</span>
                  <span className="font-black text-emerald-600 text-xl">Ksh {viewingDetails.totalPrice}</span>
                </div>
              </div>

              <button 
                onClick={() => setViewingDetails(null)}
                className="w-full mt-10 bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Close Transaction
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;