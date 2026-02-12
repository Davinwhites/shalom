"use client";

import { useState, useEffect } from "react";
import { Save, Mail, Phone, MapPin, Linkedin } from "lucide-react";
import BackButton from "@/components/admin/BackButton";

export default function ContactEditor() {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        address: "",
        linkedin: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetch("/api/admin/contact")
            .then(res => res.json())
            .then(data => setFormData(data))
            .catch(() => setMessage({ text: "Failed to load contact info", type: "error" }));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch("/api/admin/contact", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage({ text: "Contact information updated!", type: "success" });
            } else {
                setMessage({ text: "Failed to update info", type: "error" });
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
                <h1 className="text-3xl font-bold">Contact Information</h1>
                <p className="text-gray-400 mt-2">Manage how people reach out to you.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-sm">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                                <Mail className="w-4 h-4 text-blue-400" /> Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                                <Phone className="w-4 h-4 text-blue-400" /> Phone Number
                            </label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-blue-400" /> Office Address
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
                            <Linkedin className="w-4 h-4 text-blue-400" /> LinkedIn URL
                        </label>
                        <input
                            type="text"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-white text-gray-900 font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? "Updating..." : "Save Contact Info"}
                    </button>
                </form>
            </div>
        </div>
    );
}
