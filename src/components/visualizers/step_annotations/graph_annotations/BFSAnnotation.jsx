import { motion } from 'framer-motion';
import MessageBox from '../../../shared/MessageBox';

export default function BFSAnnotation({ stepData }) {
  if (!stepData?.info) return null;

  const messageStyle = { left: '50%', transform: 'translateX(-50%)' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 pointer-events-none z-10"
    >
      <div className="absolute top-4 w-full">
        <MessageBox message={{ text: stepData.info }} style={messageStyle} />
      </div>
    </motion.div>
  );
}
