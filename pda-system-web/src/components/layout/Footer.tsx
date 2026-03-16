export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 border-t border-zinc-800 bg-zinc-950 px-6 py-3">
      <p className="text-center text-zinc-600 text-xs">
        © {year} PDA-SYSTEM. Todos os direitos reservados. Desenvolvido por Engenharia de Automação, Grupo Multi. v1.0.0
      </p>
    </footer>
  );
}