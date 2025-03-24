import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DarkModeToggle from "../components/DarkModeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SurveyAI - Market Research Tool",
  description: "AI-powered survey creation and analysis platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white dark:bg-dark-background text-gray-900 dark:text-dark-text`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="p-4 flex justify-between items-center border-b dark:border-gray-700">
            <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SurveyAI
            </h1>
            <DarkModeToggle />
          </header>
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
