import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/products";
import { cn } from "@/lib/utils";

type Search = { cat?: Category; q?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: CATEGORIES.some((c) => c.id === s.cat) ? (s.cat as Category) : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop T-Shirts, Hoodies, Polos & Jerseys — DRIPWEAR" },
      { name: "description", content: "Browse DRIPWEAR's premium streetwear collection in INR." },
      { property: "og:title", content: "Shop — DRIPWEAR" },
      { property: "og:description", content: "Browse premium streetwear, ready to customize." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { cat, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState("best");
  const items = useMemo(() => {
    let r = PRODUCTS.filter((p) => (!cat || p.category === cat) && p.price <= maxPrice && (!q || p.name.toLowerCase().includes(q.toLowerCase())));
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "best") r = [...r].sort((a, b) => b.reviews - a.reviews);
    return r;
  }, [cat, q, maxPrice, sort]);

  return (
    <div className="container-x py-8">
      <p className="text-xs text-muted-foreground"><Link to="/">Home</Link> / Shop</p>
      <h1 className="mt-2 text-4xl font-black">{CATEGORIES.find((c) => c.id === cat)?.label ?? "All products"}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-8">
          <input defaultValue={q} placeholder="Search products…" onChange={(e) => navigate({ search: (p) => ({ ...p, q: e.target.value || undefined }), replace: true })} className="w-full rounded-md border bg-card px-3 py-2 text-sm" />
          <div>
            <p className="text-sm font-semibold">Category</p>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
              <Link to="/shop" search={(p) => ({ ...p, cat: undefined })} className={cn("text-sm text-muted-foreground", !cat && "font-semibold text-foreground")}>All</Link>
              {CATEGORIES.map((c) => (
                <Link key={c.id} to="/shop" search={(p) => ({ ...p, cat: c.id })} className={cn("rounded-full border px-3 py-1 text-sm text-muted-foreground lg:border-0 lg:p-0", cat === c.id && "font-semibold text-foreground")}>{c.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold">Max price: ₹{maxPrice}</p>
            <input type="range" min={500} max={2000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="mt-3 w-full accent-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Sort by</p>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="mt-3 w-full rounded-md border bg-card px-3 py-2 text-sm">
              <option value="best">Best selling</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </div>
        </aside>
        <div>
          {items.length === 0 ? <p className="py-20 text-center text-muted-foreground">No products match your filters.</p> : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
