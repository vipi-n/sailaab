import type { Metadata } from "next";
import { JobDashboard } from "./JobDashboard";

export const metadata: Metadata = {
  title: "Sailaab — the playlist you never asked for",
  description: "367 songs and over 24 hours of music.",
};

export default function Home() {
  return <JobDashboard />;
}
