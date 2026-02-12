"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Home,
    User,
    FileText,
    CreditCard,
    Phone,
    Settings,
    LogOut,
    PenTool,
    Boxes
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Home, label: "Home Page", href: "/admin/home" },
    { icon: User, label: "About Page", href: "/admin/about" },
    { icon: Boxes, label: "Learning Resources", href: "/admin/resources" },
    { icon: PenTool, label: "Academic Plans", href: "/admin/plans" },
    { icon: FileText, label: "School Gallery", href: "/admin/designs" },
    { icon: Phone, label: "Contact Info", href: "/admin/contact" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface SidebarProps {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setOpen }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen transition-transform duration-300 transform md:relative md:translate-x-0 outline-none",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
                        S
                    </div>
                    <div>
                        <h2 className="font-bold text-lg tracking-tight">Shalom</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Admin</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                                pathname === item.href
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5",
                                pathname === item.href ? "text-amber-400" : "group-hover:text-amber-400"
                            )} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}
