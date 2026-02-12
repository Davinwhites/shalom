export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Download, ExternalLink, FileText } from "lucide-react";

export default async function ResourcesPage() {
    const resources = await prisma.resource.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 italic">Learning Resources</h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Access our digital library of educational guides, parent resources, and creative learning materials.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resources.length > 0 ? (
                            resources.map((res: any) => (
                                <div key={res.id} className="bg-gray-900 border border-gray-800 p-8 rounded-3xl hover:border-amber-500/50 transition-all group flex flex-col items-start">
                                    <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                                        <FileText />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{res.title}</h3>
                                    <p className="text-gray-400 text-sm mb-8 flex-1 leading-relaxed">
                                        {res.description}
                                    </p>
                                    {res.link && (
                                        <a
                                            href={res.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600/10 text-amber-400 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all"
                                        >
                                            Access Content <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
                                <p className="text-gray-500">No resources available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
