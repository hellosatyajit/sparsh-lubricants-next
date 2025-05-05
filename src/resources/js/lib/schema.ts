import { z } from 'zod';

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  category: z.string().nullable(),
  description: z.string().nullable(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  deleted_at: z.string().nullable(),
});

export type Product = z.infer<typeof productSchema>;

export const productFormSchema = productSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true, 
  deleted_at: true 
});

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['admin', 'sales', 'guest']),
});

export type User = z.infer<typeof userSchema>;

export const userFormSchema = userSchema.omit({ 
  id: true, 
});

export const mailAccountSchema = z.object({
  id: z.number().optional(),
  mail_id: z.string().min(1, 'Mail ID is required'),
  status: z.string().min(1, 'Status is required'),
  app_code: z.string().min(8, 'App Code is required'),
});

export type MailAccount = z.infer<typeof mailAccountSchema>;

export const mailAccountFormSchema = mailAccountSchema.omit({ 
  id: true, 
});

