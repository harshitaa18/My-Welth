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
        <main className="min-h-screen mt-30 m-10">
        {children}
        </main>
        <Toaster richColors />
        <footer className=" py-12">
          <div className="container mx-auto px-4 text-center text-grey-600 ">
            <p>Made by Harshita Sharma :)</p>
          </div>
        </footer>
      </body>
    </html>
  </ClerkProvider>  
  );
}
