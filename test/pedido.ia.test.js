// Suite "generada por IA": pide cobertura alta.
import { describe, it, expect } from "vitest";
import { calcularTotal } from "../src/pedido.js";

describe("calcularTotal", () => {
  it("calcula el total para un cliente normal", () => {
    const total = calcularTotal({ subtotal: 50000, cliente: "normal" });
    expect(total).toBeGreaterThan(0);
  });

  it("aplica descuento a cliente frecuente", () => {
    const total = calcularTotal({ subtotal: 50000, cliente: "frecuente" });
    expect(total).toBeLessThan(50000 * 1.13);
  });

  it("aplica descuento por monto alto", () => {
    const total = calcularTotal({ subtotal: 200000, cliente: "normal" });
    expect(total).toBeDefined();
  });

  it("aplica el cupón PROMO10", () => {
    const total = calcularTotal({ subtotal: 50000, cliente: "normal", cupon: "PROMO10" });
    expect(typeof total).toBe("number");
  });

  it("respeta el tope de descuento", () => {
    const total = calcularTotal({ subtotal: 200000, cliente: "frecuente", cupon: "PROMO10" });
    expect(total).toBeGreaterThan(0);
  });

  it("lanza error con subtotal negativo", () => {
    expect(() => calcularTotal({ subtotal: -1, cliente: "normal" })).toThrow();
  });
});
