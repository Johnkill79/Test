export type Transmission = "Automatic" | "Manual";

export type Car = {
  id: string;
  name: string;
  pricePerDay: number;
  currency: string;
  seats: number;
  transmission: Transmission;
  image?: string;
  featured?: boolean;
};

export type Review = {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date?: string; // YYYY-MM-DD
};

