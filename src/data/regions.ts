import type { Region } from "../types/league"

const DEFAULT_REGION: Region = "Runeterra"

export const REGION_LABEL: Record<string, string> = {
  Demacia: "Demacia",
  Noxus: "Noxus",
  Ionia: "Ionia",
  Freljord: "Freljord",
  Piltover: "Piltover",
  Zaun: "Zaun",
  Shurima: "Shurima",
  Targon: "Mount Targon",
  ShadowIsles: "Shadow Isles",
  Bilgewater: "Bilgewater",
  Void: "The Void",
  Bandle: "Bandle City",
  Ixtal: "Ixtal",
  Runeterra: "Runeterra",
}

const REGION_ALIASES: Record<string, Region> = {
  bandlecity: "Bandle",
  mounttargon: "Targon",
  shadowisles: "ShadowIsles",
  thevoid: "Void",
  unaffiliated: "Unaffiliated",
}

function normalizeRegionValue(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]/g, "")
}

function formatRegionLabel(value: string): Region | null {
  const words = value
    .trim()
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)

  if (words.length === 0) {
    return null
  }

  return words.map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`).join(" ")
}

function normalizeExplicitRegion(value: string): Region | null {
  const normalizedValue = value.trim().toLowerCase().replace(/[\s_-]/g, "")

  if (!normalizedValue) {
    return null
  }

  const alias = REGION_ALIASES[normalizedValue]

  if (alias) {
    return alias
  }

  const knownRegion = Object.entries(REGION_LABEL).find(([region, label]) => {
    return normalizeRegionValue(region) === normalizedValue || normalizeRegionValue(label) === normalizedValue
  })?.[0]

  return knownRegion ?? formatRegionLabel(value)
}

export function getRegionLabel(region: Region): string {
  return REGION_LABEL[region] ?? region
}

export function normalizeRegion(explicitRegion?: string): Region {
  if (explicitRegion) {
    const knownRegion = normalizeExplicitRegion(explicitRegion)

    if (knownRegion) {
      return knownRegion
    }
  }

  return DEFAULT_REGION
}
