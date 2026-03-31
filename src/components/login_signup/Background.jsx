import { motion } from 'framer-motion';
import backgroundImage from '../../assets/Generated Image March 28, 2026 - 1_01PM.png';

const GlassBackground = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-10 overflow-hidden pointer-events-none bg-background transition-colors duration-1000">
      
      {/* LAYER 1: THE CORE IMAGE ASSET */}
      <motion.div 
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: isDark ? 0.45 : 0.55 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img 
          src={backgroundImage} 
          alt="3D Scene" 
          className="w-full h-full object-cover select-none"
        />
      </motion.div>

      {/* LAYER 2: DYNAMIC THEME TINT (Maintains text contrast) */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isDark  && 'bg-black backdrop-brightness-510'
      }`} />

      {/* LAYER 3: VOLUMETRIC LIGHTING ORBS (The "Deep 3D" Effect) */}
      {/* These orbs move slowly to simulate light shifting across the glass */}
      <motion.div 
        animate={{ 
          x: [0, 80, 0], 
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-accent/20 blur-[140px] mix-blend-screen opacity-70"
      />

      <motion.div 
        animate={{ 
          x: [0, -100, 0], 
          y: [0, 60, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-15%] right-[-10%] w-[80vw] h-[80vw] bg-blue-500/15 blur-[160px] rounded-full opacity-40"
      />

      {/* LAYER 4: MESH GRADIENT OVERLAY (For the "Liquid Glass" look) */}
      <div className="absolute inset-0 opacity-30" 
           style={{
             background: `radial-gradient(at 0% 0%, rgba(255,255,255,0.2) 0%, transparent 50%),
                          radial-gradient(at 100% 100%, rgba(0,0,0,0.1) 0%, transparent 50%)`
           }} 
      />

      {/* LAYER 5: GLOBAL FROSTED GLASS (Refraction Layer) */}
      {/* This creates the smooth "C.Lab" aesthetic across the whole screen */}
      <div className="absolute inset-0 backdrop-blur-[4px] bg-gradient-to-tr from-background/30 via-transparent to-background/30" />

      {/* LAYER 6: VIGNETTE & GRAIN (Realistic finish) */}
      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.2)]" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
    </div>
  );
};

export default GlassBackground;