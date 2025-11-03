import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export const metadata: Metadata = {
  title: "RealState Platform",

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="es">
      <body>
        <ClientProviders session={session}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
