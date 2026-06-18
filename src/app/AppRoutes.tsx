import { Route, Routes } from "react-router-dom";
import {
  BuildsPage,
  ChampionDetailsPage,
  ChampionsPage,
  EditBuildPage,
  HomePage,
  ItemsPage,
  NewBuildPage,
  NotFoundPage,
} from "./lazy-pages";
import { RouteSuspense } from "./RouteSuspense";

export const AppRoutes = () => {
  return (
    <RouteSuspense>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/champions" element={<ChampionsPage />} />
        <Route
          path="/champions/:championId"
          element={<ChampionDetailsPage />}
        />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/builds" element={<BuildsPage />} />
        <Route path="/builds/new" element={<NewBuildPage />} />
        <Route path="/builds/:buildId/edit" element={<EditBuildPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </RouteSuspense>
  );
};
