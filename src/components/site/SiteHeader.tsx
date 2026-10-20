import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cartCount, useShop } from "@/lib/store";
import { useAuth } from '@/lib/auth';

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/customize", label: "Customize" },
  { to: "/shop", label: "Jerseys", cat: "jerseys" },
  { to: "/shop", label: "Hoodies", cat: "hoodies" },
  { to: "/shop", label: "Polos", cat: "polos" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const {user} = useAuth();
  const cart = useShop((s) => s.cart);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(cart) : 0;

  const links = (cls: string) =>
    NAV.map((n) => (
      <Link key={n.label} to={n.to} search={"cat" in n ? { cat: n.cat } : {}} className={cls} activeOptions={{ exact: true, includeSearch: true }} activeProps={{ className: "text-foreground font-semibold" }}>
        {n.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="hidden bg-ink py-1.5 text-center text-xs tracking-wide text-ink-foreground md:block">
        Discover your style. Design your own. — New drops available now.
      </div>
      <div className="container-x grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger className="lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetTitle className="font-display text-2xl font-black">DRIPWEAR</SheetTitle>
              <nav className="mt-8 flex flex-col gap-4 text-lg text-muted-foreground">{links("hover:text-foreground")}
                <Link to="/account" className="hover:text-foreground">Account</Link>
                <Link to="/admin" className="hover:text-foreground">Admin</Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="font-display text-xl font-black tracking-tighter md:text-2xl">DRIPWEAR</Link>
        </div>
        <nav className="hidden justify-center gap-7 text-sm text-muted-foreground lg:flex">{links("transition-colors hover:text-foreground")}</nav>
        <div className="flex items-center justify-end gap-4">
          <Link to="/shop" aria-label="Search"><Search className="h-5 w-5" /></Link>
          <Link to={user ? '/account' : '/login'} search={{next:'/account'}} aria-label={user ? 'My account' : 'Sign in'}><User className="h-5 w-5" /></Link>
          <Link to="/account" aria-label="Wishlist" className="hidden sm:block"><Heart className="h-5 w-5" /></Link>
          <Link to="/cart" aria-label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
