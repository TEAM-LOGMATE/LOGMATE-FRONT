import Bar from '../../components/navi/bar';
import { motion } from 'framer-motion';

export default function MainPage() {
  const username = localStorage.getItem('username') || 'Guest';
  
  console.log('받은 사용자 이름:', username);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="flex w-screen h-screen bg-[#0F0F0F] text-white font-suit"
    >
      {/* 왼쪽 사이드바 */}
      <Bar username={username} />

    </motion.div>
  );
}
