'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('E-commerce error details:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-accent">
        <AlertCircle className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h2 className="mt-6 text-[28px] leading-[1.2] font-bold tracking-[-0.02em] text-foreground">
        Error en la tienda
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        Ha ocurrido un error al cargar la información de FakeStoreAPI o procesar la UI. Por favor,
        reintenta la operación.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4.5 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-[#2B2B30]"
      >
        <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
        Reintentar carga
      </button>
    </div>
  );
}
