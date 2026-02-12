"use client";

import { memo } from "react";
import { Trash2, Image as ImageIcon } from "lucide-react";

interface EnvironmentItemProps {
    item: any;
    onUpdateState: (id: number, data: any) => void;
    onPersistUpdate: (id: number) => void;
    onDelete: (id: number) => void;
    onUpload: (file: File) => Promise<string | null>;
}

export const EnvironmentItem = memo(function EnvironmentItem({
    item,
    onUpdateState,
    onPersistUpdate,
    onDelete,
    onUpload
}: EnvironmentItemProps) {
    return (
        <div className="bg-gray-950 border border-gray-800 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                    {item.imageUrl ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-800">
                            <img src={item.imageUrl} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <input
                            value={item.icon || ""}
                            onChange={(e) => onUpdateState(item.id, { icon: e.target.value })}
                            onBlur={() => onPersistUpdate(item.id)}
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
                                    const url = await onUpload(file);
                                    if (url) {
                                        onUpdateState(item.id, { imageUrl: url });
                                        // Save immediately after upload
                                        await fetch("/api/admin/environment", {
                                            method: "PUT",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ ...item, imageUrl: url }),
                                        });
                                    }
                                }
                            }}
                        />
                    </label>
                    {item.imageUrl && (
                        <button
                            onClick={() => {
                                onUpdateState(item.id, { imageUrl: null });
                                onPersistUpdate(item.id);
                            }}
                            className="p-2 text-gray-500 hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <button onClick={() => onDelete(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <input
                value={item.title}
                onChange={(e) => onUpdateState(item.id, { title: e.target.value })}
                onBlur={() => onPersistUpdate(item.id)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 font-bold focus:border-indigo-500 outline-none"
                placeholder="Facility Title"
            />
            <input
                value={item.subLabel}
                onChange={(e) => onUpdateState(item.id, { subLabel: e.target.value })}
                onBlur={() => onPersistUpdate(item.id)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs uppercase tracking-widest text-indigo-400 focus:border-indigo-500 outline-none"
                placeholder="Sub Label"
            />
            <textarea
                value={item.description}
                onChange={(e) => onUpdateState(item.id, { description: e.target.value })}
                onBlur={() => onPersistUpdate(item.id)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-400 focus:border-indigo-500 outline-none resize-none"
                rows={2}
                placeholder="Description"
            />
        </div>
    );
});
