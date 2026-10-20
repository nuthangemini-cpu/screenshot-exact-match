import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/products";
import { shippingFor } from "@/lib/pricing";
import { cartCount, cartSubtotal, useShop } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — DRIPWEAR" },
      { name: "description", content: "Review items in your DRIPWEAR cart." },
      { property: "og:title", content: "Your Cart — DRIPWEAR" },
      { property: "og:description", content: "Review items in your DRIPWEAR cart." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, setQty, remove } = useShop();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="min-h-[50vh]" />;
  const sub = cartSubtotal(cart);
  const ship = shippingFor(sub);

  if (cart.length === 0) return (
    <div className="container-x py-24 text-center">
      <h1 className="text-3xl font-black">Your cart is empty</h1>
      <Button asChild className="mt-6"><Link to="/shop">Start shopping</Link></Button>
    </div>
  );

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-black">Your Cart <span className="text-base font-normal text-muted-foreground">({cartCount(cart)} items)</span></h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y rounded-xl border bg-card">
          {cart.map((i) => (
            <li key={i.key} className="flex gap-4 p-4">
              <img src={i.image} alt={i.name} className="h-24 w-24 shrink-0 rounded-md bg-surface object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2"><p className="font-semibold">{i.name}</p><p className="font-bold">{formatINR(i.price * i.qty)}</p></div>
                <p className="text-xs text-muted-foreground">Size: {i.size}</p>
                {i.customization && <p className="truncate text-xs text-muted-foreground">Customization: {i.customization}</p>}
                {i.design && <Link to="/customize" search={{edit:i.key}} className="mt-2 inline-block text-xs underline">Edit design</Link>}
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center rounded-md border">
                    <button aria-label="Decrease" className="p-2" onClick={() => setQty(i.key, i.qty - 1)}><Minus className="h-3 w-3" /></button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button aria-label="Increase" className="p-2" onClick={() => setQty(i.key, i.qty + 1)}><Plus className="h-3 w-3" /></button>
                  </div>
                  <button className="text-xs text-muted-foreground underline" onClick={() => remove(i.key)}>Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="h-fit rounded-xl border bg-card p-6">
          <p className="font-semibold">Order summary</p>
          <Row l="Subtotal" r={formatINR(sub)} />
          <Row l="Shipping" r={ship === 0 ? "Free" : formatINR(ship)} />
          <p className="mt-3 text-xs text-muted-foreground">Sample prices and shipping estimates. Ordering is not yet available.</p>
          <div className="mt-4 flex justify-between border-t pt-4 text-xl font-black"><span>Total</span><span>{formatINR(sub + ship)}</span></div>
          <Button asChild size="lg" className="mt-6 w-full"><Link to="/checkout">Proceed to Checkout</Link></Button>
        </div>
      </div>
    </div>
  );
}

const Row = ({ l, r }: { l: string; r: string }) => <div className="mt-3 flex justify-between text-sm text-muted-foreground"><span>{l}</span><span>{r}</span></div>;
