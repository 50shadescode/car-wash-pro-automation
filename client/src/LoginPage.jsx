import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => { // 1. Added onLoginSuccess prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending credentials to your backend
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });
      
      // Save the Digital Key (Token) and Role in your browser memory
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      
      // 2. TRIGGER STATE UPDATE IN APP.JSX IMMEDIATELY
      if (onLoginSuccess) {
        onLoginSuccess(res.data.user.role);
      }
      
      alert('Login Successful! Welcome to CarWash Pro.');

      // 3. DYNAMIC REDIRECT: Send user to the correct dashboard based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/staff');
      }
      
    } catch (err) {
      // Improved error message to help with debugging
      const errorMsg = err.response?.data?.msg || 'Invalid Credentials. Please check your email and password.';
      alert(errorMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white font-sans">
      <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
        <h2 className="text-4xl font-extrabold mb-2 text-center text-blue-400">Staff Portal</h2>
        <p className="text-slate-400 text-center mb-8 italic">Authorized Access Only</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Work Email</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@carwash.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Security Password</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-slate-700 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 transition transform active:scale-95">
            Authenticate & Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;