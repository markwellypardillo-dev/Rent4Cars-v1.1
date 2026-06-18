import { motion } from 'motion/react';

export default function SkeletonLandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-white dark:bg-[#0a0a0a] overflow-hidden flex flex-col"
    >
      {/* Top Progress Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        />
      </div>

      {/* Navbar Skeleton */}
      <div className="h-24 border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between px-8 md:px-12 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
        </div>
        <div className="hidden md:flex gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-20 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
      </div>

      {/* Hero Skeleton Layout */}
      <div className="flex-1 flex flex-col md:flex-row px-8 md:px-12 pt-16 md:pt-24 gap-12 max-w-7xl mx-auto w-full">
        <div className="flex-[0.8] space-y-8 w-full mt-4">
          <div className="space-y-4">
            <div className="w-1/4 h-6 bg-primary/20 rounded animate-pulse"></div>
            <div className="w-full h-14 md:h-20 bg-gray-200 dark:bg-gray-800 rounded-[2rem] animate-pulse"></div>
            <div className="w-4/5 h-14 md:h-20 bg-gray-200 dark:bg-gray-800 rounded-[2rem] animate-pulse"></div>
          </div>
          <div className="w-full max-w-md h-24 bg-gray-100 dark:bg-gray-800/40 rounded-2xl animate-pulse mt-8"></div>
          <div className="flex gap-4 mt-12">
            <div className="w-40 h-14 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"></div>
            <div className="w-40 h-14 bg-gray-100 dark:bg-gray-800/40 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex-[1.2] w-full hidden md:block relative">
          <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800/30 rounded-[3rem] animate-pulse absolute top-0 -right-12"></div>
        </div>
      </div>

    </motion.div>
  );
}
