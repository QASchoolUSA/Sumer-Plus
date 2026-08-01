"use client";
import dynamic from "next/dynamic";

const BookingEmbed = dynamic(() => import("./BookingEmbed"), { ssr: false });

export default function BookingEmbedWrapper(
  props: Record<string, unknown>
) {
  return <BookingEmbed {...props} />;
}
