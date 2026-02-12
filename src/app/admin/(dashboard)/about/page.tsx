"use client";

import { useState, useEffect } from "react";
import { Save, User, Plus, Trash2, Image as ImageIcon, Briefcase, Phone, MoveUp, MoveDown } from "lucide-react";
import BackButton from "@/components/admin/BackButton";

export default function AboutEditor() {
    const [aboutData, setAboutData] = useState({
        bio: "",
        mission: "",
        experience: "",
        aboutShort: ""
    });
    const [staff, setStaff] = useState<any[]>([]);
    const [environment, setEnvironment] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [aboutRes, staffRes, envRes] = await Promise.all([
                fetch("/api/admin/about"),
                fetch("/api/admin/staff"),
                fetch("/api/admin/environment")
            ]);

            const about = await aboutRes.json();
            setAboutData({
                bio: about.bio || "",
                mission: about.mission || "",
                experience: about.experience || "",
                aboutShort: about.aboutShort || ""
            });
            setStaff(await staffRes.json());
            setEnvironment(await envRes.json());
        } catch (error) {
            setMessage({ text: "Failed to load content", type: "error" });
        }
    };

    const handleSaveAbout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const res = await fetch("/api/admin/about", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(aboutData),
            });

            if (res.ok) {
                setMessage({ text: "About page & Homepage sync updated successfully!", type: "success" });
            } else {
                setMessage({ text: "Failed to update text", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "An error occurred", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStaffState = (id: number, data: any) => {
        setStaff(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    };

    const persistStaffUpdate = async (id: number) => {
        const member = staff.find(m => m.id === id);
        if (!member) return;

        try {
            await fetch("/api/admin/staff", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(member),
            });
            // Don't reload everything, just rely on local state being correct
        } catch (error) {
            setMessage({ text: "Failed to save staff member", type: "error" });
        }
    };

    const handleAddStaff = async () => {
        const res = await fetch("/api/admin/staff", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "New Member", title: "Staff", phone: "+000 000 000", order: staff.length + 1 }),
        });
        if (res.ok) {
            loadData();
            setMessage({ text: "Staff added", type: "success" });
        }
    };

    const handleDeleteStaff = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/admin/staff?id=${id}`, { method: "DELETE" });
        loadData();
    };

    const handleUpdateEnvState = (id: number, data: any) => {
        setEnvironment(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    };

    const persistEnvUpdate = async (id: number) => {
        const item = environment.find(e => e.id === id);
        if (!item) return;

        try {
            await fetch("/api/admin/environment", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
        } catch (error) {
            setMessage({ text: "Failed to save facility", type: "error" });
        }
    };

    const handleAddEnv = async () => {
        const res = await fetch("/api/admin/environment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "New Facility", subLabel: "Description", description: "Details...", icon: "🏫", order: environment.length + 1 }),
        });
        if (res.ok) {
            loadData();
            setMessage({ text: "Facility added", type: "success" });
        }
    };

    const handleDeleteEnv = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        await fetch(`/api/admin/environment?id=${id}`, { method: "DELETE" });
        loadData();
    };

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            return data.url;
        } catch (error) {
            console.error("Upload failed", error);
            return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24">
            <BackButton />
            <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">About Page Content</h1>
                <p className="text-gray-400 mt-2">Manage your bio, leadership team, and school environment.</p>
            </div>

            {/* Basic Info */}
            <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
                    <User className="text-amber-500" />
                    <h2 className="text-xl font-bold uppercase italic">Core Information</h2>
                </div>
                <form onSubmit={handleSaveAbout} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-blue-400 font-bold uppercase tracking-widest">
                                Homepage Introduction (Short Summary)
                            </label>
                            <p className="text-xs text-gray-500 mb-2 italic">This text will appear on the Homepage intro section.</p>
                            <textarea
                                rows={3}
                                value={aboutData.aboutShort}
                                onChange={(e) => setAboutData({ ...aboutData, aboutShort: e.target.value })}
                                className="w-full bg-gray-950 border border-blue-500/20 rounded-2xl px-4 py-3 focus:border-blue-500 outline-none transition-all mb-4"
                                placeholder="A brief summary for the home page..."
                            />

                            <label className="block text-sm font-medium mb-2 text-gray-400">Biography (Full Story)</label>
                            <p className="text-xs text-gray-500 mb-2 italic">This text appears on the main About Page.</p>
                            <textarea
                                rows={6}
                                value={aboutData.bio}
                                onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 focus:border-amber-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Mission</label>
                            <textarea
                                rows={3}
                                value={aboutData.mission}
                                onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 focus:border-amber-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Experience</label>
                            <textarea
                                rows={3}
                                value={aboutData.experience}
                                onChange={(e) => setAboutData({ ...aboutData, experience: e.target.value })}
                                className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-4 py-3 focus:border-amber-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl transition-all disabled:opacity-50">
                        {loading ? "Saving..." : "Save Text Content"}
                    </button>
                </form>
            </section>

            {/* Staff Management */}
            <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                        <Briefcase className="text-blue-500" />
                        <h2 className="text-xl font-bold uppercase italic">Our Leadership & Staff</h2>
                    </div>
                    <button onClick={handleAddStaff} className="flex items-center gap-2 bg-blue-600/10 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-blue-600 hover:text-white transition-all">
                        <Plus className="w-4 h-4" /> Add Member
                    </button>
                </div>

                <div className="space-y-4">
                    {Array.isArray(staff) && staff.map((member) => (
                        <div key={member.id} className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
                            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold shrink-0 border border-gray-700">
                                {member.imageUrl ? <img src={member.imageUrl} className="w-full h-full object-cover rounded-full" /> : member.name[0]}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
                                <input
                                    value={member.name}
                                    onChange={(e) => handleUpdateStaffState(member.id, { name: e.target.value })}
                                    onBlur={() => persistStaffUpdate(member.id)}
                                    placeholder="Name"
                                    className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                />
                                <input
                                    value={member.title}
                                    onChange={(e) => handleUpdateStaffState(member.id, { title: e.target.value })}
                                    onBlur={() => persistStaffUpdate(member.id)}
                                    placeholder="Title"
                                    className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                />
                                <input
                                    value={member.phone}
                                    onChange={(e) => handleUpdateStaffState(member.id, { phone: e.target.value })}
                                    onBlur={() => persistStaffUpdate(member.id)}
                                    placeholder="Phone"
                                    className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                />
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs text-gray-500 font-bold uppercase">Profile Image</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={member.imageUrl || ""}
                                            onChange={(e) => handleUpdateStaffState(member.id, { imageUrl: e.target.value })}
                                            onBlur={() => persistStaffUpdate(member.id)}
                                            placeholder="Image URL / Path"
                                            className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                                        />
                                        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all shrink-0">
                                            <ImageIcon className="w-5 h-5" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const url = await handleUpload(file);
                                                        if (url) {
                                                            handleUpdateStaffState(member.id, { imageUrl: url });
                                                            // For file uploads, persist immediately since user clicked a button
                                                            const updatedMember = { ...member, imageUrl: url };
                                                            await fetch("/api/admin/staff", {
                                                                method: "PUT",
                                                                headers: { "Content-Type": "application/json" },
                                                                body: JSON.stringify(updatedMember),
                                                            });
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleDeleteStaff(member.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Environment Management */}
            <section className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
                    <div className="flex items-center gap-3">
                        <ImageIcon className="text-indigo-500" />
                        <h2 className="text-xl font-bold uppercase italic">School Environment</h2>
                    </div>
                    <button onClick={handleAddEnv} className="flex items-center gap-2 bg-indigo-600/10 text-indigo-400 px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-indigo-600 hover:text-white transition-all">
                        <Plus className="w-4 h-4" /> Add Facility
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.isArray(environment) && environment.map((item) => (
                        <div key={item.id} className="bg-gray-950 border border-gray-800 p-6 rounded-2xl space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4 items-center">
                                    {item.imageUrl ? (
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-800">
                                            <img src={item.imageUrl} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <input
                                            value={item.icon || ""}
                                            onChange={(e) => handleUpdateEnvState(item.id, { icon: e.target.value })}
                                            onBlur={() => persistEnvUpdate(item.id)}
                                            className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-xl text-2xl text-center outline-none focus:border-indigo-500"
                                            placeholder="Icon"
                                        />
                                    )}
                                    <label className="cursor-pointer bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white p-2 rounded-xl transition-all">
                                        <ImageIcon className="w-5 h-5" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const url = await handleUpload(file);
                                                    if (url) {
                                                        handleUpdateEnvState(item.id, { imageUrl: url });
                                                        // Persist immediately on file upload
                                                        const updatedItem = { ...item, imageUrl: url };
                                                        await fetch("/api/admin/environment", {
                                                            method: "PUT",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify(updatedItem),
                                                        });
                                                    }
                                                }
                                            }}
                                        />
                                    </label>
                                    {item.imageUrl && (
                                        <button onClick={() => {
                                            handleUpdateEnvState(item.id, { imageUrl: null });
                                            persistEnvUpdate(item.id);
                                        }} className="p-2 text-gray-500 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button onClick={() => handleDeleteEnv(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <input
                                value={item.title}
                                onChange={(e) => handleUpdateEnvState(item.id, { title: e.target.value })}
                                onBlur={() => persistEnvUpdate(item.id)}
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 font-bold focus:border-indigo-500 outline-none"
                                placeholder="Facility Title"
                            />
                            <input
                                value={item.subLabel}
                                onChange={(e) => handleUpdateEnvState(item.id, { subLabel: e.target.value })}
                                onBlur={() => persistEnvUpdate(item.id)}
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs uppercase tracking-widest text-indigo-400 focus:border-indigo-500 outline-none"
                                placeholder="Sub Label"
                            />
                            <textarea
                                value={item.description}
                                onChange={(e) => handleUpdateEnvState(item.id, { description: e.target.value })}
                                onBlur={() => persistEnvUpdate(item.id)}
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-400 focus:border-indigo-500 outline-none resize-none"
                                rows={2}
                                placeholder="Description"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {message.text && (
                <div className={`fixed bottom-8 right-8 p-6 rounded-2xl shadow-2xl z-50 text-sm font-bold uppercase tracking-widest ${message.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                    }`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}
