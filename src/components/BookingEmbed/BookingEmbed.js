"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function BookingEmbed() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi();
            cal("ui", {
                styles: { branding: { brandColor: "#0A2540" } },
                hideEventTypeDetails: false,
                layout: "month_view",
            });
        })();
    }, []);

    return (
        <Cal
            calLink="rick" // REPLACE WITH YOUR CAL.COM LINK e.g., "sumer-plus/consultation"
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: "month_view" }}
        />
    );
}
