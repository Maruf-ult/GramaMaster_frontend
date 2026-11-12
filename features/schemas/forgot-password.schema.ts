import { z } from "zod"

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Plese enter valid email")
});

export type forgotPasswordValues = z.infer<typeof forgotPasswordSchema>;