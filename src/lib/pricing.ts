// Placeholder pricing rules — edit when real rates are confirmed.
export const PRINT_AREA_PRICE: Record<string, number> = {
  front: 150,
  back: 150,
  sleeve: 75,
};
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 79;

export function customizationCost(areas: string[]): number {
  return areas.reduce((sum, a) => sum + (PRINT_AREA_PRICE[a] ?? 0), 0);
}

export function shippingFor(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}
