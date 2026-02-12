"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Link as LinkIcon, FileText, ExternalLink } from "lucide-react";
import BackButton from "@/components/admin/BackButton";

interface Resource {
    id: number;
    title: string;
    description: string | null;
    link: string | null;
}

export default function ResourcesManager() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", link: "" });
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        const res = await fetch("/api/admin/resources");
        const data = await res.json();
        setResources(data);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch("/api/admin/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ title: "", description: "", link: "" });
                fetchResources();
                setMessage({ text: "Resource added!", type: "success" });
            } else {
                setMessage({ text: "Failed to add resource", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Error occurred", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        const res = await fetch(`/api/admin/resources?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchResources();
    };

    return (
        <div className="space-y-8">
            <BackButton />
            <div>
                <h1 className="text-3xl font-bold">Manage Resources</h1>
                <p className="text-gray-400 mt-2">Add technical documents, links, and guides.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-400" /> Add New Resource
                </h2>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <textarea
                            placeholder="Short Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <input
                            type="url"
                            placeholder="Link (Optional)"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Resource"}
                    </button>
                </form>
                {message.text && (
                    <p className={`mt-4 text-sm ${message.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                        {message.text}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res) => (
                    <div key={res.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl group flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-gray-800 rounded-lg text-blue-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <button
                                    onClick={() => handleDelete(res.id)}
                                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <h3 className="font-bold text-gray-100">{res.title}</h3>
                            <p className="text-sm text-gray-400 mt-2 line-clamp-3">{res.description}</p>
                        </div>
                        {res.link && (
                            <a
                                href={res.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                VIEW LINK <ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
