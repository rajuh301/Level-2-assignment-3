import { z } from 'zod';

export const createBikeSchema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  pricePerHour: z.number().min(0, "Price per hour must be a positive number"),
  cc: z.number().min(0, "CC must be a positive number"),
  year: z.number().min(1900, "Year must be a valid year"),
  model: z.string().nonempty("Model is required"),
  brand: z.string().nonempty("Brand is required"),
});
