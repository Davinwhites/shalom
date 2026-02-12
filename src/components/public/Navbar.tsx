"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Resources", href: "/resources" },
    { label: "Academic Plans", href: "/plans" },
    { label: "Events", href: "/designs" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [branding, setBranding] = useState({ name: "Shalom School", logoUrl: "/logo.jpeg" });
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        fetch("/api/public/settings")
            .then(res => res.json())
            .then(data => setBranding({ name: data.name, logoUrl: data.logoUrl }))
            .catch(() => { });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const nameParts = branding.name.split(' ');
    const firstName = nameParts[0] || "Shalom";
    const restName = nameParts.slice(1).join(' ') || "School";

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300 border-b",
            scrolled
                ? "bg-gray-950/80 backdrop-blur-md border-gray-800 py-3"
                : "bg-transparent border-transparent py-5"
        )}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <img
                        src={branding.logoUrl}
                        alt="School Logo"
                        className="w-10 h-10 object-cover rounded-lg transform group-hover:rotate-12 transition-transform shadow-lg"
                    />
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase">
                        {firstName}<span className="text-amber-500"> {restName}</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-blue-400",
                                pathname === link.href ? "text-blue-400" : "text-gray-400"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/admin/login"
                        className="p-2 text-gray-500 hover:text-white transition-colors"
                        title="Admin Login"
                    >
                        <ShieldCheck className="w-5 h-5" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-gray-950 border-b border-gray-800 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "text-lg font-medium",
                                pathname === link.href ? "text-blue-400" : "text-gray-400"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/admin/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-medium text-gray-400 flex items-center gap-2"
                    >
                        <ShieldCheck className="w-5 h-5" /> Admin Login
                    </Link>
                </div>
            )}
        </nav>
    );
}
