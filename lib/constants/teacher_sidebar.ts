import {
    LayoutDashboard,
    Users,
    Trophy,
    BookOpen,
    BarChart2,
    User,
} from "lucide-react";
import { SidebarItem } from "./student_sidebar";

export const teacherSidebarItems: SidebarItem[] = [
    { title: "Dashboard", href: "/teacher/dashboard", icon: LayoutDashboard },
    { title: "Students", href: "/teacher/students", icon: Users },
    { title: "Contests", href: "/teacher/contests", icon: Trophy },
    { title: "Problems", href: "/teacher/problems", icon: BookOpen },
    { title: "Analytics", href: "/teacher/analytics", icon: BarChart2 },
    { title: "Profile", href: "/teacher/profile", icon: User },
];