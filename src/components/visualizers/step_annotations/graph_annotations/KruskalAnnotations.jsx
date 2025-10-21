import { motion } from 'framer-motion';
import MessageBox from '../../../shared/MessageBox';

export default function KruskalAnnotation({ stepData }) {
  if (!stepData?.info) return null;
  const style = { left: '50%', transform: 'translateX(-50%)' };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 pointer-events-none"
    >
      <div className="absolute top-4 w-full">
        <MessageBox message={{ text: stepData.info }} style={style} />
      </div>
    </motion.div>
  );
}