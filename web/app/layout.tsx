import "./globals.css";

export const metadata = {
  title: "AgentX | PC Monitoring",
  description: "Real-time PC monitoring and AI-assisted diagnostics",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
