import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { formatINR, PRODUCTS } from "@/lib/products";
import { useShop } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — DRIPWEAR" },
      { name: "description", content: "Your DRIPWEAR orders and wishlist." },
      { property: "og:title", content: "My Account — DRIPWEAR" },
      { property: "og:description", content: "Your DRIPWEAR orders and wishlist." },
    ],
  }),
  component: Account,
});

function Account() {
  const { orders, wishlist } = useShop();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="min-h-[50vh]" />;
  const wished = PRODUCTS.filter((p) => wishlist.includes(p.id));
  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-black">My Account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign-in is coming soon — orders and wishlist are saved on this device.</p>
      <h2 className="mt-10 text-xl font-extrabold">My orders</h2>
      {orders.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">No orders yet. <Link to="/shop" className="underline">Start shopping</Link></p> : (
        <ul className="mt-4 divide-y rounded-xl border bg-card">
          {orders.map((o) => (
            <li key={o.id} className="flex items-center gap-4 p-4">
              <img src={o.items[0]?.image} alt="" className="h-14 w-14 rounded bg-surface object-cover" />
              <div className="min-w-0 flex-1"><p className="font-semibold">{o.id}</p><p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString("en-IN")} · {o.items.length} item(s)</p></div>
              <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium">{o.status}</span>
              <span className="font-bold">{formatINR(o.total)}</span>
            </li>
          ))}
        </ul>
      )}
      <h2 className="mt-12 text-xl font-extrabold">Wishlist</h2>
      {wished.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Tap the heart on any product to save it.</p> : (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">{wished.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
