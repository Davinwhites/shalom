"use client";

import { useState, useEffect } from "react";
import { Save, Home as HomeIcon } from "lucide-react";
import BackButton from "@/components/admin/BackButton";

export default function HomeEditor() {
    const [formData, setFormData] = useState({
        heroTitle: "",
        heroSub: "",
        aboutShort: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetch("/api/admin/home")
            .then(res => res.json())
            .then(data => setFormData(data))
            .catch(() => setMessage({ text: "Failed to load content", type: "error" }));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch("/api/admin/home", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage({ text: "Home page updated successfully!", type: "success" });
            } else {
                setMessage({ text: "Failed to update content", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "An error occurred", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <BackButton />
            <div>
                <h1 className="text-3xl font-bold">Edit Home Page</h1>
                <p className="text-gray-400 mt-2">Manage the main hero section and intro text.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-sm">
                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Hero Title</label>
                        <input
                            type="text"
                            value={formData.heroTitle}
                            onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Hero Subtitle</label>
                        <textarea
                            rows={3}
                            value={formData.heroSub}
                            onChange={(e) => setFormData({ ...formData, heroSub: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">Short About Text</label>
                        <textarea
                            rows={4}
                            value={formData.aboutShort}
                            onChange={(e) => setFormData({ ...formData, aboutShort: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            required
                        />
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl text-sm ${message.type === "success"
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                            : "bg-red-500/10 border border-red-500/20 text-red-400"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? "Saving..." : "Save Home Page"}
                    </button>
                </form>
            </div>
        </div>
    );
}
