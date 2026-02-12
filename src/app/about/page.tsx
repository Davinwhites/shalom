export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { User, Target, Briefcase, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AboutPage() {
    const about = await prisma.aboutPage.findUnique({ where: { id: 1 } });
    const staff = await prisma.staffMember.findMany({ orderBy: { order: 'asc' } });
    const environment = await prisma.schoolEnvironment.findMany({ orderBy: { order: 'asc' } });

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header Section */}
                    <div className="mb-20">
                        <h1 className="text-4xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
                            Nurturing <br />
                            <span className="text-gray-500">Potential.</span>
                        </h1>
                        <p className="max-w-2xl text-xl text-gray-400 leading-relaxed">
                            A look into our educational journey, mission, and the commitment we have to every pupil's growth.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                        {/* Bio Section */}
                        <div className="lg:col-span-2 space-y-12">
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-500">Biography</h2>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Award className="w-32 h-32" />
                                    </div>
                                    <p className="text-lg md:text-xl text-gray-300 leading-loose relative z-10 whitespace-pre-wrap">
                                        {about?.bio || "Shalom Kindergarten & Primary School is a premier educational institution dedicated to providing a supportive and enriched learning environment for young learners."}
                                    </p>
                                </div>
                            </section>

                            {/* History Section */}
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-500">Our History</h2>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group">
                                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors hidden md:block" />
                                    <p className="text-lg md:text-xl text-gray-300 leading-loose relative z-10 whitespace-pre-wrap">
                                        {about?.history || "Founded with a vision to provide quality education, Shalom has grown from a small nursery into a full-fledged primary school with a legacy of excellence."}
                                    </p>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-500">Experience</h2>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8 md:p-12">
                                    <p className="text-lg text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {about?.experience || "With years of dedicated service in early childhood and primary education, our faculty brings a wealth of knowledge and passion to the classroom."}
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar / Mission Section */}
                        <div className="space-y-8">
                            <section className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                    <Target className="w-48 h-48" />
                                </div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <Target className="w-8 h-8" />
                                    <h2 className="text-xl font-bold uppercase tracking-widest opacity-80">Our Mission</h2>
                                </div>
                                <p className="text-xl font-medium leading-relaxed relative z-10">
                                    {about?.mission || "To empower every child with the knowledge, skills, and values they need to thrive."}
                                </p>
                            </section>

                            <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-10 space-y-6">
                                <h3 className="text-xl font-bold">Ready to start?</h3>
                                <p className="text-gray-400">
                                    Let's discuss how we can partner in your child's educational journey.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-3 text-amber-500 font-bold hover:gap-5 transition-all"
                                >
                                    Get in touch <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Administration Section */}
                    {staff.length > 0 && (
                        <section className="mt-40">
                            <div className="flex items-center gap-4 mb-20 justify-center">
                                <div className="h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 opacity-20" />
                                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic whitespace-nowrap px-8">Administrators</h2>
                                <div className="h-1 bg-gradient-to-r from-blue-500 via-transparent to-transparent flex-1 opacity-20" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                                {staff.map((member, i) => (
                                    <div key={member.id} className="flex flex-col items-center text-center group">
                                        <div className={`w-48 h-48 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 mb-8 flex items-center justify-center text-6xl font-black text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform group-hover:scale-105 transition-all duration-500 border-8 border-gray-900 group-hover:border-blue-500/20 overflow-hidden`}>
                                            {member.imageUrl ? (
                                                <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                member.name.split(' ').map((n: string) => n[0]).join('')
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter">{member.name}</h3>
                                        <p className="text-blue-500 text-xs font-black uppercase tracking-[0.3em] mb-4 bg-blue-500/10 px-4 py-1 rounded-full">{member.title}</p>
                                        <p className="text-gray-400 font-medium tracking-widest text-sm">{member.phone}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Environment Section */}
                    {environment.length > 0 && (
                        <section className="mt-48">
                            <div className="flex items-center gap-4 mb-20">
                                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic">School Environment</h2>
                                <div className="h-px bg-gray-800 flex-1" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {environment.map((item) => (
                                    <div key={item.id} className="bg-gray-900 rounded-[3rem] overflow-hidden group border border-gray-800 hover:border-blue-500/50 transition-all flex flex-col h-full shadow-2xl">
                                        <div className="aspect-[4/3] bg-gray-800 flex items-center justify-center text-[10rem] group-hover:scale-110 transition-transform duration-1000 relative">
                                            <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
                                            {item.videoUrl ? (
                                                <div className="w-full h-full relative z-10">
                                                    {item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be') ? (
                                                        <iframe
                                                            className="w-full h-full"
                                                            src={item.videoUrl.replace('watch?v=', 'embed/').split('&')[0]}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    ) : (
                                                        <video
                                                            src={item.videoUrl}
                                                            className="w-full h-full object-cover"
                                                            controls
                                                            muted
                                                            playsInline
                                                        />
                                                    )}
                                                </div>
                                            ) : item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                item.icon || "🏫"
                                            )}
                                        </div>
                                        <div className="p-10 flex-1 flex flex-col">
                                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">{item.subLabel}</p>
                                            <h3 className="text-2xl font-bold mb-4 uppercase italic tracking-tighter">{item.title}</h3>
                                            <p className="text-gray-500 leading-relaxed text-sm flex-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
