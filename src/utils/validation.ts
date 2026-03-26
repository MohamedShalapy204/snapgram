import { z } from "zod"

/**
 * Validation schemas for authentication forms
 */

export const signupSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }).min(3, { message: "Min 3 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }).min(8, { message: "Min 8 characters" }),
})

export const signinSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export const passwordUpdateSchema = z.object({
  password: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(1, { message: "New password is required" }).min(8, { message: "Min 8 characters" }),
});

export const postSchema = z.object({
  caption: z.string().min(5, "Caption must be at least 5 characters").max(2200, "Caption too long"),
  file: z.custom<File[]>().optional(),
  location: z.string().min(2, "Location must be at least 2 characters").max(100).optional().or(z.literal('')),
  tags: z.string().optional()
})

export const reelSchema = z.object({
  caption: z.string().min(5, "Caption must be at least 5 characters").max(2200, "Caption too long"),
  file: z.custom<File[]>().refine((files) => files.length > 0 && files[0].type.startsWith("video/"), {
    message: "A video file is required for Reels",
  }),
  audio: z.string().max(100).optional().or(z.literal('')),
  tags: z.string().optional(),
})

// Inferred types for convenience
export type SignupSchema = z.infer<typeof signupSchema>
export type SigninSchema = z.infer<typeof signinSchema>
export type PostSchema = z.infer<typeof postSchema>
export type ReelSchema = z.infer<typeof reelSchema>
export type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>
