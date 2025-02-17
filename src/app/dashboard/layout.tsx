import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { SideNav } from "@/components/nav/SideNav";
import { MobileNav } from "@/components/nav/MobileNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business Tracker",
  description: "Track your business orders and expenses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <SideNav />
      <MobileNav />
      {/* Main content */}
      <div className="flex-1 md:pl-64">
        <div className="md:hidden h-16" /> {/* Mobile nav spacer */}
        {children}
      </div>
    </div>
  );
}
