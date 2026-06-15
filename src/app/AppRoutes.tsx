import { Route, Routes } from "react-router-dom";
import { BuildsPage } from "../pages/builds/BuildsPage";
import { EditBuildPage } from "../pages/builds/EditBuildPage";
import { NewBuildPage } from "../pages/builds/NewBuildPage";
import { ChampionDetailsPage } from "../pages/champions/ChampionDetailsPage";
import { ChampionsPage } from "../pages/champions/ChampionsPage";
import { HomePage } from "../pages/home/HomePage";
import { ItemsPage } from "../pages/items/ItemsPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/champions" element={<ChampionsPage />} />
      <Route path="/champions/:championId" element={<ChampionDetailsPage />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/builds" element={<BuildsPage />} />
      <Route path="/builds/new" element={<NewBuildPage />} />
      <Route path="/builds/:buildId/edit" element={<EditBuildPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
