"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { studentSidebarItems } from "@/lib/constants/student_sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout sidebarItems={studentSidebarItems} role="Student">
      {children}
    </DashboardLayout>
  );
}