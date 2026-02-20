import type { Metadata } from "next";
import "./globals.css";
import Providers from "./components/Providers";
import SignOutButton from "./components/SignOutButton";

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
      <body>
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