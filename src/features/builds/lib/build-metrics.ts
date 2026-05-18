import type { Build } from "../types";

export function getBuildCost(build: Build): number {
  return build.items.reduce((total, item) => total + item.price, 0);
}

export function getBuildGames(build: Build): number {
  return build.win + build.loss;
}

export function getBuildsTotalGames(builds: Build[]): number {
  return builds.reduce((total, build) => total + getBuildGames(build), 0);
}
