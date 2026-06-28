import { Link } from "react-router-dom";
import { usePageMetadata } from "../hooks/usePageMetadata";

interface NotFoundPageProps {
  message?: string;
}

export function NotFoundPage({ message = "That page does not exist." }: NotFoundPageProps) {
  usePageMetadata("Page not found · AlgoVisualisation");

  return (
    <main className="glass-canvas flex min-h-dvh items-center justify-center p-6 text-white">
      <section className="glass-panel max-w-md rounded-3xl p-8 text-center">
        <p className="mb-2 font-mono text-sm text-cyan-300">404</p>
        <h1 className="mb-3 text-3xl font-bold">Lost in the algorithm?</h1>
        <p className="mb-7 text-slate-400">{message}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/learn" className="flex min-h-11 items-center rounded-xl bg-cyan-500 px-5 font-semibold text-slate-950">
            Browse exercises
          </Link>
          <Link to="/" className="glass-control flex min-h-11 items-center rounded-xl px-5 text-slate-200">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
