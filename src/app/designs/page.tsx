export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Layout, ArrowUpRight } from "lucide-react";

export default async function DesignsPage() {
    const designs = await prisma.design.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 italic">School Showcase</h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            A vibrant gallery of our students' activities, creativity, and the everyday wonders at Shalom Kindergarten & Primary School.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {designs.length > 0 ? (
                            designs.map((design: any) => (
                                <div key={design.id} className="group relative aspect-[4/5] bg-gray-900 rounded-[2rem] overflow-hidden group">
                                    <img
                                        src={design.imageUrl}
                                        alt={design.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent flex flex-col justify-end p-8">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex items-center gap-2 text-amber-400 mb-3">
                                                <Layout className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">School Life</span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{design.title}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                {design.description}
                                            </p>
                                            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group/btn">
                                                Explore More
                                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-gray-900 transition-all">
                                                    <ArrowUpRight className="w-3 h-3" />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
                                <p className="text-gray-500">Our gallery collection is coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
