import { Link, useNavigate, useParams } from "react-router-dom";
import { ChampionNavigation } from "../../features/champions/components/ChampionNavigation";
import { ChampionPanel } from "../../features/champions/components/ChampionPanel";
import { ChampionSkinHero } from "../../features/champions/components/ChampionSkinHero";
import { useChampionDetails } from "../../features/champions/hooks/useChampionDetails";
import { ErrorState } from "../../shared/components/ui/ErrorState";
import { LoadingState } from "../../shared/components/ui/LoadingState";

export const ChampionDetailsPage = () => {
  const { championId } = useParams();
  const navigate = useNavigate();
  const details = useChampionDetails(championId);

  if (details.isLoading) {
    return <LoadingState label="Summoning champion..." />;
  }

  if (details.error || !details.champion) {
    return (
      <div className="page-container">
        <ErrorState
          title="This realm does not exist."
          message={details.error || "Champion not found."}
        />
        <div className="center-actions">
          <Link to="/champions" className="text-link">
            Back to champions
          </Link>
        </div>
      </div>
    );
  }

  const navigateToPreviousChampion = () => {
    if (details.previousChampion) {
      navigate(`/champions/${details.previousChampion.id}`);
    }
  };

  const navigateToNextChampion = () => {
    if (details.nextChampion) {
      navigate(`/champions/${details.nextChampion.id}`);
    }
  };

  return (
    <div className="champion-detail">
      <ChampionSkinHero
        currentSkin={details.currentSkin}
        skinIndex={details.skinIndex}
        splashImage={details.splashImage}
        visibleSkins={details.visibleSkins}
        onNextSkin={details.showNextSkin}
        onPreviousSkin={details.showPreviousSkin}
        onSkinSelect={details.setSkinIndex}
      />

      <section className="champion-panel-wrap">
        <ChampionPanel champion={details.champion} />

        <ChampionNavigation
          previousChampion={details.previousChampion}
          nextChampion={details.nextChampion}
          onPrevious={navigateToPreviousChampion}
          onNext={navigateToNextChampion}
        />
      </section>
    </div>
  );
};
