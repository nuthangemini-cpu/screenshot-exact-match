import { describe, expect, it } from "vitest";
import { customizationCost, shippingFor } from "./pricing";

describe("pricing", () => {
  it("charges per print area", () => {
    expect(customizationCost(["front", "back"])).toBe(300);
    expect(customizationCost(["front", "sleeve"])).toBe(225);
  });
  it("ships free at or above ₹999", () => {
    expect(shippingFor(999)).toBe(0);
    expect(shippingFor(998)).toBe(79);
  });
});
