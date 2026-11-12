import { z } from "zod"

export const resetPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter valid email"),

    token: z
        .string()
        .min(1, "Token is required"),


    newPassword: z
        .string()
        .min(1, "Password is required.")
        .min(8, "Password must be at least 8 characters.")
        .regex(/[A-Z]/, "At least one uppercase letter is required.")
        .regex(/[a-z]/, "At least one lowercase letter is required.")
        .regex(/[0-9]/, "At least one number is required.")
        .regex(/[^a-zA-Z0-9]/, "At least one special character is required."),


    confirmPassword: z
        .string()
        .min(1, "Please confirm your password."),

})

    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "passwords do not match.",
        path: ["confirmPassword"]
    });


export type resetPasswordValues = z.infer<typeof resetPasswordSchema>;

