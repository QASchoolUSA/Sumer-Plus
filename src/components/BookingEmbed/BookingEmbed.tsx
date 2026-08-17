"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function BookingEmbed() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi();
            cal("ui", {
                theme: "dark",
                styles: { branding: { brandColor: "#D4AF37" } },
                hideEventTypeDetails: true,
                layout: "month_view",
            });
        })();
    }, []);

    return (
        <Cal
            calLink="sumerplusimc/30min"
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
            config={{ layout: "month_view", theme: "dark" }}
        />
    );
}
