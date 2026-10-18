import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="container-x grid gap-10 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="font-display text-3xl font-black tracking-tighter">DRIPWEAR</p>
          <p className="mt-3 max-w-sm text-sm opacity-70">Premium T-shirts, hoodies, polos and jerseys — personalised by you, made in India.</p>
          <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed! (demo)"); (e.target as HTMLFormElement).reset(); }}>
            <input required type="email" placeholder="Your email" className="flex-1 rounded-md border border-sidebar-border bg-transparent px-3 py-2 text-sm placeholder:opacity-50" />
            <button className="rounded-md bg-ink-foreground px-4 text-sm font-semibold text-ink">Join</button>
          </form>
        </div>
        <FooterCol title="Shop" items={[["T-Shirts", "/shop"], ["Hoodies", "/shop"], ["Jerseys", "/shop"]]} />
        <FooterCol title="Create" items={[["Customization Studio", "/customize"], ["Team Jerseys", "/customize"], ["About", "/about"]]} />
        <FooterCol title="Help" items={[["Shipping & Returns", "/about"], ["Size Guide", "/about"], ["Privacy · Terms", "/about"]]} />
      </div>
      <div className="container-x flex flex-wrap items-center justify-between gap-3 border-t border-sidebar-border py-6 text-xs opacity-60">
        <span>© 2026 DRIPWEAR. All rights reserved.</span>
        <span>UPI · Visa · Mastercard · RuPay · Cash on Delivery</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-4 space-y-2 text-sm opacity-70">
        {items.map(([l, to]) => <li key={l}><Link to={to} className="hover:opacity-100">{l}</Link></li>)}
      </ul>
    </div>
  );
}
