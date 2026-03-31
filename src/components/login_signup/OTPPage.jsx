import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Sun, Moon, ShieldCheck, RefreshCw, Heart, Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axiosClient from '../../utils/axios';
import { loginSuccess } from '../../slices/authSlice';
import { toggleTheme } from '../../slices/uiSlice';

const OTPPage = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  // --- STATE ---
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [dateTime, setDateTime] = useState({ day: '', date: '', time: '' });

  // --- LIVE CLOCK LOGIC (Sync with AuthLayout) ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { timeZone: "Asia/Kolkata", weekday: 'short', day: 'numeric' };
      const formatter = new Intl.DateTimeFormat('en-IN', options);
      const parts = formatter.formatToParts(now);
      const day = parts.find(p => p.type === 'weekday').value;
      const d = parseInt(parts.find(p => p.day || p.type === 'day').value);
      const getSuffix = (n) => {
        if (n > 3 && n < 21) return 'th';
        switch (n % 10) {
          case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th";
        }
      };
      const time = now.toLocaleTimeString("en-IN", { 
        timeZone: "Asia/Kolkata", hour: '2-digit', minute: '2-digit', hour12: true 
      });
      setDateTime({ day, date: `${d}${getSuffix(d)}`, time: time.toUpperCase() });
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 60000);
    return () => clearInterval(clockInterval);
  }, []);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // --- HANDLERS ---
  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length < 4) return toast.warning("Enter valid code");
    
    setLoading(true);
    try {
      const res = await axiosClient.post('/auth/verify-otp', { emailId: email, otp });
      dispatch(loginSuccess(res.user));
      toast.success(`Access Granted. Welcome ${res.user.name}!`);
      navigate('/visualizers');
    } catch (err) {
      toast.error(err?.message || "Invalid Security Code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await axiosClient.post('/auth/generate-otp', { email: email });
      setTimer(60);
      setCanResend(false);
      setOtp('');
      toast.info("A new security key has been transmitted.");
    } catch (err) {
      toast.error("Failed to resend code.");
    }
  };

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center p-4 lg:p-6 transition-colors duration-500 relative overflow-hidden font-sans text-text-primary">
      
      {/* Background Accents (Exact match to AuthLayout) */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-border/10 bg-white/5 backdrop-blur-[1px] z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 rounded-full bg-accent/10 blur-[80px] opacity-40"/>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl h-full max-h-[530px]">
        
        {/* LEFT COLUMN: FUNCTIONAL OTP ENTRY */}
        <div className="flex flex-col gap-4 h-full relative">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 backdrop-blur-3xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-border/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl overflow-hidden relative z-10"
          >
            <form onSubmit={handleVerify} className="h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">Security Protocol</span>
                  <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/20">
                    <ShieldCheck size={16} className="text-accent" />
                  </div>
                </div>

                <div className="mb-8">
                  <h1 className="text-3xl font-light text-text-primary tracking-tight mb-2">Verify Identity</h1>
                  <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] leading-relaxed">
                    Code transmitted to: <br/>
                    <span className="text-text-primary font-semibold lowercase">{email}</span>
                  </p>
                </div>

                {/* OTP INPUT */}
                <div className="space-y-6">
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="······"
                      className="w-full bg-white/60 dark:bg-white/10 text-text-primary border border-white/20 rounded-2xl py-4 text-center text-4xl tracking-[0.3em] outline-none focus:ring-1 ring-accent/40 transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Timer & Resend */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-90">Resend OTP</span>
                        <span className={`text-sm ${timer < 10 ? 'text-red-500' : 'text-accent'}`}>
                            00:{timer < 10 ? `0${timer}` : timer}
                        </span>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleResend}
                        disabled={!canResend}
                        className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-widest transition-all ${
                            canResend ? 'text-text-primary hover:text-accent cursor-pointer' : 'text-text-secondary opacity-30 cursor-not-allowed'
                        }`}
                    >
                        <RefreshCw size={12} />
                        Resend Code
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-[10px] text-text-secondary font-medium leading-relaxed max-w-[200px]">
                  Input the 6-digit cryptographic key to unlock your algorithm dashboard.
                </p>
                <button 
                  type="submit"
                  disabled={loading || otp.length < 4}
                  className="bg-accent text-accent-foreground p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
                >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight size={20}/>
                    )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: INFORMATION CARD */}
        <div className="bg-card/60 rounded-[2.5rem] shadow-2xl overflow-hidden flex relative border border-border/10 hidden lg:flex">
          
          {/* <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[290px] h-[290px] bg-gradient-to-r from-accent to-blue-900 rounded-full shadow-[0_0_80px_rgba(0,123,255,0.4)] z-0" /> */}

          <motion.div
            animate={{
              y: ["-50%", "-54%", "-50%"], 
              borderRadius: ["50%", "40% 60% 70% 30% / 40% 50% 60% 70%", "50%"], 
            }}
            whileHover={{
              scale: 1.05,
              rotate: 10,
              boxShadow: "0 0 50px rgba(0, 80, 205, 0.8)", 
              filter: "brightness(1.2)",
            }}
            transition={{
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              borderRadius: { duration: 10, repeat: Infinity, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 300, damping: 15 }
            }}
            className="absolute top-1/2 right-[10%] w-[270px] h-[270px] bg-gradient-to-tr from-accent/70 via-blue-600 to-blue-800 shadow-[0_0_80px_rgba(0,123,255,0.4)] z-0 cursor-pointer overflow-hidden group"
          >
            {/* Inner 3D shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>

          <div className="w-[55%] h-full p-10 flex flex-col justify-between relative z-20 backdrop-blur-2xl bg-accent/10 border-r border-white/10 shadow-xl pointer-events-none">
            <div>
              <h3 className="text-6xl font-light text-text-primary tracking-tighter mb-1">{dateTime.day}</h3>
              <h3 className="text-6xl font-light text-text-secondary opacity-30 tracking-tighter">{dateTime.date}</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-sm font-bold text-text-primary uppercase tracking-tight">{dateTime.time}</p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                   <Heart size={14} className="text-accent fill-accent" />
                   <span className="text-[9px] font-black tracking-widest uppercase text-text-primary">DSA VISUALIZER</span>
                </div>
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-border bg-card hover:bg-accent/10 transition-all pointer-events-auto cursor-pointer"
                >
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                </button>
              </div>
            </div>
          </div>

          <div className="w-[45%] h-full flex flex-col justify-between p-10 relative z-10 bg-transparent">
             <div className="relative z-10 text-right pointer-events-none">
                <p className="text-[10px] font-black text-text-secondary leading-tight uppercase tracking-widest">
                  Status Update<br/><span className="text-text-primary opacity-100 font-bold">Systems Online</span>
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;

// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router';
// import { motion } from 'framer-motion';
// import { ArrowRight, Mail } from 'lucide-react';
// import axiosClient from '../../utils/axios';
// import { toast } from 'react-toastify';
// import { useDispatch } from 'react-redux';
// import { loginSuccess } from '../../slices/authSlice';

// const OTPPage = () => {
//   const { email } = useParams();
//   const [otp, setOtp] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//     // Inside OTPPage.jsx
//     const handleVerify = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//         // This route calls 'verifyAndCreateUser' on the backend
//         const res = await axiosClient.post('/auth/verify-registration', { 
//         email, 
//         otp 
//         });

//         // res.user is now the officially created user from MongoDB
//         dispatch(loginSuccess(res.user));
//         toast.success("Welcome to DSA Visualizer!");
//         navigate('/visualizers');
//     } catch (err) {
//         toast.error(err?.message || "Invalid Code");
//     } finally {
//         setLoading(false);
//     }
//     };

//   return (
//     <div className="h-screen w-full bg-background flex items-center justify-center p-4">
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="w-full max-w-md backdrop-blur-3xl bg-white/10 dark:bg-black/20 border border-white/20 rounded-[2.5rem] p-10 shadow-2xl text-center"
//       >
//         <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
//           <Mail className="text-accent" size={28} />
//         </div>
        
//         <h2 className="text-3xl font-normal text-text-primary tracking-tight mb-2">Verify Email</h2>
//         <p className="text-xs text-text-secondary mb-8">We've sent a 6-digit code to <br/><span className="text-text-primary font-bold">{email}</span></p>

//         <form onSubmit={handleVerify} className="space-y-6">
//           <input 
//             type="text"
//             maxLength="6"
//             placeholder="0 0 0 0 0 0"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="w-full bg-white/60 dark:bg-white/10 text-text-primary border border-white/20 rounded-2xl py-4 text-center text-2xl tracking-[0.5em] font-mono outline-none focus:ring-1 ring-accent/40 transition-all placeholder:text-gray-300"
//           />

//           <div className="flex items-center justify-between pt-4">
//             <button type="button" className="text-[10px] font-bold text-text-secondary hover:text-accent transition-colors">Resend Code</button>
//             <button 
//               type="submit"
//               disabled={loading || otp.length < 4}
//               className="bg-accent text-accent-foreground p-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
//             >
//               {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight size={20} />}
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default OTPPage;