import type { House } from "../types/league"

export const HOUSES: House[] = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"]

export const houseSigils: Record<House, { sigil: string; className: string }> = {
  Gryffindor: { sigil: "🦁", className: "house--gryffindor" },
  Hufflepuff: { sigil: "🦡", className: "house--hufflepuff" },
  Ravenclaw: { sigil: "🦅", className: "house--ravenclaw" },
  Slytherin: { sigil: "🐍", className: "house--slytherin" },
}
