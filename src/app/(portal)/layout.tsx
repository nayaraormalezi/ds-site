import { Footer } from "@/components/portal/Footer";
import { Header } from "@/components/portal/Header";
import "@/components/portal/portal.css";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="portal-main">{children}</main>
      <Footer />
    </>
  );
}
