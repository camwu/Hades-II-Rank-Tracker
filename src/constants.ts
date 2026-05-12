
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
  bossResourceName: string;
  bossResourceQty: number;
  bossResourceImageUrl: string;
  cumulativeKudos: number;
  cumulativeResources: ResourceCost[];
  imageUrl: string;
}

export const RANK_COLORS: Record<string, string> = {
  "Unranked": "#334155",  // Slate
  "Wraith": "#64748b",   // Grey
  "Specter": "#b45309",  // Bronze
  "Revenant": "#ffffff", // White
  "Nightmare": "#a855f7", // Purple
  "Unseen": "#eab308",    // Gold
};

const LEVEL_RESOURCES: Record<number, string> = {
  10: "Feather",
  9: "Golden Apple",
  8: "Pearl",
  7: "Wool",
  6: "Moon Dust",
  5: "Cinder",
  4: "Tears",
  3: "Nightmare",
  2: "Void Lens",
  1: "Zodiac Sand",
  0: "None"
};

export const RESOURCE_ORDER = [
  ["Kudos", null],
  ["Feather", "Cinder"],
  ["Golden Apple", "Tears"],
  ["Pearl", "Nightmare"],
  ["Wool", "Void Lens"],
  ["Moon Dust", "Zodiac Sand"]
];

const GROUP_QUANTITY: Record<string, number> = {
  "Wraith": 1,
  "Specter": 2,
  "Revenant": 3,
  "Nightmare": 4,
  "Unseen": 5
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
  if (num === 0) return "";
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
  const resourceTotals: Record<string, number> = {};
  
  const ranks: Rank[] = RAW_DATA.map((item, index) => {
    cumulativeKudos += item.cost;
    const name = `${item.group} ${toRoman(item.level)}`;
    const resourceQty = GROUP_QUANTITY[item.group] || 1;
    const resourceName = LEVEL_RESOURCES[item.level] || "N/A";
    
    // Track cumulative resources
    resourceTotals[resourceName] = (resourceTotals[resourceName] || 0) + resourceQty;
    
    const cumulativeResources = Object.entries(resourceTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return {
      id: index + 1,
      name,
      colorName: item.group,
      colorHex: RANK_COLORS[item.group] || "#ffffff",
      kudos: item.cost,
      resources: [],
      bossResourceName: resourceName,
      bossResourceQty: resourceQty,
      bossResourceImageUrl: `/assets/resources/${resourceName.replace(/\s+/g, '_')}.png`,
      cumulativeKudos,
      cumulativeResources,
      imageUrl: `/assets/ranks/${name.replace(/\s+/g, '_')}.png`
    };
  });

  const unranked: Rank = {
    id: 0,
    name: "Unranked",
    colorName: "Unranked",
    colorHex: RANK_COLORS["Unranked"],
    kudos: 0,
    resources: [],
    bossResourceName: "None",
    bossResourceQty: 0,
    bossResourceImageUrl: "/assets/resources/None.png",
    cumulativeKudos: 0,
    cumulativeResources: [],
    imageUrl: "/assets/ranks/Unranked.png"
  };

  return [unranked, ...ranks];
}

export const RANKS = processRanks();
export const TOTAL_KUDOS = RANKS[RANKS.length - 1].cumulativeKudos;
