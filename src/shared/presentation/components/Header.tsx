import Link from 'next/link';
import { CartButton } from '@/modules/cart/components/CartButton';

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-[68px] w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-foreground">
            Delosi
          </span>
          <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            Store
          </span>
        </Link>

        <CartButton />
      </div>
    </header>
  );
}
