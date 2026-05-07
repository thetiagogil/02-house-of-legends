import type { House } from "../types/league"

type HouseIconProps = {
  house: House
  className?: string
}

export function HouseIcon({ house, className = "" }: HouseIconProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {house === "Gryffindor" && (
        <>
          <path d="M16 3 7 7v7c0 6.5 3.7 10.9 9 14 5.3-3.1 9-7.5 9-14V7z" stroke="currentColor" strokeWidth="2" />
          <path d="M16 8v14M11 12h10M12 22h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M16 6 13 9h6z" fill="currentColor" />
        </>
      )}
      {house === "Hufflepuff" && (
        <>
          <path d="M6 21c4-9 9-14 20-14-1 10-6 16-16 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M8 24c5-5 9-8 16-11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M11 18h7M15 14h6M19 10h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
      {house === "Ravenclaw" && (
        <>
          <path d="M5 22c7-1 12-5 16-14 2 5 1 11-3 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M9 19c3-1 6-4 8-9M14 23c2-2 4-5 5-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M22 7l5 2-5 2z" fill="currentColor" />
        </>
      )}
      {house === "Slytherin" && (
        <>
          <path d="M24 8c-5-3-13-1-13 4 0 6 12 3 12 9 0 5-8 6-15 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M22 7h5l-3 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 23l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
