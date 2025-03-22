import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b shadow-sm">
      <nav className="container px-3 py-3 flex mx-auto justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.jpg"
            alt="Welth Logo"
            height={60}
            width={200}
            className="h-14 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-4">
            <SignedIn>
                <Link href={"/dashboard"} className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                    <Button variant="outline">
                        <LayoutDashboard size={18}/>
                        <span className="md:inline">Dashboard</span>
                    </Button>
                </Link>
                <Link href={"/transaction/create"}>
                    <Button className="flex items-center gap-2">
                        <PenBox size={18}/>
                        <span className="md:inline">Add Transaction</span>
                    </Button>
                </Link>
            </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{
                elements:{
                    avatarBox: "w-16 h-16",
                },
            }}/>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
