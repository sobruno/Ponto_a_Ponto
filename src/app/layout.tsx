import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-full flex flex-col font-sans bg-[#121316] text-[#E0E2E7]">
        {children}
      </body>
    </html>
  );
}
