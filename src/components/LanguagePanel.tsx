import { useState } from "react";
import type { ThemeAccent } from "../types";
import { IMPLEMENTATIONS } from "../data/implementations";
import { EXPLANATIONS } from "../data/explanations";
import { CodePanel } from "./CodePanel";

interface LanguagePanelProps {
  algorithmId: string;
  accent?: ThemeAccent;
  pseudocode?: string;
}

type Tab = "pseudo" | "java" | "c" | "python";

const TAB_LABELS: Record<Tab, string> = {
  pseudo: "Pseudocode",
  java: "Java",
  c: "C",
  python: "Python",
};

const ACCENT_DOT: Record<ThemeAccent, string> = {
  cyan: "bg-cyan-400",
  violet: "bg-violet-400",
};

const ACCENT_TAB_ACTIVE: Record<ThemeAccent, string> = {
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  violet: "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

export function LanguagePanel({ algorithmId, accent = "cyan", pseudocode }: LanguagePanelProps) {
  const impl = IMPLEMENTATIONS[algorithmId];
  const explanation = EXPLANATIONS[algorithmId];
  const [tab, setTab] = useState<Tab>(pseudocode ? "pseudo" : "java");

  if (!impl) return null;

  const tabs: Tab[] = pseudocode ? ["pseudo", "java", "c", "python"] : ["java", "c", "python"];

  const bullets = tab === "pseudo" ? explanation?.pseudoExplanation : explanation?.[tab];

  const languageImpl = tab === "pseudo" ? undefined : impl[tab];

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 flex-wrap" role="tablist" aria-label="Language">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`min-h-9 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 border ${
              tab === t
                ? ACCENT_TAB_ACTIVE[accent]
                : "glass-control border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div className={bullets && bullets.length > 0 ? "grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5 items-start" : ""}>
        <div className="space-y-2 min-w-0">
          {tab === "pseudo" && pseudocode ? (
            <div className="glass-card rounded-2xl p-3">
              <CodePanel code={pseudocode} highlightedLines={[]} accent={accent} />
            </div>
          ) : (
            languageImpl && (
              <>
                <div className="glass-card rounded-2xl p-4 overflow-auto max-h-80">
                  <SyntaxCode code={languageImpl.code} lang={tab as "java" | "c" | "python"} />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed px-1">{languageImpl.note}</p>
              </>
            )
          )}
        </div>

        {bullets && bullets.length > 0 && <ExplanationPanel bullets={bullets} accent={accent} />}
      </div>
    </div>
  );
}

function ExplanationPanel({ bullets, accent }: { bullets: string[]; accent: ThemeAccent }) {
  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">How it works</p>
      <ul className="space-y-2.5">
        {bullets.map((bullet, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${ACCENT_DOT[accent]}`} />
            <span className="text-sm text-slate-300 leading-relaxed">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Tokenizer-based syntax highlighter ──────────────────────────────────────

type TokenKind = "kw" | "ty" | "num" | "str" | "cmt" | "pre" | "fn" | "plain";

interface Token {
  kind: TokenKind;
  text: string;
}

const TOKEN_CLASSES: Record<TokenKind, string> = {
  kw: "text-violet-400",
  ty: "text-sky-400",
  num: "text-amber-300",
  str: "text-emerald-400",
  cmt: "text-slate-500 italic",
  pre: "text-rose-400",
  fn: "text-cyan-300",
  plain: "text-slate-300",
};

const KEYWORDS: Record<"java" | "c" | "python", Set<string>> = {
  java: new Set([
    "public", "private", "protected", "static", "final", "class", "interface", "extends",
    "implements", "new", "return", "if", "else", "for", "while", "do", "switch", "case",
    "break", "continue", "default", "void", "this", "super", "import", "package", "try",
    "catch", "finally", "throw", "throws", "null", "true", "false", "instanceof",
  ]),
  c: new Set([
    "int", "char", "float", "double", "long", "short", "unsigned", "signed", "void", "struct",
    "typedef", "const", "static", "return", "if", "else", "for", "while", "do", "switch", "case",
    "break", "continue", "default", "sizeof", "NULL", "bool", "true", "false", "union", "enum",
  ]),
  python: new Set([
    "def", "return", "if", "elif", "else", "for", "while", "break", "continue", "import", "from",
    "as", "class", "try", "except", "finally", "raise", "with", "lambda", "pass", "is", "not",
    "and", "or", "in", "None", "True", "False", "global", "yield",
  ]),
};

const TYPES: Record<"java" | "c" | "python", Set<string>> = {
  java: new Set(["int", "long", "double", "float", "boolean", "char", "byte", "short", "String", "Object"]),
  c: new Set(["int", "char", "float", "double", "long", "short", "unsigned", "signed", "void", "bool"]),
  python: new Set([]),
};

function tokenize(code: string, lang: "java" | "c" | "python"): Token[] {
  const tokens: Token[] = [];
  const kw = KEYWORDS[lang];
  const ty = TYPES[lang];
  let i = 0;
  const n = code.length;

  while (i < n) {
    const ch = code[i];

    // Line comments
    if (lang === "python" && ch === "#") {
      let j = i;
      while (j < n && code[j] !== "\n") j++;
      tokens.push({ kind: "cmt", text: code.slice(i, j) });
      i = j;
      continue;
    }
    if ((lang === "java" || lang === "c") && ch === "/" && code[i + 1] === "/") {
      let j = i;
      while (j < n && code[j] !== "\n") j++;
      tokens.push({ kind: "cmt", text: code.slice(i, j) });
      i = j;
      continue;
    }
    if ((lang === "java" || lang === "c") && ch === "/" && code[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(code[j] === "*" && code[j + 1] === "/")) j++;
      j = Math.min(j + 2, n);
      tokens.push({ kind: "cmt", text: code.slice(i, j) });
      i = j;
      continue;
    }

    // Preprocessor directives (C)
    if (lang === "c" && ch === "#") {
      let j = i;
      while (j < n && code[j] !== "\n") j++;
      tokens.push({ kind: "pre", text: code.slice(i, j) });
      i = j;
      continue;
    }

    // Strings / chars
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < n && code[j] !== quote) {
        if (code[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, n);
      tokens.push({ kind: "str", text: code.slice(i, j) });
      i = j;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9.xXa-fA-F]/.test(code[j])) j++;
      tokens.push({ kind: "num", text: code.slice(i, j) });
      i = j;
      continue;
    }

    // Identifiers / keywords / types / function calls
    if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      let kind: TokenKind = "plain";
      if (kw.has(word)) kind = "kw";
      else if (ty.has(word)) kind = "ty";
      else if (code[j] === "(") kind = "fn";
      tokens.push({ kind, text: word });
      i = j;
      continue;
    }

    // Whitespace / punctuation — accumulate raw
    let j = i;
    while (j < n && !/[A-Za-z0-9_"'#]/.test(code[j]) && !(code[j] === "/" && (code[j + 1] === "/" || code[j + 1] === "*"))) j++;
    if (j === i) j = i + 1;
    tokens.push({ kind: "plain", text: code.slice(i, j) });
    i = j;
  }

  return tokens;
}

function SyntaxCode({ code, lang }: { code: string; lang: "java" | "c" | "python" }) {
  const tokens = tokenize(code, lang);
  return (
    <pre className="font-mono text-[13px] leading-relaxed whitespace-pre overflow-visible">
      {tokens.map((t, i) => (
        <span key={i} className={TOKEN_CLASSES[t.kind]}>
          {t.text}
        </span>
      ))}
    </pre>
  );
}
