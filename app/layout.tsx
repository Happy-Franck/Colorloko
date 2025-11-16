import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ThemeToggle } from "./components/ThemeToggle"; 
import Image from "next/image";

export const metadata: Metadata = {
  title: "Colorloko - Générateur de Palettes de Couleurs",
  description: "Générateur de palettes de couleurs par Franck Solofonirina RAKOTOARISOA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-md z-50">
            <div className="container mx-auto h-full px-4 flex items-center justify-between">
              <div className="w-10"></div>
              <div className="flex items-center justify-center flex-1">
                <Image
                  src="/logo.svg"
                  alt="Next.js Logo"
                  width={175}
                  height={38}
                  className="dark:invert"
                  priority
                />
              </div>
              <div className="w-10">
                <ThemeToggle />
              </div>
            </div>
          </nav>
          <main className="pt-20 flex-1">
            {children}
          </main>
          <footer className="py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Franck Solofonirina RAKOTOARISOA. Tous droits réservés.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
