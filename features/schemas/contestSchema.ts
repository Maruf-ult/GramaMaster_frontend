import z from "zod";

export const contestSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters."),

    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters."),

    curriculumId: z
        .string()
        .min(1, "Select a curriculum."),

    contestType: z
        .enum(["Global", "Local"]),

    startAt: z
        .string()
        .min(1, "Start date is required."),

    endAt: z
        .string()
        .min(1, "End date is required."),

    // schema.ts
    durationMinutes: z
        .number({ message: "Duration is required." })
        .min(5, "Minimum 5 minutes.")
        .max(180, "Maximum 3 hours."),


    teamId: z
        .string()
        .optional(),

});

export type ContestForm = z.infer<typeof contestSchema>;