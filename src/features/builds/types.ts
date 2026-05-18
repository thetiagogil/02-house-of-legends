export type BuildItem = {
  id: string;
  name: string;
  price: number;
};

export type Build = {
  id: string;
  title: string;
  champion: {
    id: string;
    name: string;
    key: string;
  };
  items: BuildItem[];
  win: number;
  loss: number;
  createdAt: number;
};
