import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, MapPin, Globe } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="w-full px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] pt-28">
      <div className="space-y-8">
        <motion.h1 
          className="text-6xl md:text-8xl font-display font-bold leading-[0.9] tracking-tight text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Your Journey,<br />
          <span className="text-primary italic">Our</span> Logistics Excellence.
        </motion.h1>

        <motion.p 
          className="text-lg text-gray-500 dark:text-gray-400 max-w-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Experience the ultimate freedom of choice with Rent4Cars Davao. Professional vehicle transport, regional logistics, and premium automotive care for your Mindanao travels.
        </motion.p>

        <motion.div 
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button 
            onClick={onGetStarted}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-2 group"
          >
            Explore Fleet
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      <motion.div 
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute -inset-4 bg-primary/5 dark:bg-primary/10 rounded-3xl -rotate-2 blur-2xl" />
        <img 
          src="https://i.postimg.cc/sXkj43CJ/Geely-Coolray.webp" 
          alt="Premium Fleet Car"
          className="relative rounded-3xl shadow-2xl border-4 border-white dark:border-gray-900 object-cover aspect-[4/3]"
        />
      </motion.div>
    </div>
  );
}
