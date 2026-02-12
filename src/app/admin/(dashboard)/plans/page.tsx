"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, PenTool, Image as ImageIcon } from "lucide-react";
import BackButton from "@/components/admin/BackButton";

interface Plan {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string;
}

export default function PlansManager() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ title: "", description: "", imageUrl: "" });
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        const res = await fetch("/api/admin/plans");
        const data = await res.json();
        setPlans(data);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: data,
            });
            const result = await res.json();
            if (res.ok) {
                setFormData({ ...formData, imageUrl: result.url });
                setMessage({ text: "Image uploaded successfully!", type: "success" });
            } else {
                setMessage({ text: result.message || "Upload failed", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Error uploading file", type: "error" });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            setMessage({ text: "Please upload an image first", type: "error" });
            return;
        }
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const url = "/api/admin/plans";
            const method = editingPlan ? "PATCH" : "POST";
            const body = editingPlan ? { ...formData, id: editingPlan.id } : formData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                setFormData({ title: "", description: "", imageUrl: "" });
                setEditingPlan(null);
                fetchPlans();
                setMessage({
                    text: editingPlan ? "Plan updated successfully!" : "Plan published successfully!",
                    type: "success"
                });
            } else {
                setMessage({ text: editingPlan ? "Failed to update plan" : "Failed to add plan", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Error occurred", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData({
            title: plan.title,
            description: plan.description || "",
            imageUrl: plan.imageUrl,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingPlan(null);
        setFormData({ title: "", description: "", imageUrl: "" });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this plan?")) return;
        const res = await fetch(`/api/admin/plans?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchPlans();
    };

    return (
        <div className="space-y-8">
            <BackButton />
            <div>
                <h1 className="text-3xl font-bold">New Drawn Plans</h1>
                <p className="text-gray-400 mt-2">Upload and manage your engineered drawings and blueprints.</p>
            </div>

            <div className={`bg-gray-900 border transition-all rounded-2xl p-6 shadow-sm ${editingPlan ? 'border-orange-500/50 bg-orange-500/5' : 'border-gray-800'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-lg font-bold flex items-center gap-2 ${editingPlan ? 'text-orange-400' : 'text-blue-400'}`}>
                        {editingPlan ? <PenTool className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {editingPlan ? 'Edit Project Plan' : 'Add New Plan'}
                    </h2>
                    {editingPlan && (
                        <button
                            onClick={handleCancel}
                            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Plan Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Structural Foundation Detail"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    placeholder="Explain the technical aspects of this plan..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Plan Image</label>
                            <div className="relative group aspect-video bg-gray-950 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-500/50">
                                {formData.imageUrl ? (
                                    <>
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-sm">
                                                Change Image
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-gray-900 rounded-2xl text-gray-500 mb-3 group-hover:scale-110 transition-transform">
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                                            ) : (
                                                <ImageIcon className="w-8 h-8" />
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {uploading ? "Uploading..." : "Click to upload drawing"}
                                        </p>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${editingPlan
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                            }`}
                    >
                        {loading ? "Saving..." : (
                            <>
                                {editingPlan ? <PenTool className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {editingPlan ? "Update Plan Details" : "Publish New Plan"}
                            </>
                        )}
                    </button>
                </form>
                {message.text && (
                    <p className={`mt-4 text-sm font-medium ${message.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                        {message.text}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group border border-gray-800 hover:border-blue-500/50 transition-all">
                        <div className="h-48 bg-gray-800 relative overflow-hidden">
                            {plan.imageUrl ? (
                                <img src={plan.imageUrl} alt={plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button
                                    onClick={() => handleEdit(plan)}
                                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xl flex items-center gap-2 text-xs font-bold transition-all transform hover:scale-105"
                                >
                                    <PenTool className="w-4 h-4" /> Edit Plan
                                </button>
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xl flex items-center gap-2 text-xs font-bold transition-all transform hover:scale-105"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete Project
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <PenTool className="w-4 h-4 text-blue-400" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Blueprint</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-100">{plan.title}</h3>
                            <p className="text-sm text-gray-400 mt-2 line-clamp-2">{plan.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
