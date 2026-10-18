import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import teeBeige from "@/assets/tee-beige.jpg";
import hoodie from "@/assets/hoodie.jpg";
import hoodieGrey from "@/assets/hoodie-grey.jpg";
import polo from "@/assets/polo.jpg";
import jersey from "@/assets/jersey.jpg";

export type Category = "tshirts" | "oversized" | "hoodies" | "polos" | "jerseys";

export const CATEGORIES: { id: Category; label: string; image: string }[] = [
  { id: "tshirts", label: "T-Shirts", image: teeBlack },
  { id: "oversized", label: "Oversized", image: teeBeige },
  { id: "hoodies", label: "Hoodies", image: hoodieGrey },
  { id: "polos", label: "Polos", image: polo },
  { id: "jerseys", label: "Jerseys", image: jersey },
];

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
  fabric: string;
  isNew?: boolean;
  description: string;
}

export const SIZES = ["S", "M", "L", "XL", "XXL"];

export const PRODUCTS: Product[] = [
  { id: "essential-black-tee", name: "Essential Black Tee", category: "tshirts", price: 699, mrp: 999, rating: 4.6, reviews: 412, image: teeBlack, colors: ["#111111", "#f5f5f5", "#8a8a8a"], fabric: "100% Cotton", isNew: true, description: "Premium 100% cotton tee with a relaxed fit. Soft, breathable and made for everyday wear." },
  { id: "clean-white-oversized", name: "Clean White Oversized", category: "oversized", price: 799, mrp: 1199, rating: 4.8, reviews: 726, image: teeWhite, colors: ["#f5f5f5", "#111111"], fabric: "Premium Cotton", isNew: true, description: "Heavyweight drop-shoulder oversized tee. The perfect blank canvas for your design." },
  { id: "beige-oversized", name: "Beige Oversized", category: "oversized", price: 699, mrp: 999, rating: 4.6, reviews: 198, image: teeBeige, colors: ["#d6c4a8", "#f5f5f5"], fabric: "Cotton Blend", description: "Earthy sand tone, boxy silhouette, 240 GSM cotton blend." },
  { id: "shadow-hoodie", name: "Shadow Hoodie", category: "hoodies", price: 1299, mrp: 1799, rating: 4.8, reviews: 341, image: hoodie, colors: ["#111111", "#8a8a8a"], fabric: "Cotton Fleece", description: "Brushed fleece hoodie with a subtle chest emblem and kangaroo pocket." },
  { id: "heather-hoodie", name: "Heather Grey Hoodie", category: "hoodies", price: 1199, mrp: 1599, rating: 4.7, reviews: 156, image: hoodieGrey, colors: ["#9a9a9a", "#111111"], fabric: "Cotton Fleece", description: "Classic heather grey hoodie. Warm, soft and endlessly wearable." },
  { id: "classic-polo", name: "Classic Navy Polo", category: "polos", price: 799, mrp: 1099, rating: 4.6, reviews: 220, image: polo, colors: ["#1e2a4a", "#111111", "#f5f5f5"], fabric: "Cotton Pique", description: "Breathable pique polo with ribbed collar. Great for teams and corporate wear." },
  { id: "volt-jersey", name: "Volt Sports Jersey", category: "jerseys", price: 999, mrp: 1499, rating: 4.9, reviews: 503, image: jersey, colors: ["#111111", "#2457ff"], fabric: "Dry Fit (Jerseys)", isNew: true, description: "Lightweight dry-fit jersey with electric-blue panels. Add your name and number." },
  { id: "minimal-tee", name: "Minimal Tee", category: "tshirts", price: 599, mrp: 899, rating: 4.5, reviews: 98, image: teeWhite, colors: ["#f5f5f5", "#111111"], fabric: "100% Cotton", description: "A clean, minimal everyday tee." },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
