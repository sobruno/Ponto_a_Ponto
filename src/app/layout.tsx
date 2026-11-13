import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Ponto a Ponto - Organizador Pessoal de Tarefas",
  description: "Conectando planejamento e execução passo a passo.",
  icons: {
    icon: "/logo/Logo-32x32.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#141519] text-[#E0E2E7]">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
