import type { House } from "../types/league"

type HouseIconProps = {
  house: House
  className?: string
}

function HouseShield() {
  return (
    <>
      <path d="M32 5 13 12v15c0 14.5 7.9 24.4 19 30 11.1-5.6 19-15.5 19-30V12z" fill="currentColor" opacity="0.08" />
      <path d="M32 5 13 12v15c0 14.5 7.9 24.4 19 30 11.1-5.6 19-15.5 19-30V12z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </>
  )
}

export function HouseIcon({ house, className = "" }: HouseIconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <HouseShield />

      {house === "Gryffindor" && (
        <>
          <path
            d="M32 16 36 22l7-1-3 7 5 5-7 2 1 8-7-4-7 4 1-8-7-2 5-5-3-7 7 1z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M25 29c0-5 3-9 7-9s7 4 7 9c0 6-3 10-7 10s-7-4-7-10Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M28 26h1.5M34.5 26H36M30 31h4M27 38c3 3 7 3 10 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M23 24c-2 4-2 10 1 15M41 24c2 4 2 10-1 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {house === "Hufflepuff" && (
        <>
          <path
            d="M21 34c0-9 5-15 11-15s11 6 11 15c0 8-5 13-11 13s-11-5-11-13Z"
            fill="currentColor"
            opacity="0.16"
          />
          <path
            d="M21 34c0-9 5-15 11-15s11 6 11 15c0 8-5 13-11 13s-11-5-11-13Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="m23 25-5-6M41 25l5-6M27 20l-4 20M37 20l4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M28 33h1M35 33h1M30 39h4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M31 37h2l-1 2z" fill="currentColor" />
        </>
      )}

      {house === "Ravenclaw" && (
        <>
          <path
            d="M14 35c8-12 14-16 18-16s10 4 18 16c-8-4-14-4-18 0-4-4-10-4-18 0Z"
            fill="currentColor"
            opacity="0.18"
          />
          <path
            d="M14 35c8-12 14-16 18-16s10 4 18 16c-8-4-14-4-18 0-4-4-10-4-18 0Z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M32 19v25M25 27l-9-6M39 27l9-6M23 33l-8 3M41 33l8 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="m32 18 5 5-5 3-5-3z" fill="currentColor" />
        </>
      )}

      {house === "Slytherin" && (
        <>
          <path
            d="M41 19c-8-5-21-2-21 7 0 10 20 5 20 15 0 8-13 9-23 2"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="m39 18 8 2-5 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29 27c4 2 8 2 12 1M29 37c4-2 8-2 11-1" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M43 21h1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M17 43 13 47" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
