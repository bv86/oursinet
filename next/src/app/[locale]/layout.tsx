import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layouts/Footer";
import { type Locale } from "@/config";
import { getGlobalSettings } from "@/lib/data/loaders";
import Header from "@/components/layouts/Header";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Oursi.net",
  description: "Personal website of Benoit Vannesson",
};

async function loader(locale: Locale) {
  const { data } = await getGlobalSettings(locale);
  if (!data) throw new Error("Failed to fetch global settings");
  return { header: data?.header, footer: data?.footer };
}

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
  }>
) {
  const { locale } = await props.params;
  const { children } = props;
  const { header, footer } = await loader(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased h-screen`}>
        <div className="flex flex-col overflow-x-clip h-full items-center">
          <Header data={header} />
          <main className="container flex flex-grow flex-col">{children}</main>
          <Footer data={footer} />
        </div>
      </body>
    </html>
  );
}
