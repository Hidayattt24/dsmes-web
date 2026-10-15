import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider }  from "@/contexts/AuthContext";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DIBA (Diabetes Behaviour & Adherence Application)",
  description:
    "Platform DIBA (Diabetes Behaviour & Adherence Application) untuk mendukung pengelolaan dan kepatuhan Diabetes Melitus di Aceh.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${poppins.variable} ${plusJakartaSans.variable} h-full`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
