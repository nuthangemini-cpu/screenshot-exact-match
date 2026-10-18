import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { formatINR, type Product } from "@/lib/products";
import { useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const wished = useShop((s) => s.wishlist.includes(product.id));
  const toggle = useShop((s) => s.toggleWish);
  return (
    <div className="group relative">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
          <img src={product.image} alt={product.name} loading="lazy" width={816} height={816} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {product.isNew && <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">New</span>}
        </div>
        <div className="mt-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-sans text-sm font-medium">{product.name}</h3>
            <p className="mt-0.5 text-sm font-bold">{formatINR(product.price)}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-star text-star" /> {product.rating} ({product.reviews})
            </div>
          </div>
        </div>
      </Link>
      <button aria-label="Toggle wishlist" onClick={() => toggle(product.id)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-card/90 shadow-card">
        <Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} />
      </button>
    </div>
  );
}
