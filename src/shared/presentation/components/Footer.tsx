export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-3 px-6 py-8 sm:flex-row sm:items-center">
        <p className="text-[11px] font-medium text-tertiary">
          © {new Date().getFullYear()} Delosi Ingeniería de Software. Todos los derechos reservados.
        </p>
        <p className="text-[11px] font-medium text-tertiary">
          Evaluación Técnica · Frontend Senior
        </p>
      </div>
    </footer>
  );
}
