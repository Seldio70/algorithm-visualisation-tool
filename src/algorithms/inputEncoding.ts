const FIELD_SEPARATOR = 0;

export function encodeText(value: string): number[] {
  return [...value].map((character) => character.charCodeAt(0));
}

export function decodeText(input: number[], fallback: string): string {
  if (!input.length) return fallback;
  const decoded = input
    .filter((code) => code > 0 && code <= 0xffff)
    .map((code) => String.fromCharCode(code))
    .join("");
  return decoded || fallback;
}

export function encodeTextPair(first: string, second: string): number[] {
  return [...encodeText(first), FIELD_SEPARATOR, ...encodeText(second)];
}

export function decodeTextPair(
  input: number[],
  fallbackFirst: string,
  fallbackSecond: string
): [string, string] {
  const separator = input.indexOf(FIELD_SEPARATOR);
  if (separator < 0) return [fallbackFirst, fallbackSecond];
  return [
    decodeText(input.slice(0, separator), fallbackFirst),
    decodeText(input.slice(separator + 1), fallbackSecond),
  ];
}
