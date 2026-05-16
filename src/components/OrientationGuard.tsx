import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Overlay that appears when a mobile device is in landscape orientation,
 * effectively "blocking" the UI and asking the user to rotate their device.
 */
export function OrientationGuard() {
  return (
    <div className="fixed inset-0 z-[9999] bg-hades-bg flex flex-col items-center justify-center p-8 text-center orientation-guard">
      <motion.div
        animate={{ 
          rotate: [0, -90, -90, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.4, 0.6, 1]
        }}
        className="mb-6 text-hades-accent"
      >
        <RotateCcw className="w-16 h-16" />
      </motion.div>
      <h2 className="text-2xl font-black uppercase tracking-tighter text-hades-text mb-2">
        Portrait Mode Only
      </h2>
      <p className="text-hades-text/60 text-sm max-w-xs mx-auto leading-relaxed">
        This tracker is optimized for vertical viewing. Please rotate your device for the best experience.
      </p>
    </div>
  );
}
