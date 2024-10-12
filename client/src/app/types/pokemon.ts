export interface Team {
  id: string;
  team_name: string;
  total_power: number;
}

export interface Pokemon {
  name: string;
  type: string;
  life: number;
  power: number;
  image: string;
  isKO?: boolean;
}
