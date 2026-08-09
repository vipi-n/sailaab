import type { Metadata } from "next";
import { JobDashboard } from "./JobDashboard";

export const metadata: Metadata = {
  title: "mixtape.fm — late night drive",
  description: "A personal soundtrack for empty roads, city lights, and the long way home.",
};

export default function Home() {
  return <JobDashboard />;
}
