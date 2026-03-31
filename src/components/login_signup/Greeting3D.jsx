import { motion, useMotionValue, useTransform } from 'framer-motion';

const Greeting3D = () => {
  // Motion values for mouse tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotate based on mouse position
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function resetMouse() {
    x.set(0);
    y.set(0);
  }

  return (
    <div 
      className="perspective-1000 mt-5"
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, z: -100 }}
        animate={{ opacity: 1, z: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative p-5 rounded-[2rem] bg-gradient-to-br from-white/20 to-transparent border border-white/30 backdrop-blur-md shadow-2xl"
      >
        {/* Floating 3D Elements in background */}
        {/* <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent/30 rounded-lg animate-pulse" /> */}
        
        <div style={{ transform: "translateZ(50px)" }} className="relative">
          <h1 className="text-xl font-light text-text-primary leading-tight">
            Master the <span className="font-bold italic">Logic</span>, <br />
            Visualize the <span className="text-accent underline decoration-accent/30">Code</span>.
          </h1>
          <p className="mt-4 text-[10px] text-text-secondary font-medium uppercase tracking-widest opacity-60">
            Welcome to the High-Fidelity Algorithm Workspace.
          </p>
        </div>

        {/* Decorative 3D "Data Node" */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateZ(80px)" }}
          className="absolute -bottom-2 -right-2 w-16 h-16 border-2 border-accent/20 rounded-full flex items-center justify-center backdrop-blur-xl"
        >
           <div className="w-6 h-6 bg-accent rounded-full blur-md opacity-40 absolute" />
           <div className="w-2 h-2 bg-accent rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Greeting3D ;