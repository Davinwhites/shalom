"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-950 text-gray-100 w-full overflow-x-hidden">
            <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col min-h-screen min-w-0 w-full">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-30 w-full">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                        Shalom Admin
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
                    <div className="max-w-6xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
