import type { Metadata } from "next";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CAIXA Consórcio | Portal de Marca e Assets",
    template: "%s | CAIXA Consórcio Portal de Marca",
  },
  description:
    "Todos os recursos da nossa marca em um só lugar. Biblioteca oficial de assets, diretrizes e kits de campanha.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <StoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
