import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "HealthCalcsPro — Free Health Calculators for BMI, Calories & More",
  description: "Complete health calculator platform with 25 calculators for BMI, BMR, Calories, Macros, and more. Scientific, trustworthy, and accessible.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
