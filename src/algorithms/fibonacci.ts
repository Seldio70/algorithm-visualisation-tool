import type { AlgorithmDefinition, Step, ElementState } from "../types";
import { finalStep } from "./helpers";
import { STACK_QUEUE_LEGEND } from "../constants/legends";

function generateSteps(input: number[]): Step[] {
  const steps: Step[] = [];
  let stepId = 0;
  const n = Math.min(8, Math.max(0, input[0] ?? 5));
  const memo: Record<number, number> = {};

  steps.push({
    id: stepId++,
    elements: [{ id: "el-0", value: `fib(${n})`, state: "current", label: "call" }],
    highlightedLines: [1],
    explanation: `Recursive Fibonacci: fib(n) = fib(n-1) + fib(n-2). Calling fib(${n}) — watch the call stack grow and shrink.`,
    variables: { n },
    callStack: [`fib(${n})`],
  });

  function fib(k: number, stack: string[]): number {
    steps.push({
      id: stepId++,
      elements: stack.map((s, i) => ({
        id: `el-${i}`,
        value: s,
        state: i === stack.length - 1 ? "current" : "visited",
      })),
      highlightedLines: [2],
      explanation: `Enter fib(${k}). Base case: n ≤ 1 returns n directly.`,
      variables: { n: k },
      callStack: stack,
    });

    if (k <= 1) {
      steps.push({
        id: stepId++,
        elements: stack.map((s, i) => ({
          id: `el-${i}`,
          value: s,
          state: i === stack.length - 1 ? "sorted" : "visited",
        })),
        highlightedLines: [2],
        explanation: `Base case fib(${k}) = ${k}. Return ${k} and unwind the stack.`,
        variables: { result: k },
        callStack: stack,
      });
      return k;
    }

    const left = fib(k - 1, [...stack, `fib(${k - 1})`]);
    const right = fib(k - 2, [...stack, `fib(${k - 2})`]);
    const result = left + right;

    steps.push({
      id: stepId++,
      elements: [
        ...stack.map((s, i) => ({
          id: `el-${i}`,
          value: s,
          state: "visited" as ElementState,
        })),
        { id: "el-r", value: `${left}+${right}=${result}`, state: "highlight" as ElementState },
      ],
      highlightedLines: [3],
      explanation: `fib(${k}) = fib(${k - 1}) + fib(${k - 2}) = ${left} + ${right} = ${result}.`,
      variables: { fib_k: result },
      callStack: stack,
    });

    memo[k] = result;
    return result;
  }

  const result = fib(n, [`fib(${n})`]);

  steps.push({
    id: stepId++,
    elements: [{ id: "el-0", value: result, state: "sorted", label: `fib(${n})` }],
    highlightedLines: [6, 7, 8, 9],
    explanation: `Iterative approach uses O(1) space: loop from 2 to n, tracking prev two values. Same result, no stack explosion.`,
    variables: { iterative: result },
    callStack: [],
  });

  steps.push(
    finalStep(
      stepId,
      [{ id: "el-0", value: result, state: "sorted" }],
      `✅ fib(${n}) = ${result}. Recursive version made ~${2 ** n} redundant calls — memoization or iteration fixes this.`,
      "Fibonacci illustrates recursion vs iteration tradeoffs. Memoization (dynamic programming) turns O(2^n) into O(n). Essential for understanding call stacks and DP.",
      10
    )
  );

  return steps;
}

export const fibonacci: AlgorithmDefinition = {
  meta: {
    id: "fibonacci",
    name: "Fibonacci",
    category: "Classic",
    difficulty: "Beginner",
    layout: "stack",
    legend: STACK_QUEUE_LEGEND,
    timeComplexity: { best: "O(n)", average: "O(2^n)", worst: "O(2^n)" },
    spaceComplexity: "O(n)",
    description: "Computes Fibonacci numbers recursively vs iteratively, visualizing the call stack and redundant work.",
    defaultInput: [5],
    code: `function fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}\n// Iterative: O(n) time, O(1) space\nfunction fibIter(n) {\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];\n  return b;\n}`,
  },
  generateSteps,
};
