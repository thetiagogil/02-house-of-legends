import gryffindorCrest from "../assets/gryffindor.webp";
import hufflepuffCrest from "../assets/hufflepuff.webp";
import ravenclawCrest from "../assets/ravenclaw.webp";
import slytherinCrest from "../assets/slytherin.webp";
import type { House } from "../types/league";

type HouseIconProps = {
  house: House;
  className?: string;
};

const houseCrests: Record<House, string> = {
  Gryffindor: gryffindorCrest,
  Hufflepuff: hufflepuffCrest,
  Ravenclaw: ravenclawCrest,
  Slytherin: slytherinCrest,
};

export function HouseIcon({ house, className = "" }: HouseIconProps) {
  return (
    <img
      src={houseCrests[house]}
      alt=""
      aria-hidden="true"
      className={className}
    />
  );
}
