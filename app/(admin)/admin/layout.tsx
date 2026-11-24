import DashboardLayout from "@/components/layout/DashboardLayout";
import { adminSidebarItems } from "@/lib/constants/admin_sidebar";

export default function AdminLayout({ children, }: { children: React.ReactNode }) {
  return (
    <DashboardLayout sidebarItems={adminSidebarItems}>
      {children}
    </DashboardLayout>
  );

}