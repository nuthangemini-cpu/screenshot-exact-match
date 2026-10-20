import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Paintbrush, ShieldCheck, Shirt, Truck } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DRIPWEAR — Wear Your Story | Custom Streetwear India" },
      { name: "description", content: "Premium T-shirts, hoodies and jerseys you can customise. Create. Express." },
      { property: "og:title", content: "DRIPWEAR — Wear Your Story" },
      { property: "og:description", content: "Premium T-shirts, hoodies and jerseys you can customise." },
    ],
  }),
  component: Home,
});

const PERKS = [
  { icon: Shirt, t: "Premium Fabric", d: "High quality materials" },
  { icon: Paintbrush, t: "Easy Customization", d: "Design your own" },
  { icon: ShieldCheck, t: "Personal designs", d: "Made your way" },
  { icon: Truck, t: "India storefront", d: "Prices in INR" },
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={hero} alt="Two models wearing DRIPWEAR graphic tees" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="container-x relative flex min-h-[420px] flex-col justify-center py-12 md:min-h-[560px]">
          <h1 className="max-w-xl text-5xl font-black uppercase leading-[0.95] md:text-8xl">Wear<br />your story.</h1>
          <p className="mt-6 max-w-sm text-base text-foreground/80">Premium T-shirts, hoodies, polos, and jerseys. Customize your style. Express yourself.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/shop">Shop Collection <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-card/80"><Link to="/customize">Customize Now</Link></Button>
          </div>
        </div>
      </section>

      <section className="container-x grid grid-cols-2 gap-6 border-b py-8 md:grid-cols-4">
        {PERKS.map((p) => (
          <div key={p.t} className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border"><p.icon className="h-4 w-4" /></div>
            <div className="min-w-0"><p className="text-sm font-semibold">{p.t}</p><p className="text-xs text-muted-foreground">{p.d}</p></div>
          </div>
        ))}
      </section>

      <section className="container-x mt-8 md:mt-16">
        <h2 className="text-3xl font-black">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to="/shop" search={{ cat: c.id }} className="category-tile group relative flex h-[120px] items-center overflow-hidden rounded-lg border bg-surface md:block md:h-auto md:aspect-[3/4]">
              <img src={c.image} alt={c.label} loading="lazy" className="h-full w-[48%] object-cover transition-transform duration-500 group-hover:scale-105 md:w-full" />
              <div className="min-w-0 flex-1 p-2 md:absolute md:inset-x-0 md:bottom-0 md:bg-ink/80 md:p-4 md:text-ink-foreground">
                <p className="font-display text-xs font-extrabold sm:text-sm md:text-lg">{c.label}</p>
                <p className="mt-1 text-xs opacity-80">Explore →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x mt-10 md:mt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-black">Featured collection</h2>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">View all →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {PRODUCTS.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="grid items-center gap-8 overflow-hidden bg-ink p-8 text-ink-foreground md:grid-cols-2 md:p-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">Customization Studio</p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl">YOUR DESIGN. YOUR DRIP.</h2>
            <p className="mt-4 max-w-md opacity-70">Choose your apparel, upload your artwork, personalize every detail, and bring your idea to life.</p>
            <Button asChild size="lg" variant="secondary" className="mt-8"><Link to="/customize">Start designing <ArrowRight /></Link></Button>
          </div>
          <img src={CATEGORIES[4]?.image} alt="Custom sports jersey" loading="lazy" className="mx-auto w-full max-w-sm rounded-xl" />
        </div>
      </section>
    </>
  );
}
