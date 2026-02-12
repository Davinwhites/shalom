import { prisma } from "@/lib/prisma";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ContactForm from "@/components/public/ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
    const contact = await prisma.contactInfo.findUnique({ where: { id: 1 } });

    return (
        <div className="flex flex-col min-h-screen" translate="no">
            <Navbar />

            <main className="flex-1 pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        <div>
                            <h1 className="text-4xl md:text-7xl font-bold mb-8 uppercase tracking-tighter">Get in <br /><span className="text-gray-500">Touch.</span></h1>
                            <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                                Interested in joining the Shalom family or have questions about our curriculum?
                                Reach out to us through any of the channels below.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-center group">
                                    <div className="w-14 h-14 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email</p>
                                        <p className="text-xl font-medium">{contact?.email || "info@shalomschool.com"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-center group">
                                    <div className="w-14 h-14 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Phone</p>
                                        <p className="text-xl font-medium">{contact?.phone || "+123 456 7890"}</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-center group">
                                    <div className="w-14 h-14 bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Campus</p>
                                        <p className="text-xl font-medium">{contact?.address || "Shalom Campus, Education St, City"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ContactForm
                            initialContact={contact ? {
                                email: contact.email,
                                phone: contact.phone,
                                address: contact.address
                            } : undefined}
                        />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
