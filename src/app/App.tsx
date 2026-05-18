import { BrowserRouter } from "react-router-dom";
import { Footer } from "../shared/components/layout/Footer";
import { Navbar } from "../shared/components/layout/Navbar";
import { AppRoutes } from "./AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
}
