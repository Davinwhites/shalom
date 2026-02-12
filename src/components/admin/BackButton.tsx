"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group mb-6"
        >
            <div className="w-8 h-8 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back</span>
        </button>
    );
}
