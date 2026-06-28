export const PLAYBACK_SPEEDS = [
  { delay: 1500, label: "1.5s", description: "Slow" },
  { delay: 1000, label: "1.0s", description: "Relaxed" },
  { delay: 700, label: "0.7s", description: "Normal" },
  { delay: 400, label: "0.4s", description: "Fast" },
  { delay: 200, label: "0.2s", description: "Very fast" },
] as const;

export const DEFAULT_PLAYBACK_SPEED = 700;
export const PLAYBACK_SPEED_KEY = "algoviz-playback-speed-v1";
