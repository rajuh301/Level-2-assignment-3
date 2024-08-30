export interface IBike {
    name: string;
    category: string;
    description: string;
    pricePerHour: number;
    isAvailable?: boolean;
    cc: number;
    year: number;
    model: string;
    brand: string;
    image?: string;
  }
  