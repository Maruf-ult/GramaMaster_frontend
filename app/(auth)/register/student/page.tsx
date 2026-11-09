"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EducationBoard } from "@/types/auth";
import { studentRegisterSchema, StudentRegisterFormValues } from "@/features/schemas/student-register.schema";
import { apiClient } from "@/lib/api/api-client";
import { LoginResponseDto } from "@/types/auth";
import { apiEndpoints } from "@/lib/api/endpoints";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const boards: EducationBoard[] = [
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
  "Technical"
];


export default function StudentRegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegisterFormValues>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      instituionName: "",
      curriculumType: "SSC",
      group: "Science",
      examBatchYear: new Date().getFullYear(),
      board: "Dhaka",
    },
  });

  const onSubmit = async (data: StudentRegisterFormValues) => {
    try {
      console.log("Registration Data:", data);
      const response = await apiClient<LoginResponseDto>(apiEndpoints.auth.registerStudent, {
        method: "POST",
        body: JSON.stringify(data),
      });
      console.log("Registration Successful", response);
    } catch (error) {
      console.log("Registration failed", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border p-6">
      <h1 className="mb-2 text-2xl font-bold"> 
        Student Registration
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        Create your GramaMaster student account.
      </p>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

        <div className="space-y-2">
          <label>Full Name</label>
          <Input {...register("fullName")} placeholder="Enter your full name" />
          <p className="text-sm text-destructive">{errors.fullName?.message}</p>
        </div>

  
        <div className="space-y-2">
          <label>Email</label>
          <Input {...register("email")} type="email" placeholder="Enter your email" />
          <p className="text-sm text-destructive">{errors.email?.message}</p>
        </div>

      
        <div className="space-y-2">
          <label>Password</label>
          <Input {...register("password")} type="password" placeholder="Create a password" />
          <p className="text-sm text-destructive">{errors.password?.message}</p>
        </div>

        
        <div className="space-y-2">
          <label>Confirm Password</label>
          <Input {...register("confirmPassword")} type="password" placeholder="Confirm your password" />
          <p className="text-sm text-destructive">{errors.confirmPassword?.message}</p>
        </div>

      
        <div className="space-y-2">
          <label>Institute Name</label>
          <Input {...register("instituionName")} placeholder="Enter your school or college" />
          <p className="text-sm text-destructive">{errors.instituionName?.message}</p>
        </div>

     
        <div className="space-y-2">
          <label>Curriculum</label>
          <Select
            value={watch("curriculumType")}
            onValueChange={(value) =>
              setValue("curriculumType", value as StudentRegisterFormValues["curriculumType"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select curriculum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SSC">SSC</SelectItem>
              <SelectItem value="HSC">HSC</SelectItem>
              <SelectItem value="Dakhil">Dakhil</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-destructive">{errors.curriculumType?.message}</p>
        </div>

    
        <div className="space-y-2">
          <label>Study Group</label>
          <Select
            value={watch("group")}
            onValueChange={(value) =>
              setValue("group", value as StudentRegisterFormValues["group"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select study group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
              <SelectItem value="BusinessStudies">Business Studies</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-destructive">{errors.group?.message}</p>
        </div>

    
        <div className="space-y-2">
          <label>Exam Batch Year</label>
          <Input
            type="number"
            min={2015}
            max={new Date().getFullYear() + 2}
            {...register("examBatchYear", { valueAsNumber: true })}
          />
          <p className="text-sm text-destructive">{errors.examBatchYear?.message}</p>
        </div>

    
        <div className="space-y-2">
          <label>Education Board</label>
          <Select
            value={watch("board")}
            onValueChange={(value) =>
              setValue("board", value as StudentRegisterFormValues["board"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select education board" />
            </SelectTrigger>
            <SelectContent>
              {boards.map((board) => (
                <SelectItem key={board} value={board}>
                  {board}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-destructive">{errors.board?.message}</p>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
