export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PlansGrid from "@/components/public/PlansGrid";

export default async function PlansPage() {
    const plans = await prisma.plan.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 italic">Academic Plans</h1>
                        <p className="text-gray-400 text-lg max-w-2xl">
                            Explore our comprehensive curriculum, lesson structures, and educational pathways designed for child excellence.
                        </p>
                    </div>

                    <PlansGrid plans={plans as any} />
                </div>
            </main>

            <Footer />
        </div>
    );
}
