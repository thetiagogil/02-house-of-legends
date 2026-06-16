import type { Build } from "../types";

export const getBuildCost = (build: Build): number => {
  return build.items.reduce((total, item) => total + item.price, 0);
};

export const getBuildGames = (build: Build): number => {
  return build.win + build.loss;
};

export const getBuildsTotalGames = (builds: Build[]): number => {
  return builds.reduce((total, build) => total + getBuildGames(build), 0);
};
