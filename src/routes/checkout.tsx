import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/products";
import { shippingFor } from "@/lib/pricing";
import { cartSubtotal, useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — DRIPWEAR" },
      { name: "description", content: "Enter delivery details and choose UPI, card or Cash on Delivery." },
      { property: "og:title", content: "Checkout — DRIPWEAR" },
      { property: "og:description", content: "Secure checkout for your DRIPWEAR order." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { cart, placeOrder } = useShop();
  const [pay, setPay] = useState<"Razorpay" | "COD">("Razorpay");
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="min-h-[50vh]" />;
  const sub = cartSubtotal(cart);
  const total = sub + shippingFor(sub);
  if (cart.length === 0) return <div className="container-x py-24 text-center"><p>Your cart is empty.</p><Link to="/shop" className="underline">Shop now</Link></div>;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name"));
    const o = placeOrder({ items: cart, total, payment: pay, name });
    navigate({ to: "/order-success", search: { id: o.id } });
  };
  const input = "w-full rounded-md border bg-card px-3 py-2.5 text-sm";

  return (
    <form onSubmit={submit} className="container-x grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <h1 className="text-3xl font-black">Checkout</h1>
        <section className="space-y-3">
          <p className="font-semibold">Delivery address</p>
          <input name="name" required placeholder="Full name" className={input} />
          <input required type="tel" pattern="[0-9+ ]{10,14}" placeholder="Phone number" className={input} />
          <input required placeholder="House no., street, area" className={input} />
          <div className="grid grid-cols-3 gap-3">
            <input required placeholder="City" className={input} />
            <input required placeholder="State" className={input} />
            <input required pattern="[0-9]{6}" placeholder="PIN code" className={input} />
          </div>
        </section>
        <section className="space-y-3">
          <p className="font-semibold">Payment method</p>
          {([["Razorpay", "Razorpay — UPI, Cards, Net Banking"], ["COD", "Cash on Delivery"]] as const).map(([v, l]) => (
            <label key={v} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 text-sm", pay === v && "border-primary")}>
              <input type="radio" checked={pay === v} onChange={() => setPay(v)} className="accent-primary" /> {l}
            </label>
          ))}
          <p className="text-xs text-muted-foreground">Online payments are in demo mode until Razorpay is connected.</p>
        </section>
      </div>
      <div className="h-fit rounded-xl border bg-card p-6 lg:mt-16">
        <p className="font-semibold">Summary</p>
        {cart.map((i) => <div key={i.key} className="mt-3 flex justify-between gap-2 text-sm"><span className="truncate">{i.qty}× {i.name}</span><span>{formatINR(i.qty * i.price)}</span></div>)}
        <div className="mt-4 flex justify-between border-t pt-4 text-xl font-black"><span>Total</span><span>{formatINR(total)}</span></div>
        <Button type="submit" size="lg" className="mt-6 w-full">Place Order</Button>
      </div>
    </form>
  );
}
