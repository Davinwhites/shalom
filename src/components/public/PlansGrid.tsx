"use client";

import { useState } from "react";
import { PenTool, Maximize2, X, Download, ZoomIn } from "lucide-react";

interface Plan {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string;
}

export default function PlansGrid({ plans }: { plans: Plan[] }) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {plans.length > 0 ? (
                    plans.map((plan) => (
                        <div key={plan.id} className="group bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all shadow-2xl">
                            <div
                                className="relative aspect-[16/10] overflow-hidden bg-gray-800 cursor-pointer"
                                onClick={() => setSelectedPlan(plan)}
                            >
                                <img
                                    src={plan.imageUrl}
                                    alt={plan.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gray-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white">
                                        <Maximize2 className="w-8 h-8" />
                                    </div>
                                </div>
                                <div
                                    className="absolute top-6 left-6 px-4 py-1.5 bg-gray-950/80 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2 z-30 cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPlan(plan);
                                    }}
                                >
                                    <PenTool className="w-3 h-3 text-blue-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Blueprint</span>
                                </div>
                            </div>
                            <div className="p-10">
                                <h3 className="text-2xl font-bold mb-4">{plan.title}</h3>
                                <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">
                                    {plan.description}
                                </p>
                                <button
                                    onClick={() => setSelectedPlan(plan)}
                                    className="text-sm font-black uppercase tracking-[0.2em] text-blue-500 hover:text-white transition-colors flex items-center gap-2 group/btn"
                                >
                                    View Full Details <ZoomIn className="w-4 h-4 group-hover/btn:scale-125 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
                        <p className="text-gray-500">No drawn plans currently on showcase.</p>
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            {selectedPlan && (
                <div
                    className="fixed inset-0 z-[100] bg-gray-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedPlan(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[110]"
                        onClick={() => setSelectedPlan(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div
                        className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full flex-1 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                            <img
                                src={selectedPlan.imageUrl}
                                alt={selectedPlan.title}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="w-full bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedPlan.title}</h2>
                                <p className="text-gray-400 text-sm">{selectedPlan.description}</p>
                            </div>
                            <div className="flex gap-4">
                                <a
                                    href={selectedPlan.imageUrl}
                                    download={`${selectedPlan.title.replace(/\s+/g, '-')}.png`}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all"
                                >
                                    <Download className="w-4 h-4" /> Save Drawing
                                </a>
                                <p className="hidden md:block text-[10px] text-gray-500 max-w-[120px] leading-tight uppercase font-bold tracking-tighter">
                                    Full resolution available for screenshot or download
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
