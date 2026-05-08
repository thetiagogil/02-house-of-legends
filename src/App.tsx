import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { BuildsPage } from "./pages/BuildsPage";
import { ChampionDetailsPage } from "./pages/ChampionDetailsPage";
import { ChampionsPage } from "./pages/ChampionsPage";
import { HomePage } from "./pages/HomePage";
import { ItemsPage } from "./pages/ItemsPage";
import { NewBuildPage } from "./pages/NewBuildPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
