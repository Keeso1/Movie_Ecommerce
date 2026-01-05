import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Movie Store",
  description: "Movie shopping app",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body className="h-full antialiased">
				<ThemeProvider>
					<CartProvider>
						<Navbar />
						<main className="grow">{children}</main>
					</CartProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
