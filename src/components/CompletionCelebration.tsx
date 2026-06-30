import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface CompletionCelebrationProps {
  active: boolean;
}

export function CompletionCelebration({ active }: CompletionCelebrationProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {active && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-1 z-10 rounded-2xl border border-emerald-400/50"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={
              reduceMotion
                ? { opacity: 0.55 }
                : {
                    opacity: [0, 0.9, 0.55],
                    boxShadow: [
                      "0 0 0 rgba(52, 211, 153, 0)",
                      "0 0 32px rgba(52, 211, 153, 0.28)",
                      "0 0 18px rgba(52, 211, 153, 0.14)",
                    ],
                  }
            }
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeOut" }}
          />

          <motion.div
            role="status"
            aria-live="polite"
            className="pointer-events-none absolute top-2 right-2 z-20 flex items-center gap-1.5 rounded-full border border-emerald-300/35 bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-200 shadow-lg shadow-emerald-500/15 backdrop-blur-xl"
            initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
              delay: reduceMotion ? 0 : 0.12,
              ease: "easeOut",
            }}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-slate-950">
              <svg
                aria-hidden="true"
                width="11"
                height="11"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
              >
                <path d="m3 8 3 3 7-7" />
              </svg>
            </span>
            Exercise complete
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
