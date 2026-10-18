import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, LayoutDashboard, Package, Palette, ShoppingCart, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — DRIPWEAR" },
      { name: "description", content: "DRIPWEAR store overview." },
      { property: "og:title", content: "Admin — DRIPWEAR" },
      { property: "og:description", content: "DRIPWEAR store overview." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const SALES = [8, 12, 10, 15, 13, 18, 16, 22, 19, 24, 21, 26].map((v, i) => ({ d: `Oct ${i * 2 + 1}`, v: v * 1000 }));
const ORDERS = [
  ["#DW20260185", "Nuthan N V", "Custom Jersey", 2648, "Processing"],
  ["#DW20260184", "Rohan S", "Hoodie", 1299, "Delivered"],
  ["#DW20260183", "Priya M", "T-Shirt", 799, "Delivered"],
] as const;

function Admin() {
  const nav = [[LayoutDashboard, "Dashboard"], [Package, "Products"], [ShoppingCart, "Orders"], [Users, "Customers"], [Palette, "Custom designs"], [BarChart3, "Analytics"]] as const;
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 shrink-0 bg-sidebar p-5 text-sidebar-foreground md:block">
        <Link to="/" className="font-display text-xl font-black text-sidebar-accent-foreground">DRIPWEAR</Link>
        <nav className="mt-8 space-y-1 text-sm">
          {nav.map(([I, l], i) => <div key={l} className={`flex items-center gap-3 rounded-md px-3 py-2 ${i === 0 ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"}`}><I className="h-4 w-4" />{l}</div>)}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between"><h1 className="text-3xl font-black">Dashboard</h1><Link to="/" className="text-sm underline">View store</Link></div>
        <p className="mt-1 text-xs text-muted-foreground">Sample data — connects to real orders once a backend is enabled.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[["Total orders", "125"], ["Revenue", formatINR(124850)], ["Customers", "342"], ["Pending", "18"]].map(([l, v]) => (
            <div key={l} className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">{l}</p><p className="mt-2 text-2xl font-black">{v}</p></div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border bg-card p-5">
          <p className="font-semibold">Sales overview</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer><AreaChart data={SALES}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="d" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Area dataKey="v" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.12} /></AreaChart></ResponsiveContainer>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card p-5">
          <p className="font-semibold">Recent orders</p>
          <table className="mt-4 w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground"><tr><th className="pb-2">Order</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>{ORDERS.map(([id, c, p, a, s]) => <tr key={id} className="border-t"><td className="py-3">{id}</td><td>{c}</td><td>{p}</td><td>{formatINR(a)}</td><td><span className={`rounded-full px-2 py-0.5 text-xs ${s === "Delivered" ? "bg-success/15 text-success" : "bg-warning/20"}`}>{s}</span></td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
