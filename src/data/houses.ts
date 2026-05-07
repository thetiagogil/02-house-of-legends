import type { ChampionInfo, House, Region } from "../types/league"

export const HOUSES: House[] = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"]

export const houseStyles: Record<House, { className: string }> = {
  Gryffindor: { className: "house--gryffindor" },
  Hufflepuff: { className: "house--hufflepuff" },
  Ravenclaw: { className: "house--ravenclaw" },
  Slytherin: { className: "house--slytherin" },
}

type HouseScores = Record<House, number>

type HouseScoreInput = {
  id: string
  tags: string[]
  info: ChampionInfo
  region: Region
}

const roleScores: Record<string, Partial<HouseScores>> = {
  Assassin: { Slytherin: 4, Gryffindor: 1 },
  Fighter: { Gryffindor: 3, Slytherin: 1 },
  Mage: { Ravenclaw: 3, Slytherin: 1 },
  Marksman: { Ravenclaw: 2, Gryffindor: 1 },
  Support: { Hufflepuff: 3, Ravenclaw: 1 },
  Tank: { Hufflepuff: 2, Gryffindor: 2 },
}

const regionScores: Partial<Record<Region, Partial<HouseScores>>> = {
  Demacia: { Gryffindor: 3, Hufflepuff: 1 },
  Noxus: { Slytherin: 3, Gryffindor: 1 },
  Ionia: { Hufflepuff: 3, Ravenclaw: 1 },
  Freljord: { Hufflepuff: 2, Gryffindor: 2 },
  Piltover: { Ravenclaw: 3, Hufflepuff: 1 },
  Zaun: { Ravenclaw: 2, Slytherin: 2 },
  Shurima: { Ravenclaw: 2, Slytherin: 1, Gryffindor: 1 },
  Targon: { Ravenclaw: 2, Gryffindor: 2 },
  ShadowIsles: { Slytherin: 4 },
  Bilgewater: { Gryffindor: 2, Slytherin: 2 },
  Void: { Slytherin: 3, Ravenclaw: 1 },
  Bandle: { Hufflepuff: 2, Gryffindor: 1, Ravenclaw: 1 },
  Ixtal: { Ravenclaw: 3, Hufflepuff: 1 },
  Runeterra: { Slytherin: 1, Hufflepuff: 1, Gryffindor: 1, Ravenclaw: 1 },
}

function addScores(scores: HouseScores, values: Partial<HouseScores>) {
  for (const house of HOUSES) {
    scores[house] += values[house] ?? 0
  }
}

function getTieBreaker(championId: string, house: House): number {
  const seed = championId.split("").reduce((total, character) => total + character.charCodeAt(0), 0)
  return (seed + HOUSES.indexOf(house) * 7) % HOUSES.length
}

export function getHouseForChampion({ id, tags, info, region }: HouseScoreInput): House {
  const scores: HouseScores = {
    Gryffindor: 0,
    Hufflepuff: 0,
    Ravenclaw: 0,
    Slytherin: 0,
  }

  addScores(scores, regionScores[region] ?? {})

  for (const tag of tags) {
    addScores(scores, roleScores[tag] ?? {})
  }

  if (info.attack >= 7) {
    scores.Gryffindor += 2
  }

  if (info.defense >= 7) {
    scores.Hufflepuff += 2
  }

  if (info.magic >= 7) {
    scores.Ravenclaw += 2
  }

  if (info.difficulty >= 7) {
    scores.Slytherin += 2
    scores.Ravenclaw += 1
  }

  return [...HOUSES].sort((firstHouse, secondHouse) => {
    const scoreDifference = scores[secondHouse] - scores[firstHouse]

    if (scoreDifference !== 0) {
      return scoreDifference
    }

    return getTieBreaker(id, secondHouse) - getTieBreaker(id, firstHouse)
  })[0]
}
