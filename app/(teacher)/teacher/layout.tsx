import DashboardLayout from "@/components/layout/DashboardLayout";
import { teacherSidebarItems } from "@/lib/constants/teacher_sidebar";

export default function TeacherLayout({ children, }: { children: React.ReactNode }) {
  return (
    <DashboardLayout sidebarItems={teacherSidebarItems}>
      {children}
    </DashboardLayout>
  );
}