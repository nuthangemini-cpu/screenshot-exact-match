import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { formatINR, getProduct, SIZES } from "@/lib/products";
import { useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = getProduct(params.id);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — DRIPWEAR` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — DRIPWEAR` },
          { property: "og:description", content: loaderData.description },
        ]
      : [{ title: "Product unavailable — DRIPWEAR" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData();
  const [color, setColor] = useState(p.colors[0] ?? "");
  const [size, setSize] = useState("M");
  const add = useShop((s) => s.addToCart);
  const navigate = useNavigate();
  const off = Math.round((1 - p.price / p.mrp) * 100);

  return (
    <div className="container-x py-8">
      <p className="text-xs text-muted-foreground"><Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {p.name}</p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-surface">
          <img src={p.image} alt={p.name} width={816} height={816} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-black md:text-4xl">{p.name}</h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-star text-star" /> {p.rating} ({p.reviews} reviews)</div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black">{formatINR(p.price)}</span>
            <span className="text-muted-foreground line-through">{formatINR(p.mrp)}</span>
            <span className="rounded bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">{off}% OFF</span>
          </div>
          <p className="mt-4 max-w-md text-muted-foreground">{p.description}</p>

          <p className="mt-8 text-sm font-semibold">Color</p>
          <div className="mt-3 flex gap-3">
            {p.colors.map((c) => (
              <button key={c} aria-label={`Color ${c}`} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={cn("h-8 w-8 rounded-full border-2 ring-offset-2", color === c && "ring-2 ring-primary")} />
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold">Size</p>
          <div className="mt-3 flex gap-2">
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={cn("h-10 w-12 rounded-md border text-sm", size === s && "border-primary bg-primary text-primary-foreground")}>{s}</button>
            ))}
          </div>
          <div className="mt-8 flex max-w-md flex-col gap-3">
            <Button size="lg" onClick={() => { add({ productId: p.id, name: p.name, image: p.image, size, color, price: p.price }); toast.success("Added to cart"); }}>Add to Cart</Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: "/customize", search: { product: p.id } })}>Customize this {p.category === "hoodies" ? "hoodie" : "piece"} <ArrowRight /></Button>
          </div>
          <Accordion type="single" collapsible className="mt-8 max-w-md">
            <AccordionItem value="d"><AccordionTrigger>Product details</AccordionTrigger><AccordionContent>Fabric: {p.fabric}. Machine wash cold, inside out.</AccordionContent></AccordionItem>
            <AccordionItem value="s"><AccordionTrigger>Size & fit</AccordionTrigger><AccordionContent>True to size. Size up for a looser fit.</AccordionContent></AccordionItem>
            <AccordionItem value="r"><AccordionTrigger>Delivery & returns</AccordionTrigger><AccordionContent>Free shipping on orders above ₹999. Returns policy to be confirmed.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
