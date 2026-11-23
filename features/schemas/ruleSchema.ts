import z from "zod";

export const ruleSchema = z.object({
    topicId: z
        .string()
        .trim()
        .min(1, "Topic ID is required."),

    title: z
        .string()
        .trim()
        .min(2, "Title must be at least 2 characters."),

    content: z
        .string()
        .trim()
        .min(10, "Content must be at least 10 characters."),

    example: z
        .string()
        .trim()
        .min(5, "Example is required.")
});

export type RuleForm = z.infer<typeof ruleSchema>;