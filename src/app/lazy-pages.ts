import { lazy } from "react";

export const BuildsPage = lazy(() =>
  import("../pages/builds/BuildsPage").then((module) => ({
    default: module.BuildsPage,
  })),
);

export const EditBuildPage = lazy(() =>
  import("../pages/builds/EditBuildPage").then((module) => ({
    default: module.EditBuildPage,
  })),
);

export const NewBuildPage = lazy(() =>
  import("../pages/builds/NewBuildPage").then((module) => ({
    default: module.NewBuildPage,
  })),
);

export const ChampionDetailsPage = lazy(() =>
  import("../pages/champions/ChampionDetailsPage").then((module) => ({
    default: module.ChampionDetailsPage,
  })),
);

export const ChampionsPage = lazy(() =>
  import("../pages/champions/ChampionsPage").then((module) => ({
    default: module.ChampionsPage,
  })),
);

export const HomePage = lazy(() =>
  import("../pages/home/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);

export const ItemsPage = lazy(() =>
  import("../pages/items/ItemsPage").then((module) => ({
    default: module.ItemsPage,
  })),
);

export const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);
