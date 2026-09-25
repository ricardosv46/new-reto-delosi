import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-[11px] font-medium tracking-[0.18em] text-tertiary uppercase">404</p>
      <h2 className="mt-3 text-[28px] leading-[1.2] font-bold tracking-[-0.02em] text-foreground">
        Recurso no encontrado
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        El producto o página que estás intentando buscar no existe, ha sido trasladado o no está
        disponible.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-[#2B2B30]"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        Volver al catálogo
      </Link>
    </div>
  );
}
