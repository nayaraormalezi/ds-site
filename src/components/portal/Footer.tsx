import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/brand/logo-on-dark.svg"
              alt="CAIXA Consórcio"
              width={120}
              height={56}
            />
            <p>
              Portal de Marca e Assets — fonte única e confiável de materiais
              oficiais da CAIXA Consórcio.
            </p>
          </div>
          <div>
            <h3>Portal</h3>
            <Link href="/a-marca">A marca</Link>
            <Link href="/identidade-visual">Identidade visual</Link>
            <Link href="/guias">Guias e orientações</Link>
            <Link href="/biblioteca">Biblioteca</Link>
          </div>
          <div>
            <h3>Recursos</h3>
            <Link href="/campanhas">Campanhas</Link>
            <Link href="/templates">Templates</Link>
            <Link href="/ajuda">Central de ajuda</Link>
            <Link href="/admin">Painel administrativo</Link>
          </div>
          <div>
            <h3>Contato</h3>
            <a href="mailto:marca@caixaconsorcio.com.br">marca@caixaconsorcio.com.br</a>
            <Link href="/ajuda">Solicitar material</Link>
          </div>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} CAIXA Consórcio. Materiais sujeitos às
          diretrizes de identidade visual. Dados demonstrativos do DAM.
        </div>
      </div>
    </footer>
  );
}
