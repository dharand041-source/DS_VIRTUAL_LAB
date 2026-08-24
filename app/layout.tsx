import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LoadingScreen } from "@/components/loading-screen";

export const metadata: Metadata = {
  title: "Data Structures Virtual Lab (C) | Interactive AST Visualizer",
  description: "An interactive academic laboratory for learning Data Structures in C. Continuously analyzes code line-by-line and visualizes dynamic memory states.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-primary font-sans antialiased">
        <AuthProvider>
          <LoadingScreen />
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
