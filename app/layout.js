import "./globals.css";
import {Inter} from "next/font/google";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "My-Wealth",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body className={`${inter.className}`}>
        <Header/>
        <main className="min-h-screen m-10">
        {children}
        </main>
        <Toaster richColors />
        <footer className="py-8 bg-blue-100">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-700 text-lg font-medium">
              Made with by <span className="text-black font-semibold">Harshita Sharma</span> :)
            </p>
          </div>
        </footer>

      </body>
    </html>
  </ClerkProvider>  
  );
}
