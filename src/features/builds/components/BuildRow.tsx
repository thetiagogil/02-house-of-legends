import { Link } from "react-router-dom";
import { Icon } from "../../../shared/components/ui/Icon";
import { itemImage } from "../../items/lib/item-images";
import { useBuildRowActions } from "../hooks/useBuildRowActions";
import { getBuildCost, getBuildGames } from "../lib/build-metrics";
import { calculateWinRate, getWinRateClass } from "../lib/win-rate";
import type { Build } from "../types";
import { BuildDeleteDialog } from "./BuildDeleteDialog";
import { BuildStat } from "./BuildStat";
import { CounterStat } from "./CounterStat";

type BuildRowProps = {
  build: Build;
  version: string;
  onChange: () => void;
};

export const BuildRow = ({ build, version, onChange }: BuildRowProps) => {
  const {
    changeLosses,
    changeWins,
    closeDeleteDialog,
    confirmDelete,
    isDeleteDialogOpen,
    openDeleteDialog,
    showRecordControls,
    toggleRecordControls,
  } = useBuildRowActions({ build, onChange });
  const games = getBuildGames(build);
  const rate = calculateWinRate(build);
  const totalCost = getBuildCost(build);

  return (
    <div className="build-row">
      <div className="build-row__summary">
        <div className="build-row__title">
          <h3>{build.title}</h3>
          <small>{new Date(build.createdAt).toLocaleDateString()}</small>
        </div>

        <div className="build-row__items">
          {build.items.map((item, index) =>
            version ? (
              <img
                key={`${item.id}-${index}`}
                src={itemImage(version, `${item.id}.png`)}
                alt={item.name}
                title={item.name}
                loading="lazy"
              />
            ) : (
              <span
                key={`${item.id}-${index}`}
                className="build-row__item-placeholder"
                title={item.name}
              />
            ),
          )}
        </div>

        <div className="build-row__stats">
          <BuildStat label="Cost" value={`${totalCost.toLocaleString()}g`} />
          <BuildStat label="Record" value={`${build.win}W / ${build.loss}L`} />
          <BuildStat
            label="Win Rate"
            value={`${rate}%`}
            className={getWinRateClass(rate, games)}
          />
        </div>

        <div className="build-row__actions">
          <Link
            to={`/builds/${build.id}/edit`}
            className="build-row__icon-action"
            aria-label={`Edit ${build.title}`}
            title="Edit build"
          >
            <Icon name="edit" size={16} />
          </Link>
          <button
            type="button"
            onClick={toggleRecordControls}
            className={
              showRecordControls
                ? "build-row__icon-action build-row__icon-action--active"
                : "build-row__icon-action"
            }
            aria-label={
              showRecordControls
                ? "Hide win/loss controls"
                : "Edit wins and losses"
            }
            title={
              showRecordControls
                ? "Hide win/loss controls"
                : "Edit wins and losses"
            }
          >
            <Icon name="chart" size={16} />
          </button>
          <button
            type="button"
            onClick={openDeleteDialog}
            aria-label="Delete build"
            aria-haspopup="dialog"
            aria-expanded={isDeleteDialogOpen}
            className="build-row__icon-action danger-action"
            title="Delete build"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>

      {isDeleteDialogOpen && (
        <BuildDeleteDialog
          buildTitle={build.title}
          onCancel={closeDeleteDialog}
          onConfirm={confirmDelete}
        />
      )}

      {showRecordControls && (
        <div
          className="build-row__record-edit"
          aria-label="Edit wins and losses"
        >
          <CounterStat
            label="Wins"
            value={build.win}
            onAdd={() => changeWins(1)}
            onSubtract={() => changeWins(-1)}
          />
          <CounterStat
            label="Losses"
            value={build.loss}
            onAdd={() => changeLosses(1)}
            onSubtract={() => changeLosses(-1)}
          />
        </div>
      )}
    </div>
  );
};
