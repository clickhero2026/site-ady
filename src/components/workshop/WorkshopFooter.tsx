import Link from "next/link";
import { AdySymbol } from "./AdySymbol";
import styles from "./WorkshopFooter.module.css";

/**
 * Rodapé mínimo do funil de workshop — só o símbolo do ady e um link
 * discreto pra Privacidade (pedido do Rafael: as duas páginas coletam
 * dado pessoal via formulário, então precisa de algum acesso à política,
 * mesmo que mínimo). Sem "Roadmap"/"Instagram"/Termos — só isso.
 * `/privacidade` é uma página de conteúdo legal, não faz parte da
 * navegação da home, então não viola a regra de "sem navegação pra
 * home" do funil. Usado em /workshop e /workshop/obrigado.
 */
export function WorkshopFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <AdySymbol size={28} />
        <Link href="/privacidade" className={styles.privacy}>
          Privacidade
        </Link>
      </div>
    </footer>
  );
}
