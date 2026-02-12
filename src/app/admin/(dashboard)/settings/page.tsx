"use client";

import { useState, useEffect } from "react";
import { Save, User, Lock, Image as ImageIcon } from "lucide-react";
import BackButton from "@/components/admin/BackButton";

export default function SettingsPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                setUsername(data.username);
                setSchoolName(data.schoolName);
                setLogoUrl(data.logoUrl);
            })
            .catch(() => setMessage({ text: "Failed to load settings", type: "error" }));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, schoolName, logoUrl }),
            });

            if (res.ok) {
                setMessage({ text: "Settings saved successfully!", type: "success" });
                setPassword("");
            } else {
                const data = await res.json();
                setMessage({ text: data.message || "Failed to save settings", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "An error occurred", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <BackButton />
            <div>
                <h1 className="text-3xl font-bold">Admin Settings</h1>
                <p className="text-gray-400 mt-2">Manage your administrative credentials and global school identity.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-sm">
                <form onSubmit={handleSave} className="space-y-8">
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold text-amber-500 border-b border-gray-800 pb-2 italic">Authentication</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                                    <User className="w-4 h-4" /> New Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                                    <Lock className="w-4 h-4" /> New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6 pt-4 border-t border-gray-800">
                        <h2 className="text-xl font-bold text-amber-500 border-b border-gray-800 pb-2 italic">Branding & Identity</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">School Name</label>
                                <input
                                    type="text"
                                    value={schoolName}
                                    onChange={(e) => setSchoolName(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-300">School Logo</label>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            value={logoUrl}
                                            onChange={(e) => setLogoUrl(e.target.value)}
                                            className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="/logo.jpeg"
                                            required
                                        />
                                        <label className="cursor-pointer bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl flex items-center justify-center transition-all">
                                            <ImageIcon className="w-5 h-5" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append("file", file);
                                                        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                                                        const data = await res.json();
                                                        if (data.url) setLogoUrl(data.url);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    {logoUrl && (
                                        <div className="w-12 h-12 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 p-1">
                                            <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2 italic">Upload from device or provide path/URL.</p>
                            </div>
                        </div>
                    </section>

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
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? "Saving..." : "Save Global Settings"}
                    </button>
                </form>
            </div>
        </div>
    );
}
