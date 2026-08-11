import type { Metadata } from "next";
import { JobDashboard } from "./JobDashboard";

export const metadata: Metadata = {
  title: "Sailaab",
  description: "Sailaab",
};

export default function Home() {
  return <JobDashboard />;
}
