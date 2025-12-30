import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import CustomerPortal from './pages/CustomerPortal';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CCTVSimulator from './pages/CCTVSimulator'; // 🟢 Added this import
import LoginPage from './LoginPage'; 
import { Layout, User, ShieldCheck, Droplets, LogOut, Lock, Home, Camera } from 'lucide-react';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'none'); 

  useEffect(() => {
    const handleStorageChange = () => {
      const role = localStorage.getItem('role');
      setUserRole(role || 'none');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUserRole('none');
    window.location.href = '/login'; 
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 font-black text-blue-600 text-xl tracking-tighter hover:opacity-80 transition-all">
              <Droplets className="w-8 h-8" />
              <span>CARWASH<span className="text-slate-800 font-light">PRO</span></span>
            </Link>

            <div className="flex items-center gap-4">
              {userRole === 'none' ? (
                <div className="flex items-center gap-3">
                  <Link to="/customer" className="text-sm font-bold text-slate-600 hover:text-blue-600">Book Wash</Link>
                  <Link to="/login" className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 font-bold text-sm hover:bg-blue-100 transition-all">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Staff Login</span>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="hidden md:flex items-center gap-6 border-r pr-6 border-slate-200">
                    {(userRole === 'staff' || userRole === 'admin') && (
                      <>
                        <Link to="/staff" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                          <Layout className="w-4 h-4" /> Work Station
                        </Link>
                        {/* 🔵 New Link for the CCTV Simulator */}
                        <Link to="/simulator" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                          <Camera className="w-4 h-4" /> CCTV Feed
                        </Link>
                      </>
                    )}
                    {userRole === 'admin' && (
                      <Link to="/admin" className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Management
                      </Link>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 transition-all active:scale-95"
                  >
                    <LogOut className="w-4 h-4" /> 
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={setUserRole} />} />
            <Route path="/customer" element={<CustomerPortal />} />
            
            {/* 🟢 CCTV Simulator Route */}
            <Route path="/simulator" element={
              userRole === 'staff' || userRole === 'admin' 
              ? <CCTVSimulator /> 
              : <Navigate to="/login" replace />
            } />

            <Route path="/staff" element={
              userRole === 'staff' || userRole === 'admin' 
              ? <StaffDashboard /> 
              : <Navigate to="/login" replace />
            } />
            
            <Route path="/admin" element={
              userRole === 'admin' 
              ? <AdminDashboard /> 
              : <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
                  <div className="bg-red-50 p-6 rounded-full mb-6">
                    <Lock className="w-12 h-12 text-red-500 opacity-80" />
                  </div>
                  <h1 className="text-3xl font-black text-slate-800 mb-2">Access Denied</h1>
                  <p className="text-slate-500 max-w-sm mb-8">This workstation is restricted to administrative personnel only.</p>
                  <Link to="/" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                    <Home className="w-4 h-4" /> Return Home
                  </Link>
                </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;