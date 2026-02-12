"use client";

import { StaffMemberItem } from "@/components/admin/StaffMemberItem";
import { EnvironmentItem } from "@/components/admin/EnvironmentItem";

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
                        <StaffMemberItem
                            key={member.id}
                            member={member}
                            onUpdateState={handleUpdateStaffState}
                            onPersistUpdate={persistStaffUpdate}
                            onDelete={handleDeleteStaff}
                            onUpload={handleUpload}
                        />
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
                        <EnvironmentItem
                            key={item.id}
                            item={item}
                            onUpdateState={handleUpdateEnvState}
                            onPersistUpdate={persistEnvUpdate}
                            onDelete={handleDeleteEnv}
                            onUpload={handleUpload}
                        />
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
            </section >

{
    message.text && (
        <div className={`fixed bottom-8 right-8 p-6 rounded-2xl shadow-2xl z-50 text-sm font-bold uppercase tracking-widest ${message.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}>
            {message.text}
        </div>
    )
}
        </div >
    );
}
