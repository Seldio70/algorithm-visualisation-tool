import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("AlgoVisualisation workspace error", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="glass-canvas flex min-h-dvh items-center justify-center p-6 text-white">
        <section className="glass-panel max-w-md rounded-3xl p-8 text-center">
          <p className="mb-2 text-sm font-semibold text-rose-300">Something went wrong</p>
          <h1 className="mb-3 text-2xl font-bold">The visualization could not be loaded.</h1>
          <p className="mb-6 text-sm text-slate-400">Return to the exercise list and try again.</p>
          <a href="/learn" className="inline-flex min-h-11 items-center rounded-xl bg-cyan-500 px-5 font-semibold text-slate-950">
            Back to exercises
          </a>
        </section>
      </main>
    );
  }
}
