interface VariablesPanelProps {
  variables?: Record<string, number | string | boolean>;
  accent?: "cyan" | "violet";
}

export function VariablesPanel({ variables, accent = "cyan" }: VariablesPanelProps) {
  if (!variables) return null;
  const keyColor = accent === "violet" ? "text-violet-400" : "text-cyan-400";
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {Object.entries(variables).map(([key, val]) => (
        <div
          key={key}
          className="glass-field flex items-center gap-1.5 rounded-xl px-2 py-1"
        >
          <span className={`${keyColor} font-mono text-xs`}>{key}</span>
          <span className="text-slate-400 text-xs">=</span>
          <span className="text-amber-300 font-mono text-xs font-bold">{String(val)}</span>
        </div>
      ))}
    </div>
  );
}
