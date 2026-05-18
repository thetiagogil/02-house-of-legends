export const championImages = {
  loading: (championId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`,
  splash: (championId: string, skin = 0) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championId}_${skin}.jpg`,
  centered: (championId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/centered/${championId}_0.jpg`,
  tile: (championId: string) =>
    `https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${championId}_0.jpg`,
};
