import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1, "Veuillez choisir un service"),
  staffId: z.string().optional(),
  date: z.string().min(1, "Veuillez choisir une date"),
  startTime: z.string().min(1, "Veuillez choisir un créneau"),
  clientName: z.string().min(2, "Nom requis (min. 2 caractères)"),
  clientEmail: z.string().email("Email invalide"),
  clientPhone: z.string().min(10, "Numéro de téléphone invalide"),
  clientNotes: z.string().optional(),
  acceptsCgv: z.boolean().refine((v) => v === true, "Vous devez accepter les CGV"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

export const serviceSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2, "Slug requis"),
  description: z.string().optional(),
  duration: z.number().min(15, "Durée minimum 15 minutes"),
  price: z.number().min(0, "Prix invalide"),
  categoryId: z.string().min(1, "Catégorie requise"),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2, "Slug requis"),
  description: z.string().optional(),
  order: z.number().default(0),
});

export const staffSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  title: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
  serviceIds: z.array(z.string()).default([]),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message trop court (min. 10 caractères)"),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const settingsSchema = z.object({
  instituteName: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  canton: z.string().optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  depositPercent: z.number().min(0).max(100),
  reminderHours: z.number().min(1).max(72),
  cancellationHours: z.number().min(1).max(72),
});
