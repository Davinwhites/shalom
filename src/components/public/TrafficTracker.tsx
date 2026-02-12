"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TrafficTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const trackView = async () => {
            // Don't track admin pages to keep analytics clean
            if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return;

            try {
                await fetch("/api/analytics/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: pathname }),
                });
            } catch (err) {
                // Silently fail to not disturb user experience
            }
        };

        trackView();
    }, [pathname]);

    return null;
}
