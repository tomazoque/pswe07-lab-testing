// Parte 2 del laboratorio. Ver SOLUCION_PARTE_2.md para los resultados.
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { calcularTotal } from "../src/pedido.js";

// ---------- Parte B: ejemplos con valores exactos ----------
// Los resultados son constantes calculadas a mano, sin copiar la implementación.
describe("Parte B: ejemplos exactos", () => {
  it("sin descuentos: 50000 más 6500 de IVA son 56500", () => {
    expect(calcularTotal({ subtotal: 50000, cliente: "normal" })).toBe(56500);
  });

  it("justo en 100000: descuento de 10000 e IVA de 11700", () => {
    expect(calcularTotal({ subtotal: 100000, cliente: "normal" })).toBe(101700);
  });

  it("cliente frecuente: base de 47500 e IVA de 6175", () => {
    expect(calcularTotal({ subtotal: 50000, cliente: "frecuente" })).toBe(53675);
  });

  it("PROMO10: base de 45000 e IVA de 5850", () => {
    expect(calcularTotal({ subtotal: 50000, cliente: "normal", cupon: "PROMO10" })).toBe(50850);
  });

  it("limita la suma de 25 % al 20 %: base de 160000 e IVA de 20800", () => {
    expect(calcularTotal({ subtotal: 200000, cliente: "frecuente", cupon: "PROMO10" })).toBe(180800);
  });
});

// ---------- Parte C: propiedades (fast-check) ----------
// Se exploran colones enteros en un rango acotado. `examples` garantiza que
// se ejecuten los bordes incluso si el generador aleatorio no los selecciona.
const subtotalArb = fc.oneof(
  fc.constantFrom(0, 1, 99999, 100000, 100001),
  fc.integer({ min: 0, max: 5_000_000 }),
);
const clienteArb = fc.constantFrom("normal", "frecuente");
const cuponArb = fc.constantFrom(undefined, "PROMO10", "INVALIDO", "");
const opciones = { numRuns: 300, seed: 20261123 };

describe("Parte C: propiedades", () => {
  it("el total es un entero no negativo y no supera el precio sin descuento", () => {
    fc.assert(
      fc.property(subtotalArb, clienteArb, cuponArb, (subtotal, cliente, cupon) => {
        const total = calcularTotal({ subtotal, cliente, cupon });
        expect(Number.isInteger(total)).toBe(true);
        expect(total).toBeGreaterThanOrEqual(0);
        // Cota con tolerancia de medio colón por el redondeo.
        expect(total).toBeLessThanOrEqual((subtotal * 113) / 100 + 0.5);
      }),
      { ...opciones, examples: [[0, "normal", undefined], [99999, "normal", undefined], [100000, "normal", undefined], [100001, "frecuente", "PROMO10"]] },
    );
  });

  it("el descuento máximo es 20 %, con tolerancia de medio colón", () => {
    fc.assert(
      fc.property(subtotalArb, clienteArb, cuponArb, (subtotal, cliente, cupon) => {
        const total = calcularTotal({ subtotal, cliente, cupon });
        // Tras el descuento máximo y el IVA queda al menos el 90,4 %.
        expect(total).toBeGreaterThanOrEqual((subtotal * 904) / 1000 - 0.5);
      }),
      { ...opciones, examples: [[100000, "frecuente", "PROMO10"], [100001, "frecuente", "PROMO10"]] },
    );
  });

  it("agregar PROMO10 nunca aumenta el total", () => {
    fc.assert(
      fc.property(subtotalArb, clienteArb, (subtotal, cliente) => {
        expect(calcularTotal({ subtotal, cliente, cupon: "PROMO10" }))
          .toBeLessThanOrEqual(calcularTotal({ subtotal, cliente }));
      }),
      { ...opciones, examples: [[0, "normal"], [99999, "frecuente"], [100000, "normal"], [100001, "frecuente"]] },
    );
  });

  it("sin cupón, el frecuente paga ESTRICTAMENTE menos desde 20 colones", () => {
    // Sin cupón no se alcanza el tope; 20 garantiza una diferencia de al
    // menos 1,13 colones antes de redondear. En 0 o 1 ambos pueden pagar igual.
    const subtotalEstrictoArb = fc.oneof(
      fc.constantFrom(20, 99999, 100000, 100001),
      fc.integer({ min: 20, max: 5_000_000 }),
    );
    fc.assert(
      fc.property(subtotalEstrictoArb, (subtotal) => {
        expect(calcularTotal({ subtotal, cliente: "frecuente" }))
          .toBeLessThan(calcularTotal({ subtotal, cliente: "normal" }));
      }),
      { ...opciones, examples: [[20], [99999], [100000], [100001]] },
    );
  });

  it("un subtotal negativo siempre lanza RangeError", () => {
    fc.assert(
      fc.property(fc.integer({ min: -5_000_000, max: -1 }), clienteArb, cuponArb, (subtotal, cliente, cupon) => {
        expect(() => calcularTotal({ subtotal, cliente, cupon })).toThrow(RangeError);
      }),
      { ...opciones, examples: [[-1, "normal", undefined]] },
    );
  });
});
