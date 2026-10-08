// Shared types for the cattery frontend
export type Personality = "calm" | "playful" | "independent" | "affectionate";

export type KittenStatus = "available" | "reserved" | "adopted" | "expected";

export interface Producer {
  id: string;
  name: string;
  role: "male" | "female";
  color: string;
  colorLabel: string;
  birthDate: string;
  imageUrl: string;
  bio: string;
  personality: Personality;
  retired: boolean;
  documents: string; // JSON array
  registry: string;
}

export interface Kitten {
  id: string;
  name: string;
  color: string;
  colorLabel: string;
  gender: "male" | "female";
  personality: Personality;
  personalityLabel: string;
  litterId: string;
  birthDate: string;
  imageUrl: string;
  status: KittenStatus;
  statusLabel: string;
  price: number;
  description: string;
  vaccinated: boolean;
  documented: boolean;
  litter?: {
    id: string;
    name: string;
    father: Producer | null;
    mother: Producer | null;
  };
}

export interface Review {
  id: string;
  authorName: string;
  authorRole: string;
  kittenName: string;
  kittenColor: string;
  adoptedAt: string;
  rating: number;
  text: string;
  imageUrl: string | null;
  featured: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readMinutes: number;
  imageUrl: string;
}

export interface CatteryStats {
  producers: number;
  kittensAvailable: number;
  kittensUpcoming: number;
  reviews: number;
  litters: number;
  graduates: number;
  yearsWork: number;
  geneticTests: number;
}

// Filter options metadata
export const COLOR_OPTIONS = [
  { value: "all", label: "Все окрасы" },
  { value: "black", label: "Чёрный" },
  { value: "tabby", label: "Дикий (табби)" },
  { value: "silver", label: "Серебряный" },
  { value: "silver-red", label: "Серебряно-рыжий" },
] as const;

export const GENDER_OPTIONS = [
  { value: "all", label: "Любой пол" },
  { value: "male", label: "Кот" },
  { value: "female", label: "Кошка" },
] as const;

export const PERSONALITY_OPTIONS = [
  { value: "all", label: "Любой характер", icon: "PawPrint" },
  { value: "calm", label: "Спокойный", icon: "Moon" },
  { value: "playful", label: "Игривый", icon: "Sparkles" },
  { value: "independent", label: "Независимый", icon: "Mountain" },
  { value: "affectionate", label: "Ласковый", icon: "Heart" },
] as const;

export const STATUS_OPTIONS = [
  { value: "all", label: "Все статусы" },
  { value: "available", label: "Доступны" },
  { value: "reserved", label: "Забронированы" },
  { value: "expected", label: "Ожидаются" },
] as const;

export const PERSONALITY_DESCRIPTIONS: Record<Personality, string> = {
  calm: "Не суетится, любит покой и наблюдать за жизнью семьи. Идеален для семей с маленькими детьми.",
  playful: "Энергичный исследователь, обожает игрушки и активные игры. Подойдёт семье с детьми постарше.",
  independent: "Самостоятельный, но преданный. Любит быть рядом, но не навязывается. Для опытных кошатников.",
  affectionate: "Невероятно ласковый, мурчит при прикосновении. Идеальный компаньон для одинокого человека.",
};
