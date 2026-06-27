import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-slate-800 border border-white/10 text-sm text-slate-200 shadow-xl flex items-center gap-3"
        >
          {message}
          <button onClick={onDismiss} className="text-slate-400 hover:text-white transition-colors">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
