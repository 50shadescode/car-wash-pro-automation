import React, { useState } from 'react';
import axios from 'axios';
import { Car, Truck, Bike, ChevronRight, ChevronLeft, CheckCircle, Star, Calendar, Clock, CreditCard, Smartphone, User, Mail, Hash } from 'lucide-react';

const CustomerPortal = () => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingData, setBookingData] = useState({
    customerName: '',
    email: '',
    phone: '',
    licensePlate: '',
    vehicleType: '',
    service: '',
    totalPrice: 0,
    date: '',
    time: ''
  });

  const steps = ["Details", "Vehicle", "Service", "Time", "Payment"];

  const vehicleTypes = [
    { id: 'Sedan', label: 'Sedan', icon: <Car className="w-8 h-8" /> },
    { id: 'SUV', label: 'SUV / Jeep', icon: <Truck className="w-8 h-8" /> },
    { id: 'Motorbike', label: 'Motorbike', icon: <Bike className="w-8 h-8" /> },
  ];

  const services = [
    { id: 'Basic Wash', name: 'Basic Wash', price: 800, duration: '20 mins', features: ['Exterior Wash', 'Tire Shine'] },
    { id: 'Executive Wash', name: 'Executive Wash', price: 1500, duration: '45 mins', features: ['Interior Vacuum', 'Fragrance'], bonus: 'FREE Engine Shine' },
    { id: 'Full Detail', name: 'Full Detailing', price: 3000, duration: '90 mins', features: ['Seat Steaming', 'Deep Clean'], bonus: 'FREE Odor Eliminator' },
  ];

  const timeSlots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];

  const handleServiceSelect = (service) => {
    setBookingData({ ...bookingData, service: service.id, totalPrice: service.price });
  };

  // Helper to check if current step is valid
  const isStepValid = () => {
    if (step === 1) return bookingData.customerName && bookingData.licensePlate && bookingData.email && bookingData.phone;
    if (step === 2) return bookingData.vehicleType;
    if (step === 3) return bookingData.service;
    if (step === 4) return bookingData.date && bookingData.time;
    return true;
  };

  const handleFinalBooking = async () => {
    // Final check for licensePlate before sending to prevent Mongoose validation errors
    if (!bookingData.licensePlate) {
      alert("License Plate is missing. Please go back to Step 1.");
      setStep(1);
      return;
    }

    setIsProcessing(true);
    try {
      await axios.post('http://localhost:5000/api/bookings', bookingData);
      
      setTimeout(() => {
        setIsProcessing(false);
        alert("Booking Confirmed! Check your phone for the M-Pesa prompt.");
        window.location.href = "/"; 
      }, 1500);
    } catch (err) {
      setIsProcessing(false);
      alert("Error: " + (err.response?.data?.error || "Connection failed"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800">Book Your Wash</h1>
          <p className="text-slate-500">Premium care for your vehicle, automated by CarWash Pro.</p>
        </div>

        {/* Progress Tracker */}
        <div className="flex justify-between mb-12">
          {steps.map((s, index) => (
            <div key={s} className="flex flex-col items-center flex-1 text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all ${
                step > index + 1 ? 'bg-emerald-500 text-white' : 
                step === index + 1 ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-200 text-slate-500'
              }`}>
                {step > index + 1 ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`text-[10px] md:text-xs font-bold uppercase tracking-tighter ${step === index + 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Customer Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User className="text-blue-600"/> Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-blue-600"
                  value={bookingData.customerName} onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">License Plate</label>
                <input type="text" placeholder="KDA 123X" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-blue-600 font-mono uppercase"
                  value={bookingData.licensePlate} onChange={(e) => setBookingData({...bookingData, licensePlate: e.target.value.toUpperCase()})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-blue-600"
                  value={bookingData.email} onChange={(e) => setBookingData({...bookingData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Phone (M-Pesa)</label>
                <input type="tel" placeholder="0712..." className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-blue-600"
                  value={bookingData.phone} onChange={(e) => setBookingData({...bookingData, phone: e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle Type */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-6">Select Vehicle Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicleTypes.map((type) => (
                <div key={type.id} onClick={() => setBookingData({...bookingData, vehicleType: type.id})}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 ${bookingData.vehicleType === type.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 hover:border-blue-200 text-slate-500'}`}>
                  {type.icon} <span className="font-bold">{type.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Service Selection */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-6">Choose a Service</h2>
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <div key={service.id} onClick={() => handleServiceSelect(service)}
                  className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${bookingData.service === service.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white hover:border-blue-200'}`}>
                  <div>
                    <div className="flex items-center gap-3"><h3 className="font-bold text-slate-800">{service.name}</h3>
                    {service.bonus && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{service.bonus}</span>}</div>
                    <span className="text-slate-400 text-xs">{service.duration}</span>
                  </div>
                  <span className="text-2xl font-black text-blue-600">Ksh {service.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Pick Date & Time */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-xl font-semibold mb-6">Pick Date & Time</h2>
            <input type="date" className="w-full p-4 rounded-xl border border-slate-200 mb-6 font-bold" value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {timeSlots.map((slot) => (
                <button key={slot} onClick={() => setBookingData({...bookingData, time: slot})}
                  className={`p-3 rounded-xl border-2 font-bold transition-all ${bookingData.time === slot ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'border-slate-100 text-slate-600'}`}>{slot}</button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Summary & Payment */}
        {step === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle className="text-emerald-500" /> Review Order
              </h2>
              <div className="space-y-4 text-slate-600">
                <div className="flex justify-between border-b pb-2"><span>Customer:</span><span className="font-bold text-slate-800">{bookingData.customerName || "N/A"}</span></div>
                <div className="flex justify-between border-b pb-2"><span>Plate:</span><span className="font-bold text-blue-600 font-mono">{bookingData.licensePlate || "MISSING"}</span></div>
                <div className="flex justify-between border-b pb-2"><span>Service:</span><span className="font-bold text-slate-800">{bookingData.service || "N/A"}</span></div>
                <div className="flex justify-between border-b pb-2"><span>Scheduled:</span><span className="font-bold text-slate-800">{bookingData.date} @ {bookingData.time}</span></div>
                <div className="pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-3xl font-black text-slate-900">Ksh {bookingData.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-3xl shadow-xl p-8 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Smartphone /> M-Pesa Checkout</h2>
                <p className="text-blue-100 text-sm mb-6">Clicking the button below will trigger a secure STK push to <strong>{bookingData.phone || 'your phone'}</strong>.</p>
              </div>
              <button 
                onClick={handleFinalBooking} 
                disabled={isProcessing || !bookingData.licensePlate} 
                className="w-full bg-white text-blue-600 font-black py-5 rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : `PAY KSH ${bookingData.totalPrice}`}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button 
            disabled={step === 1 || isProcessing} 
            onClick={() => setStep(step - 1)} 
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold ${step === 1 ? 'opacity-0' : 'text-slate-600 hover:bg-slate-200 transition-all'}`}
          >
            <ChevronLeft /> Back
          </button>
          
          {step < 5 && (
            <button 
              disabled={!isStepValid()}
              onClick={() => setStep(step + 1)} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-10 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95">
              Next Step <ChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;