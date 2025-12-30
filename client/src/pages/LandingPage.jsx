import React from 'react';
import { Car, Users, LayoutDashboard, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 animate-in fade-in zoom-in duration-500">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-lg shadow-blue-200">
            <Droplets className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">CarWash Pro</h1>
          <p className="text-slate-500 font-medium italic">Enterprise Solutions</p>
        </div>

        {/* Navigation Section */}
        <div className="space-y-4">
          <p className="text-center text-slate-600 mb-6 text-sm font-medium">
            Select a portal to begin your session:
          </p>
          
          {/* Customer Portal - Sets role to 'customer' */}
          <Link 
            to="/customer" 
            onClick={() => onLogin('customer')}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 group"
          >
            <Car className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Customer Portal
          </Link>

          {/* Staff Dashboard - Sets role to 'staff' */}
          <Link 
            to="/staff" 
            onClick={() => onLogin('staff')}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 group"
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Staff Dashboard
          </Link>

          {/* Admin Dashboard - Sets role to 'admin' */}
          <Link 
            to="/admin" 
            onClick={() => onLogin('admin')}
            className="w-full flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-cyan-100 group"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Admin Dashboard
          </Link>
        </div>

        {/* Footer / Meta Data */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] uppercase tracking-widest text-slate-400 font-bold">
          <div className="flex gap-4">
            <span className="hover:text-blue-600 cursor-pointer">Help Desk</span>
            <span className="hover:text-blue-600 cursor-pointer">Privacy</span>
          </div>
          <span className="font-mono">Build 2025.01</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;