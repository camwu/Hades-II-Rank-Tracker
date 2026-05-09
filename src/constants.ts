
export interface ResourceCost {
  name: string;
  amount: number;
}

export interface Rank {
  id: number;
  name: string;
  colorName: string;
  colorHex: string;
  kudos: number;
  resources: ResourceCost[];
  cumulativeKudos: number;
  imageUrl: string;
}

export const RANK_COLORS: Record<string, string> = {
  "Wraith": "#64748b",   // Grey
  "Specter": "#b45309",  // Bronze
  "Revenant": "#ffffff", // White
  "Nightmare": "#a855f7", // Purple
  "Unseen": "#eab308",    // Gold
};

const RAW_DATA = [
  { group: "Wraith", level: 10, cost: 1000 },
  { group: "Wraith", level: 9, cost: 1050 },
  { group: "Wraith", level: 8, cost: 1100 },
  { group: "Wraith", level: 7, cost: 1150 },
  { group: "Wraith", level: 6, cost: 1200 },
  { group: "Wraith", level: 5, cost: 1250 },
  { group: "Wraith", level: 4, cost: 1300 },
  { group: "Wraith", level: 3, cost: 1350 },
  { group: "Wraith", level: 2, cost: 1400 },
  { group: "Wraith", level: 1, cost: 1450 },
  { group: "Specter", level: 10, cost: 1000 },
  { group: "Specter", level: 9, cost: 1100 },
  { group: "Specter", level: 8, cost: 1200 },
  { group: "Specter", level: 7, cost: 1300 },
  { group: "Specter", level: 6, cost: 1400 },
  { group: "Specter", level: 5, cost: 1500 },
  { group: "Specter", level: 4, cost: 1600 },
  { group: "Specter", level: 3, cost: 1700 },
  { group: "Specter", level: 2, cost: 1800 },
  { group: "Specter", level: 1, cost: 1900 },
  { group: "Revenant", level: 10, cost: 1000 },
  { group: "Revenant", level: 9, cost: 1150 },
  { group: "Revenant", level: 8, cost: 1300 },
  { group: "Revenant", level: 7, cost: 1450 },
  { group: "Revenant", level: 6, cost: 1600 },
  { group: "Revenant", level: 5, cost: 1750 },
  { group: "Revenant", level: 4, cost: 1900 },
  { group: "Revenant", level: 3, cost: 2050 },
  { group: "Revenant", level: 2, cost: 2200 },
  { group: "Revenant", level: 1, cost: 2350 },
  { group: "Nightmare", level: 10, cost: 1000 },
  { group: "Nightmare", level: 9, cost: 1200 },
  { group: "Nightmare", level: 8, cost: 1400 },
  { group: "Nightmare", level: 7, cost: 1600 },
  { group: "Nightmare", level: 6, cost: 1800 },
  { group: "Nightmare", level: 5, cost: 2000 },
  { group: "Nightmare", level: 4, cost: 2200 },
  { group: "Nightmare", level: 3, cost: 2400 },
  { group: "Nightmare", level: 2, cost: 2600 },
  { group: "Nightmare", level: 1, cost: 2800 },
  { group: "Unseen", level: 10, cost: 1000 },
  { group: "Unseen", level: 9, cost: 1500 },
  { group: "Unseen", level: 8, cost: 2000 },
  { group: "Unseen", level: 7, cost: 2500 },
  { group: "Unseen", level: 6, cost: 3000 },
  { group: "Unseen", level: 5, cost: 3500 },
  { group: "Unseen", level: 4, cost: 4000 },
  { group: "Unseen", level: 3, cost: 4500 },
  { group: "Unseen", level: 2, cost: 5000 },
  { group: "Unseen", level: 1, cost: 5500 },
];

function toRoman(num: number): string {
  const lookup: Record<string, number> = {
    X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let roman = "";
  for (let i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

function processRanks(): Rank[] {
  let cumulativeKudos = 0;
  return RAW_DATA.map((item, index) => {
    cumulativeKudos += item.cost;
    const name = `${item.group} ${toRoman(item.level)}`;
    return {
      id: index + 1,
      name,
      colorName: item.group,
      colorHex: RANK_COLORS[item.group] || "#ffffff",
      kudos: item.cost,
      resources: [],
      cumulativeKudos,
      imageUrl: `/assets/ranks/${name.replace(/\s+/g, '_')}.png`
    };
  });
}

export const RANKS = processRanks();
export const TOTAL_KUDOS = RANKS[RANKS.length - 1].cumulativeKudos;
