import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Питомник мейн-кунов «Тихий Дом» — здоровые котята-компаньоны для семьи",
  description:
    "Семейный питомник мейн-кунов в Москве. Здоровые, спокойные котята-компаньоны для семьи. Открытые генетические тесты HCM, PKDef, SMA. Фильтр по характеру, онлайн-бронирование, пожизненная поддержка заводчика.",
  keywords: [
    "питомник мейн-кунов",
    "купить котенка мейн-куна",
    "здоровые котята мейн-кун",
    "спокойный мейн-кун для семьи",
    "мейн-кун с документами",
    "генетические тесты мейн-кун",
    "котята мейн-кун Москва",
  ],
  authors: [{ name: "Питомник «Тихий Дом»" }],
  openGraph: {
    title: "Питомник мейн-кунов «Тихий Дом»",
    description:
      "Маленький семейный питомник. Здоровые, спокойные котята-компаньоны для семьи. Прозрачная генетика, честный подход.",
    siteName: "Тихий Дом",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Питомник мейн-кунов «Тихий Дом»",
    description:
      "Здоровые, спокойные котята-компаньоны для семьи. Прозрачная генетика, честный подход.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="bottom-right" richColors />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Breeder",
              name: "Питомник мейн-кунов «Тихий Дом»",
              description:
                "Семейный питомник мейн-кунов. Здоровые, спокойные котята-компаньоны для семьи.",
              areaServed: "Москва, Россия",
              knowsAbout: ["Maine Coon", "Felis catus", "разведение кошек"],
              breed: { "@type": "Thing", name: "Мейн-кун" },
            }),
          }}
        />
      </body>
    </html>
  );
}
