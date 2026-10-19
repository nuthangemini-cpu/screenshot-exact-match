import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Image as ImageIcon, RotateCw, Trash2, Type, Upload } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatINR, getProduct, PRODUCTS, SIZES } from "@/lib/products";
import { customizationCost } from "@/lib/pricing";
import { useShop } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customize")({
  validateSearch: (s: Record<string, unknown>): { product?: string | undefined } => ({ product: typeof s["product"] === "string" ? (s["product"] as string) : undefined }),
  head: () => ({
    meta: [
      { title: "Customization Studio — Design Your Own | DRIPWEAR" },
      { name: "description", content: "Add text, artwork, names and numbers to tees, hoodies, polos and jerseys." },
      { property: "og:title", content: "DRIPWEAR Customization Studio" },
      { property: "og:description", content: "Design your own streetwear with a live 360° preview." },
    ],
  }),
  component: Studio,
});

type Side = "front" | "back";
interface Layer { id: string; side: Side; kind: "text" | "image"; value: string; x: number; y: number; size: number; color: string }

const BASES = ["clean-white-oversized", "shadow-hoodie", "classic-polo", "volt-jersey"];
const INK = ["#111111", "#ffffff", "#2457ff", "#d92b2b", "#1f8a4c", "#d6b25e"];

function Studio() {
  const { product } = Route.useSearch();
  const initial = product && BASES.includes(product) ? product : product && getProduct(product) ? product : BASES[3]!;
  const [baseId, setBaseId] = useState(initial);
  const base = getProduct(baseId) ?? PRODUCTS[0]!;
  const [side, setSide] = useState<Side>("front");
  const [layers, setLayers] = useState<Layer[]>(base.category === "jerseys" ? [
    { id: "n", side: "back", kind: "text", value: "YOUR NAME", x: 50, y: 30, size: 28, color: "#ffffff" },
    { id: "num", side: "back", kind: "text", value: "10", x: 50, y: 52, size: 90, color: "#ffffff" },
  ] : []);
  const [sel, setSel] = useState<string | null>(null);
  const [size, setSize] = useState("M");
  const [spin, setSpin] = useState(false);
  const canvas = useRef<HTMLDivElement>(null);
  const drag = useRef<string | null>(null);
  const add = useShop((s) => s.addToCart);
  const navigate = useNavigate();

  const usedSides = [...new Set(layers.map((l) => l.side))];
  const extra = customizationCost(usedSides);
  const total = base.price + extra;
  const selected = layers.find((l) => l.id === sel);
  const update = (id: string, patch: Partial<Layer>) => setLayers((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const addText = () => {
    const id = crypto.randomUUID();
    setLayers((l) => [...l, { id, side, kind: "text", value: "DRIPWEAR", x: 50, y: 40, size: 32, color: "#2457ff" }]);
    setSel(id);
  };
  const onUpload = (f?: File) => {
    if (!f) return;
    if (f.size > 5_000_000) { toast.error("Image must be under 5 MB"); return; }
    const r = new FileReader();
    r.onload = () => {
      const id = crypto.randomUUID();
      setLayers((l) => [...l, { id, side, kind: "image", value: r.result as string, x: 50, y: 40, size: 120, color: "" }]);
      setSel(id);
    };
    r.readAsDataURL(f);
  };
  const onMove = (e: PointerEvent) => {
    if (!drag.current || !canvas.current) return;
    const rect = canvas.current.getBoundingClientRect();
    update(drag.current, { x: Math.min(90, Math.max(10, ((e.clientX - rect.left) / rect.width) * 100)), y: Math.min(90, Math.max(10, ((e.clientY - rect.top) / rect.height) * 100)) });
  };

  const renderLayers = (s: Side, interactive: boolean) =>
    layers.filter((l) => l.side === s).map((l) => (
      <div key={l.id}
        onPointerDown={interactive ? (e) => { e.preventDefault(); drag.current = l.id; setSel(l.id); } : undefined}
        style={{ left: `${l.x}%`, top: `${l.y}%`, transform: "translate(-50%,-50%)", color: l.color, fontSize: `calc(${l.size}px * var(--scale,1))` }}
        className={cn("absolute select-none whitespace-nowrap font-display font-black leading-none", interactive && "cursor-move touch-none", interactive && sel === l.id && "outline outline-2 outline-offset-4 outline-accent")}>
        {l.kind === "text" ? l.value : <img src={l.value} alt="Uploaded artwork" draggable={false} style={{ width: l.size }} />}
      </div>
    ));

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-black md:text-4xl">Customization Studio</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[72px_1fr_340px]">
        <div className="flex gap-2 lg:flex-col">
          <ToolBtn icon={Type} label="Text" onClick={addText} />
          <label className="flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-lg border bg-card p-3 text-xs hover:border-primary lg:flex-none">
            <Upload className="h-5 w-5" /> Upload
            <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
          </label>
          <ToolBtn icon={RotateCw} label="360°" onClick={() => setSpin((s) => !s)} active={spin} />
        </div>

        <div className="rounded-xl border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {BASES.map((id) => { const b = getProduct(id)!; return (
                <button key={id} onClick={() => setBaseId(id)} className={cn("rounded-md px-3 py-1.5 text-xs font-medium", baseId === id && "bg-card shadow-card")}>{b.category === "oversized" ? "T-Shirt" : b.category === "hoodies" ? "Hoodie" : b.category === "polos" ? "Polo" : "Jersey"}</button>
              ); })}
            </div>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {(["front", "back"] as Side[]).map((s) => (
                <button key={s} onClick={() => { setSide(s); setSpin(false); }} className={cn("rounded-md px-3 py-1.5 text-xs font-medium capitalize", side === s && !spin && "bg-card shadow-card")}>{s}</button>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-4 aspect-square max-w-[560px] [perspective:1200px]" onPointerMove={onMove} onPointerUp={() => (drag.current = null)} onPointerLeave={() => (drag.current = null)}>
            {spin ? (
              <div className="relative h-full w-full spin-y [transform-style:preserve-3d]">
                {(["front", "back"] as Side[]).map((s) => (
                  <div key={s} className="absolute inset-0 [backface-visibility:hidden] [--scale:1]" style={{ transform: s === "back" ? "rotateY(180deg)" : undefined }}>
                    <img src={base.image} alt="" className={cn("h-full w-full object-contain", s === "back" && "-scale-x-100")} />
                    {renderLayers(s, false)}
                  </div>
                ))}
              </div>
            ) : (
              <div ref={canvas} className="relative h-full w-full" onPointerDown={(e) => e.target === e.currentTarget && setSel(null)}>
                <img src={base.image} alt={`${base.name} ${side}`} draggable={false} className={cn("pointer-events-none h-full w-full object-contain", side === "back" && "-scale-x-100")} />
                <div className="pointer-events-none absolute inset-[28%_30%_18%] rounded border border-dashed border-accent/40" />
                {renderLayers(side, true)}
              </div>
            )}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">{spin ? "Rotating 360° preview — tap 360° to stop" : "Drag elements to position them inside the print area"}</p>
        </div>

        <div className="space-y-6 rounded-xl border bg-card p-5">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between"><p className="font-semibold">Edit {selected.kind}</p>
                <button aria-label="Delete layer" onClick={() => { setLayers((l) => l.filter((x) => x.id !== selected.id)); setSel(null); }}><Trash2 className="h-4 w-4 text-destructive" /></button></div>
              {selected.kind === "text" && <input value={selected.value} maxLength={24} onChange={(e) => update(selected.id, { value: e.target.value })} className="w-full rounded-md border px-3 py-2 text-sm" />}
              <label className="block text-xs text-muted-foreground">Size
                <input type="range" min={selected.kind === "text" ? 14 : 40} max={selected.kind === "text" ? 120 : 260} value={selected.size} onChange={(e) => update(selected.id, { size: +e.target.value })} className="w-full accent-primary" /></label>
              {selected.kind === "text" && <div className="flex gap-2">{INK.map((c) => <button key={c} aria-label={`Ink ${c}`} onClick={() => update(selected.id, { color: c })} style={{ backgroundColor: c }} className={cn("h-7 w-7 rounded-full border", selected.color === c && "ring-2 ring-primary ring-offset-2")} />)}</div>}
            </div>
          ) : (
            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground"><ImageIcon className="mb-2 h-5 w-5" />Add text or upload artwork, then tap it to edit.</div>
          )}
          <div>
            <p className="text-sm font-semibold">Size</p>
            <div className="mt-2 flex gap-2">{SIZES.map((s) => <button key={s} onClick={() => setSize(s)} className={cn("h-9 flex-1 rounded-md border text-xs", size === s && "border-primary bg-primary text-primary-foreground")}>{s}</button>)}</div>
          </div>
          <div className="border-t pt-4">
            <p className="text-3xl font-black">{formatINR(total)}</p>
            <p className="text-xs text-muted-foreground">Base {formatINR(base.price)} + Customization {formatINR(extra)} ({usedSides.join(", ") || "none"})</p>
          </div>
          <Button size="lg" className="w-full" onClick={() => {
            add({ productId: base.id, name: `Custom ${base.name}`, image: base.image, size, color: base.colors[0], price: total, customization: layers.map((l) => `${l.side}: ${l.kind === "text" ? l.value : "artwork"}`).join(" · ") || undefined });
            toast.success("Custom design added to cart");
            navigate({ to: "/cart" });
          }}>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ icon: Icon, label, onClick, active }: { icon: typeof Type; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className={cn("flex flex-1 flex-col items-center gap-1 rounded-lg border bg-card p-3 text-xs hover:border-primary lg:flex-none", active && "border-primary bg-primary text-primary-foreground")}>
      <Icon className="h-5 w-5" /> {label}
    </button>
  );
}
