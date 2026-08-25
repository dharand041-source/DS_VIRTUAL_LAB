import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LoadingScreen } from "@/components/loading-screen";
import { TopProgressBar } from "@/components/ui/top-progress-bar";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

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
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <body className={`${montserrat.className} min-h-screen flex flex-col bg-background text-primary antialiased`}>
        <AuthProvider>
          <TopProgressBar />
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
