import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import SignOutButton from "./components/SignOutButton";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Трекер Расходов",
  description: "Приложение для трекинга расходов по продуктовым чекам из магазинов Португалии",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          <div className="auth-header">
            <SignOutButton />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
