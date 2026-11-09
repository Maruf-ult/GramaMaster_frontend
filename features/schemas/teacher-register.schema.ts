import {z} from "zod"

const currentYear = new Date().getFullYear();


export const teacherRegisterSchema = z
     .object({
        fullName:z
        .string()
        .trim()
        .min(1,"Fullname is required")
        .max(200,"Full name cannot exceed 200 characters"),

        email:z
        .string()
        .trim()
        .min(1,"Email is required")
        .email("Invalid email format."),

        password:z
        .string()
        .min(1,"Password is required.")
        .min(8,"Password must be at least 8 characters.")
        .regex(/[A-Z]/,"At least one uppercase letter is required.")
        .regex(/[a-z]/,"At least one lowercase letter is required.")
        .regex(/[0-9]/,"At least one number is required.")
        .regex(/[^a-zA-Z0-9]/,"At least one special character is required."),

        confirmPassword:z
        .string()
        .min(1,"Please confirm your password."),


        department:z
        .string()
        .min(1,"Department is required.")
        .max(400,"Department name can not exceed 400 characters."),


        university:z
        .string()
        .min(1,"University is required.")
        .max(400,"University name can not exceed 400 characters."),


        sscResult:z
        .number()
        .min(1,"SSC result must be 1 to 5.")
        .max(5,"SSC result must be 1 to 5."),

         sscGroup:z.enum(["Science","Arts","BusinessStudies"],{
            error:"Please select your SSC study group.",
        }),

        sscBoard:z.enum(
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
                error:"Please select your SSC education board.",
            }
        ),



        hscResult:z
        .number()
        .min(1,"HSC result must be 1 to 5.")
        .max(5,"HSC result must be 1 to 5."),


           hscGroup:z.enum(["Science","Arts","BusinessStudies"],{
            error:"Please select your HSC study group.",
        }),

        hscBoard:z.enum(
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
                error:"Please select your HSC education board.",
            }
        ),



     })

     .refine(
        (data) => data.password === data.confirmPassword,
        {
            message:"Passwords do not match.",
            path:["confirmPassword"],
        }
       );


       export type teacherRegisterFormValues = z.infer<typeof teacherRegisterSchema>;