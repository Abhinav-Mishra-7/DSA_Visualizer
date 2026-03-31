import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Sun, Moon, ChevronRight, Github, Heart , User, Mail, Eye, EyeOff} from 'lucide-react';
import GoogleAuth from './GoogleAuth';
import { useDispatch , useSelector} from 'react-redux';
import { toast } from 'react-toastify';
import axiosClient from '../../utils/axios';
import { loginSuccess } from '../../slices/authSlice';
import { toggleTheme } from '../../slices/uiSlice';
import Greeting3D from "../login_signup/Greeting3D";
import {useNavigate} from 'react-router';
// import imageDark from '../../src/assets/Generated Image March 28, 2026 - 1_01PM.png';
import GlassBackground from './Background';

const AuthLayout = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dateTime, setDateTime] = useState({ day: '', date: '', time: '' });
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  // --- LIVE CLOCK LOGIC ---
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
        timeZone: "Asia/Kolkata", 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
      
      setDateTime({ day, date: `${d}${getSuffix(d)}`, time: time.toUpperCase() });
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Normal Login Flow
        const res = await axiosClient.post('/auth/login', { 
          email: formData.email, 
          password: formData.password 
        });
        dispatch(loginSuccess(res.user));
        navigate('/visualizers');
      } else {
        // REGISTRATION INITIATION
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords match fail");
       
        const res = await axiosClient.post('/auth/register-init', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        console.log(res) ;

        toast.success("OTP sent to your email!");
        // Send email to OTP page so we know who to verify
        navigate(`/verify-otp/${formData.email}`);
      }
    } catch (err) {
      toast.error(err?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-background flex items-center justify-center transition-colors duration-500 relative overflow-hidden font-sans text-text-primary">
      <GlassBackground/>
      
      {/* Background Accents */}
      <div className="absolute w-full h-full border border-border/10 bg-accent backdrop-blur-[100px] z-0" />
      {/* <div className="absolute bottom-[20%] left-[-10%] w-100 h-100 rounded-full bg-accent blur-[200px] opacity-40"/> */}

      <div className="absolute bottom-[20%] right-[-5%] w-100 h-100 rounded-full bg-accent blur-[170px] opacity-40"/>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl h-full max-h-[550px]">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4 h-full relative">
          
          {/* AUTH CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 backdrop-blur-xl bg-black/10 border border-white/50 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl overflow-hidden relative z-10"
          >
            <form onSubmit={handleSubmit} className="h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">DSA VISUALIZER</span>
                  <button 
                    type="button" 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="text-text-primary font-bold text-xs border-b border-accent/40 hover:border-accent transition-all cursor-pointer"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </div>

                <div className="mb-6">
                  <h1 className="text-lg font-normal text-text-primary tracking-tight mb-6">
                    {isLogin ? 'Welcome Back' : 'A new world of code awaits you!'}
                  </h1>
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* <SocialBtn icon={<Facebook size={14} fill="currentColor" />} label="Facebook" /> */}
                    <GoogleAuth />
                    <SocialBtn icon={<Github size={14} />} label="GitHub" />
                  </div>
                </div>

                {/* INPUT FIELDS */}
                <div className="space-y-3">
                  {/* name */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="relative overflow-hidden"
                      >
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                          name="name"
                          type="text" 
                          required={!isLogin}
                          placeholder="Abhinav Mishra" 
                          spellCheck="false"
                          // value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-white/60 dark:bg-white/10 text-text-primary border border-white/20 rounded-2xl py-2.5 pl-10 pr-6 outline-none focus:ring-1 ring-accent/40 transition-all text-sm" 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Email */}
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      name="email"
                      type="email" 
                      required
                      placeholder="e-mail address" 
                      autoComplete="off"
                      spellCheck="false"
                      // value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/60 dark:bg-white/10 text-text-primary border border-white/20 rounded-2xl py-2.5 pl-10 pr-6 outline-none focus:ring-1 ring-accent/40 transition-all text-sm" 
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="password" 
                      autoComplete="new-password"
                      spellCheck="false"
                      // value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-white/60 dark:bg-white/10 text-text-primary border border-white/20 rounded-2xl py-2.5 pl-10 pr-24 outline-none focus:ring-1 ring-accent/40 transition-all text-sm" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                  </div>

                  {/* Confirm Password (Only for Signup) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="relative overflow-hidden"
                      >
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"} 
                          required={!isLogin}
                          placeholder="confirm password" 
                          spellCheck="false"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full bg-white/60 dark:bg-white/10 text-text-primary border border-white/20 rounded-2xl py-2.5 pl-10 pr-6 outline-none focus:ring-1 ring-accent/40 transition-all text-sm" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {isLogin && <Greeting3D/>}

              {/* Bottom Actions */}
              <div className="mt-2 flex items-center justify-between">
                {!isLogin ?
                  <p className="text-[10px] text-text-secondary font-medium leading-relaxed max-w-[200px]">
                    Secure login powered by DSA.VIS. Master algorithms in a high-fidelity workspace.
                  </p> :
                  <p className="text-[10px] text-text-secondary font-medium leading-relaxed max-w-[200px]">
                    Log in to visualize DSA concepts like never before.
                  </p>
                }
                <button 
                  type="submit"
                  disabled={loading}
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

const SocialBtn = ({ icon, label }) => (
  <button type="button" className="flex items-center gap-2 bg-white/5 dark:bg-white/10 border border-border/20 px-3 py-2.5 rounded-full text-[10px] font-bold text-text-primary hover:bg-white/20 transition-all shadow-sm active:scale-95">
    {icon} {label}
  </button>
);

export default AuthLayout;


// import { useState, useEffect } from 'react';
// import { motion} from 'framer-motion';
// import { Lock, ArrowRight, Sun, Moon, ChevronRight, Facebook, Github, Heart } from 'lucide-react';
// import GoogleAuth from './GoogleAuth';
// import {useNavigate} from 'react-router';

// const AuthLayout = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [isDarkMode, setIsDarkMode] = useState(true); 
//   const [dateTime, setDateTime] = useState({ day: '', date: '', time: '' });
//   const navigate = useNavigate();
  
//   const handleLoginSuccess = (user) => {
//     navigate('/visualizers');
//   };

//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date();
//       const options = { timeZone: "Asia/Kolkata", weekday: 'short', day: 'numeric' };
//       const formatter = new Intl.DateTimeFormat('en-IN', options);
//       const parts = formatter.formatToParts(now);
//       const day = parts.find(p => p.type === 'weekday').value;
//       const d = parseInt(parts.find(p => p.type === 'day').value);
//       const getSuffix = (n) => {
//         if (n > 3 && n < 21) return 'th';
//         switch (n % 10) {
//           case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th";
//         }
//       };
//       const time = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: '2-digit', minute: '2-digit', hour12: true });
//       setDateTime({ day, date: `${d}${getSuffix(d)}`, time: time.toUpperCase() });
//     };
//     updateTime();
//     const timer = setInterval(updateTime, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const toggleTheme = () => {
//     const newMode = !isDarkMode;
//     setIsDarkMode(newMode);
//     if (newMode) document.documentElement.classList.add('dark');
//     else document.documentElement.classList.remove('dark');
//   };

//   return (
//     <div className="h-screen w-full bg-background flex items-center justify-center p-4 lg:p-6 transition-colors duration-500 relative overflow-hidden font-sans">
      
//       {/* Background Accents */}
//       <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-border/10 bg-white/5 backdrop-blur-[1px] z-0" />
//       <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 rounded-full bg-accent/10 blur-[80px] opacity-40"/>
      
//       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl h-full max-h-[620px]">
        
//         {/* LEFT COLUMN */}
//         <div className="flex flex-col gap-4 h-full relative">
//           {/* AUTH CARD - Glass Layer */}
//           <motion.div 
//             className="flex-1 backdrop-blur-3xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-border/10 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl flex flex-col justify-between overflow-hidden relative z-10"
//           >
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <span className="text-text-secondary text-[10px] font-bold tracking-widest uppercase">DSA VISUALIZER</span>
//                 <button onClick={() => setIsLogin(!isLogin)} className="text-text-primary font-bold text-xs border-b border-accent/40 hover:border-accent transition-all">
//                   {isLogin ? 'Sign up' : 'Log in'}
//                 </button>
//               </div>

//               <div className="mb-6">
//                 <h1 className="text-4xl font-normal text-text-primary tracking-tight mb-6">{isLogin ? 'Log in' : 'Join'}</h1>
//                 <div className="flex flex-wrap gap-2">
//                    <GoogleAuth text={"Sign in"}/>
//                   <SocialBtn icon={<Github size={14} />} label="GitHub" />
//                 </div>
//               </div>

//               {/* FORM INPUTS */}
//               <div className="space-y-3">
//                 <div className="relative group">
//                   <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">@</span>
//                   <input 
//                     type="email" 
//                     placeholder="e-mail address" 
//                     className="w-full bg-white/60 dark:bg-white/10 text-text-primary border border-white/20 rounded-2xl py-3.5 pl-10 pr-6 outline-none focus:ring-1 ring-accent/40 transition-all placeholder:text-gray-400 text-sm" 
//                   />
//                 </div>
//                 <div className="relative">
//                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
//                   <input 
//                     type="password" 
//                     placeholder="password" 
//                     className="w-full bg-white/60 dark:bg-white/10 text-text-primary border border-white/20 rounded-2xl py-3.5 pl-10 pr-24 outline-none focus:ring-1 ring-accent/40 transition-all text-sm" 
//                   />
//                   <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold bg-white text-gray-400 px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">I forgot</button>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <p className="text-[10px] text-text-secondary font-medium leading-relaxed max-w-[200px]">Secure login powered by DSA.VIS. Master algorithms in a high-fidelity workspace.</p>
//               <button className="bg-accent text-accent-foreground p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center">
//                   <ArrowRight size={20} />
//               </button>
//             </div>
//           </motion.div>

//           {/* PROMO CARD - Anchor Solid */}
//           <div className="bg-[#111] border border-white/5 rounded-[2rem] p-6 text-white h-28 flex justify-between items-end shadow-xl relative overflow-hidden group cursor-pointer z-10">
//             <div className="relative z-10">
//               <p className="text-lg font-light text-gray-500 mb-0.5">New in</p>
//               <h2 className="text-lg font-medium tracking-tight">DSA Vision Beta</h2>
//             </div>
//             <ChevronRight className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" size={20} />
//           </div>
//         </div>

//         {/* RIGHT COLUMN: INFORMATION CARD */}
//         <div className="bg-card rounded-[2.5rem] shadow-2xl overflow-hidden flex relative border border-border/10">
          
//           {/* 1. THE BLUE CIRCLE - Positioned behind everything in the right column */}
//           <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[340px] h-[340px] bg-gradient-to-r from-accent to-blue-900 rounded-full shadow-[0_0_80px_rgba(0,123,255,0.4)] z-0" />

//           {/* 2. THE GLASS LEFT SIDE (Now covering the whole 55% width) */}
//           <div className="w-[55%] h-full p-10 flex flex-col justify-between relative z-20 backdrop-blur-2xl bg-background/20 border-r border-white/10 shadow-xl">
//             <div>
//               <h3 className="text-6xl font-light text-text-primary tracking-tighter mb-1">{dateTime.day}</h3>
//               <h3 className="text-6xl font-light text-text-secondary opacity-30 tracking-tighter">{dateTime.date}</h3>
//             </div>
            
//             <div className="space-y-6">
//               <div className="space-y-1">
//                 <p className="text-sm font-bold text-text-primary uppercase tracking-tight">{dateTime.time}</p>
//                 <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest leading-tight">IST Timezone<br/>Active Session</p>
//               </div>

//               <div className="flex items-center justify-between pt-4">
//                 <div className="flex items-center gap-2">
//                    <Heart size={14} className="text-accent fill-accent" />
//                    <span className="text-[9px] font-black tracking-widest uppercase text-text-primary">DSA VISUALIZER</span>
//                 </div>
//                 <button onClick={toggleTheme} className="p-2.5 bg-card border border-border/40 rounded-full shadow-lg hover:rotate-12 transition-transform">
//                   {isDarkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-accent" />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* 3. THE GRAPHIC RIGHT SIDE (Clear background to show the circle) */}
//           <div className="w-[45%] h-full flex flex-col justify-between p-10 relative z-10 bg-transparent">
//              <div className="relative z-10 text-right">
//                 <p className="text-[10px] font-black text-text-secondary leading-tight uppercase tracking-widest">
//                   Status Update<br/><span className="text-text-primary opacity-100 font-bold">Systems Online</span>
//                 </p>
//              </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// const SocialBtn = ({ icon, label }) => (
//   <button className="flex items-center gap-2 bg-white/5 dark:bg-white/10 border border-border/20 px-3 py-1.5 rounded-full text-[10px] font-bold text-text-primary hover:bg-white/20 dark:hover:bg-white/20 transition-all shadow-sm">
//     {icon} {label}
//   </button>
// );

// export default AuthLayout;