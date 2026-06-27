import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEmailCapture } from "../hooks/useEmailCapture";
import { Toast } from "../components/Toast";

export function LandingPage() {
  const [email, setEmail] = useState("");
  const { capture, toast, dismissToast } = useEmailCapture();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (capture(email)) setEmail("");
  };

  return (
    <div className="glass-canvas min-h-screen text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <nav className="glass-header sticky top-0 z-50 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="glass-logo flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500 text-cyan-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <span className="font-bold text-lg">AlgoVisualisation</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/42" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            42 Tirana
          </Link>
          <Link
            to="/learn"
            className="glass-logo rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-px hover:bg-cyan-400"
          >
            Open App
          </Link>
        </div>
      </nav>

      <section className="px-6 pt-20 pb-16 max-w-5xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
        >
          Understand algorithms,
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">not just memorize them</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Step through 15 algorithms visually, line by line, with plain English explanations.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/learn/bubble-sort"
            className="glass-logo inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-400 hover:shadow-cyan-400/30"
          >
            Start Learning — it's free
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </motion.div>
      </section>

      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-4 mb-16">
          {[
            { title: "Visual Step-by-Step", desc: "Watch every comparison, swap, and pointer move in real time.", icon: "▶" },
            { title: "Plain English Explanations", desc: "No jargon — each step tells you exactly what's happening and why.", icon: "💬" },
            { title: "Built for CS Students", desc: "15 core algorithms with complexity analysis and shareable URLs.", icon: "🎓" },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="glass-card rounded-3xl p-6"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-panel mb-16 rounded-3xl p-6"
        >
          <div className="flex items-end justify-center gap-2 h-32 mb-4">
            {[64, 34, 25, 12, 22, 11, 90].map((v, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${(v / 90) * 100}%`, `${((i === 2 ? 90 : v) / 90) * 100}%`, `${(v / 90) * 100}%`] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                className={`w-8 rounded-t-lg border-2 ${
                  i === 2 ? "bg-amber-500 border-amber-400" : i === 3 ? "bg-rose-500 border-rose-400" : "bg-slate-700 border-slate-600"
                }`}
                style={{ height: `${(v / 90) * 100}%` }}
              />
            ))}
          </div>
          <p className="text-center text-sm text-slate-500">Live preview — Bubble Sort comparing adjacent elements</p>
        </motion.div>

        <div className="text-center mb-16">
          <h2 className="text-xl font-semibold mb-4">Get notified when we add new algorithms</h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="glass-field flex-1 rounded-2xl px-4 py-2.5 text-white outline-none placeholder:text-slate-500 transition-colors focus:border-cyan-500/50"
            />
            <button
              type="submit"
              className="glass-control rounded-2xl px-6 py-2.5 font-medium transition-colors duration-300"
            >
              Notify me
            </button>
          </form>
        </div>

        <div className="glass-panel rounded-3xl border-violet-400/20 p-8 text-center">
          <h2 className="text-2xl font-bold mb-2 text-violet-300">Built for 42 Tirana</h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            A dedicated section with algorithms from the 42 curriculum — linked lists, malloc, flood fill, maze BFS, and more.
          </p>
          <Link
            to="/42"
            className="glass-logo inline-flex rounded-2xl bg-violet-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:-translate-y-px hover:bg-violet-400"
          >
            Explore 42 Section →
          </Link>
        </div>
      </section>

      <footer className="glass-header border-t px-6 py-8 text-center text-sm text-slate-500">
        <p>AlgoVisualisation — Learn algorithms visually. Open source, client-side, no account required.</p>
      </footer>

      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}
