import {
    LayoutDashboard,
    Users,
    BookOpen,
    ListTree,
    Trophy,
    BarChart2,
} from "lucide-react";
import { SidebarItem } from "./student_sidebar";

export const adminSidebarItems: SidebarItem[] = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Topics", href: "/admin/topics", icon: ListTree },
    { title: "Grammar Rules", href: "/admin/questions", icon: BookOpen },
    { title: "Contests", href: "/admin/contests", icon: Trophy },
    { title: "Analytics", href: "/admin/analytics", icon: BarChart2 },
];