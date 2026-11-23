import { z } from "zod"

export const createTeamSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Team name must be at least 2 characters."),

    description: z
        .string()
        .trim()
        .optional(),
});

export type CreateTeamForm = z.infer<typeof createTeamSchema>;
