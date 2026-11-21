import { Suspense } from "react";
import BibliotecaClient from "./BibliotecaClient";

export const metadata = {
  title: "Biblioteca de assets",
};

export default function BibliotecaPage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: 48 }}>
          <div className="skeleton" style={{ height: 40, width: 280, marginBottom: 24 }} />
          <div className="grid-cards">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 260 }} />
            ))}
          </div>
        </div>
      }
    >
      <BibliotecaClient />
    </Suspense>
  );
}
