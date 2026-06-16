import { HomeHero } from "./_components/HomeHero";
import { HomeTiles } from "./_components/HomeTiles";

export const HomePage = () => {
  return (
    <div className="page-container page-container--home">
      <HomeHero />
      <HomeTiles />
    </div>
  );
};
