import { BrowserRouter } from "react-router-dom";
import { Footer } from "../shared/components/layout/Footer";
import { Navbar } from "../shared/components/layout/Navbar";
import { AppRoutes } from "./AppRoutes";
import { ScrollToTop } from "./ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
