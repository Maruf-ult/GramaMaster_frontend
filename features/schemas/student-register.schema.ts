import { z } from "zod"

const currentYear = new Date().getFullYear();

export const studentRegisterSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(1, "Full name is required")
            .max(200, "Full name cannot exceed 200 characters."),

        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Invalid email format."),

        password: z
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



        institutionName: z
            .string()
            .trim()
            .min(1, "Institution name is required.")
            .max(200, "Institution name cannot exceed 200 characters."),

        curriculumType: z.enum(["SSC", "HSC", "Dakhil"], {
            error: "Please select your curriculum.",
        }),


        group: z.enum(["Science", "Arts", "BusinessStudies"], {
            error: "Please select your study group.",
        }),


        examBatchYear: z
            .number()
            .int("Exam batch year must be a whole number.")
            .min(currentYear + 2, `Exam batch year cannot exceed ${currentYear + 2}.`),

        board: z.enum(
            [
                "Dhaka",
                "Chattogram",
                "Rajshahi",
                "Jashore",
                "Cumilla",
                "Barisal",
                "Sylhet",
                "Dinajpur",
                "Mymensingh",
                "Madrasah",
                "Technical",
            ],
            {
                error: "Please select your education board.",
            }
        ),

        profileImageUrl: z.string().optional()


    })

    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        }
    );

export type StudentRegisterFormValues = z.infer<typeof studentRegisterSchema>;
