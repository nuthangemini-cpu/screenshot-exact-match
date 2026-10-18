import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/products";
import { useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order-success")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => ({ id: typeof s.id === "string" ? s.id : undefined }),
  head: () => ({
    meta: [
      { title: "Order Placed — DRIPWEAR" },
      { name: "description", content: "Your DRIPWEAR order is confirmed." },
      { property: "og:title", content: "Order Placed — DRIPWEAR" },
      { property: "og:description", content: "Track your DRIPWEAR order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Success,
});

const STEPS = ["Order placed", "Processing", "Shipped", "Out for delivery", "Delivered"];

function Success() {
  const { id } = Route.useSearch();
  const orders = useShop((s) => s.orders);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const o = orders.find((x) => x.id === id);
  if (!ready) return <div className="min-h-[50vh]" />;
  return (
    <div className="container-x max-w-2xl py-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-primary-foreground"><Check className="h-8 w-8" /></div>
      <h1 className="mt-6 text-3xl font-black">Order placed successfully!</h1>
      <p className="mt-2 text-muted-foreground">Thank you for your order. We'll keep you updated.</p>
      {o && (
        <div className="mt-8 rounded-xl border bg-card p-6 text-left text-sm">
          <Row l="Order ID" r={o.id} /><Row l="Date" r={new Date(o.date).toLocaleString("en-IN")} /><Row l="Payment" r={o.payment} /><Row l="Total" r={formatINR(o.total)} />
          <p className="mt-6 font-semibold">Track your order</p>
          <ol className="mt-4 grid grid-cols-5 gap-1 text-[11px]">
            {STEPS.map((s, i) => (
              <li key={s} className="text-center"><div className={cn("mx-auto mb-2 h-2 rounded-full", i <= 1 ? "bg-success" : "bg-muted")} />{s}</li>
            ))}
          </ol>
        </div>
      )}
      <div className="mt-8 flex justify-center gap-3"><Button asChild><Link to="/account">View orders</Link></Button><Button asChild variant="outline"><Link to="/shop">Keep shopping</Link></Button></div>
    </div>
  );
}
const Row = ({ l, r }: { l: string; r: string }) => <div className="flex justify-between py-1"><span className="text-muted-foreground">{l}</span><span className="font-medium">{r}</span></div>;
