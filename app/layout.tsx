import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  weight: ["500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Expense Tracker",
  description:
    "Track, manage, and analyze your personal expenses with ease. A budgeting and finance management tool to help you save money, monitor spending, and stay in control of your financial goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-slate-100`}>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
