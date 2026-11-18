import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    BarChart2,
    MessageSquare,
    User,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface SidebarItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export const studentSidebarItems: SidebarItem[] = [
    { title: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { title: "Practice", href: "/student/practice", icon: BookOpen },
    { title: "Contests", href: "/student/contests", icon: Trophy },
    { title: "Progress", href: "/student/progress", icon: BarChart2 },
    { title: "AI Chatbot", href: "/student/chatbot", icon: MessageSquare },
    { title: "Profile", href: "/student/profile", icon: User },
];