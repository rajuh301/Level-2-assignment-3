import { z } from 'zod';


export const userValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits long" }),
  address: z.string().min(1, { message: "Address is required" }),
  role: z.enum(['admin', 'user'], { message: "Role must be either 'admin' or 'user'" }),
});



export const userLoginValidationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const userIdValidationSchema = z.object({
  id: z.string().min(1, "User ID is required")
});

export const userEmailValidationSchema = z.object({
  email: z.string().email("Invalid email address")
});


export const updateUserValidationSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
});