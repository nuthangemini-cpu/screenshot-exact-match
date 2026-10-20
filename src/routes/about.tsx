import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "About DRIPWEAR — Personalised Streetwear" },
      { name: "description", content: "DRIPWEAR makes premium, customizable streetwear for India." },
      { property: "og:title", content: "About DRIPWEAR" },
      { property: "og:description", content: "Premium, customizable streetwear for India." },
    ],
  }),
  component: () => (
    <div className="container-x max-w-3xl py-16">
      <h1 className="text-5xl font-black">Made yours.</h1>
      <p className="mt-6 text-lg text-muted-foreground">DRIPWEAR is a streetwear label built around one idea: your clothes should tell your story. Premium blanks, bold prints and a studio that puts the design in your hands.</p>
      <h2 className="mt-12 text-2xl font-extrabold">Shipping, returns & policies</h2>
      <p className="mt-3 text-muted-foreground">Shipping rates, returns, support contact details, privacy and terms have not been confirmed. This preview does not accept orders.</p>
      <Button asChild className="mt-10"><Link to="/customize">Design yours</Link></Button>
    </div>
  ),
});
