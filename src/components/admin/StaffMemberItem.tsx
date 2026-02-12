"use client";

import { memo } from "react";
import { Trash2, Image as ImageIcon } from "lucide-react";

interface StaffMemberItemProps {
    member: any;
    onUpdateState: (id: number, data: any) => void;
    onPersistUpdate: (id: number) => void;
    onDelete: (id: number) => void;
    onUpload: (file: File) => Promise<string | null>;
}

export const StaffMemberItem = memo(function StaffMemberItem({
    member,
    onUpdateState,
    onPersistUpdate,
    onDelete,
    onUpload
}: StaffMemberItemProps) {
    return (
        <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold shrink-0 border border-gray-700">
                {member.imageUrl ? <img src={member.imageUrl} className="w-full h-full object-cover rounded-full" /> : member.name[0]}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
                <input
                    value={member.name}
                    onChange={(e) => onUpdateState(member.id, { name: e.target.value })}
                    onBlur={() => onPersistUpdate(member.id)}
                    placeholder="Name"
                    className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                />
                <input
                    value={member.title}
                    onChange={(e) => onUpdateState(member.id, { title: e.target.value })}
                    onBlur={() => onPersistUpdate(member.id)}
                    placeholder="Title"
                    className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                />
                <input
                    value={member.phone}
                    onChange={(e) => onUpdateState(member.id, { phone: e.target.value })}
                    onBlur={() => onPersistUpdate(member.id)}
                    placeholder="Phone"
                    className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none"
                />
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-xs text-gray-500 font-bold uppercase">Profile Image</label>
                    <div className="flex gap-2">
                        <input
                            value={member.imageUrl || ""}
                            onChange={(e) => onUpdateState(member.id, { imageUrl: e.target.value })}
                            onBlur={() => onPersistUpdate(member.id)}
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
                                        const url = await onUpload(file);
                                        if (url) {
                                            onUpdateState(member.id, { imageUrl: url });
                                            // Handle persistence for uploads immediately
                                            const res = await fetch("/api/admin/staff", {
                                                method: "PUT",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ ...member, imageUrl: url }),
                                            });
                                        }
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <button onClick={() => onDelete(member.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
});
