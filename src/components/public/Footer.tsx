import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
    const contact = await prisma.contactInfo.findUnique({ where: { id: 1 } });
    const settings = await prisma.schoolSettings.findUnique({ where: { id: 1 } });

    const nameParts = (settings?.name || "Shalom School").split(' ');
    const firstName = nameParts[0];
    const restName = nameParts.slice(1).join(' ');

    return (
        <footer className="bg-gray-950 border-t border-gray-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src={settings?.logoUrl || "/logo.jpeg"}
                            alt="School Logo"
                            className="w-8 h-8 object-cover rounded shadow-md"
                        />
                        <span className="text-lg font-bold tracking-tight text-white uppercase">{firstName}<span className="text-amber-500"> {restName}</span></span>
                    </Link>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Nurturing excellence and inspiring futures through holistic education and integrity.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Navigation</h4>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                        <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Me</Link></li>
                        <li><Link href="/plans" className="hover:text-blue-400 transition-colors">Academic Plans</Link></li>
                        <li><Link href="/designs" className="hover:text-blue-400 transition-colors">School Events</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Resources</h4>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><Link href="/resources" className="hover:text-blue-400 transition-colors">Technical Docs</Link></li>
                        <li><Link href="/admin/login" className="hover:text-blue-400 transition-colors">Admin Access</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Connect</h4>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-500" /> {contact?.email}</li>
                        <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-blue-500" /> {contact?.phone}</li>
                        <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-blue-500" /> {contact?.address}</li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-900 flex flex-col md:row justify-between items-center gap-4 text-xs text-gray-500">
                <p>© {new Date().getFullYear()} Shalom Kindergarten & Primary School. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
