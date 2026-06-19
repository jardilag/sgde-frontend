import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SGDE",
    template: "%s | SGDE",
  },
  description: "Sistema de Gestión Documental Electrónica para entidades públicas colombianas.",
  applicationName: "SGDE",
  keywords: ["SGDE", "gestión documental", "sector público", "Colombia"],
  authors: [{ name: "SGDE" }],
};

type RootLayoutProps = {
  readonly children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[var(--sgde-background)] text-[var(--sgde-foreground)]">
        <AntdRegistry>
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
