# House of Legends

House of Legends is a React + Vite + TypeScript mini encyclopedia for League of Legends champions and items.

The app uses Riot Data Dragon for champion and item data, and it stores custom champion builds in `localStorage`.

## Features

- Browse all champions
- Filter champions by role, house, and Runeterra region
- View champion details, skins, roles, stats, and lore
- Browse items grouped by category
- Create champion builds with one boots slot and five item slots
- Save builds locally in the browser
- Track wins, losses, total games, total item cost, and win rate
- Delete saved builds

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Raw CSS
- Data Dragon API
- Browser `localStorage`

## Project Structure

```txt
src/
  components/
  data/
  pages/
  services/
  types/
  App.tsx
  main.tsx
  index.css
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
```
