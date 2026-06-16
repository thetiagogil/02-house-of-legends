import type { Build } from "../types";

export const calculateWinRate = (build: Build): number => {
  const games = build.win + build.loss;

  if (games === 0) {
    return 0;
  }

  if (build.loss === 0 && build.win > 0) {
    return 100;
  }

  return Math.round((build.win / games) * 100);
};

export const getWinRateClass = (rate: number, games: number): string => {
  if (games === 0) {
    return "win-rate win-rate--empty";
  }

  if (rate >= 75) {
    return "win-rate win-rate--high";
  }

  if (rate >= 50) {
    return "win-rate win-rate--good";
  }

  return "win-rate win-rate--low";
};
