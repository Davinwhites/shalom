"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

interface ContactFormProps {
    initialContact?: {
        email: string;
        phone: string;
        address: string;
    };
}

export default function ContactForm({ initialContact }: ContactFormProps) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        projectType: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setFormData({ name: "", email: "", projectType: "", message: "" });
            } else {
                setError(data.message || "Failed to send message");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 border border-gray-800 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Send className="w-32 h-32" />
            </div>

            <h2 className="text-2xl font-bold mb-8">Send a Message</h2>

            {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
                    <h3 className="text-2xl font-bold">Message Sent!</h3>
                    <p className="text-gray-400">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="mt-6 text-blue-500 font-bold hover:underline"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors text-white font-medium placeholder:text-gray-400"
                        />
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors text-white font-medium placeholder:text-gray-400"
                        />
                    </div>
                    <input
                        type="text"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        placeholder="Inquiry Type (e.g., Admissions, General)"
                        className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors text-white font-medium placeholder:text-gray-400"
                    />
                    <textarea
                        rows={5}
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Your message..."
                        className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors resize-none text-white font-medium placeholder:text-gray-400"
                    ></textarea>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Message"
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
