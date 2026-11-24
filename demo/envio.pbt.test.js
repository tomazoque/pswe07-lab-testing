// Demo: propiedades con fast-check.
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { costoEnvio } from "./envio.js";

const pesoArb = fc.double({ min: 0.01, max: 100, noNaN: true });

describe("costoEnvio (propiedades)", () => {
  it("nunca cuesta menos que la tarifa mínima", () => {
    fc.assert(
      fc.property(pesoArb, (p) => {
        expect(costoEnvio(p)).toBeGreaterThanOrEqual(2000);
      })
    );
  });

  it("es monótona: más peso nunca cuesta menos", () => {
    fc.assert(
      fc.property(pesoArb, pesoArb, (a, b) => {
        const [menor, mayor] = a <= b ? [a, b] : [b, a];
        expect(costoEnvio(menor)).toBeLessThanOrEqual(costoEnvio(mayor));
      })
    );
  });

  it("hasta 1 kg cuesta exactamente la tarifa base", () => {
    fc.assert(
      fc.property(fc.double({ min: 0.01, max: 1, noNaN: true }), (p) => {
        expect(costoEnvio(p)).toBe(2000);
      })
    );
  });

  it("entre 1 y 5 kg cada kg adicional suma 500", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 4 }), (k) => {
        expect(costoEnvio(k + 1)).toBe(costoEnvio(k) + 500);
      })
    );
  });

  it("sobre 5 kg cada kg adicional suma 800", () => {
    fc.assert(
      fc.property(fc.integer({ min: 5, max: 99 }), (k) => {
        expect(costoEnvio(k + 1)).toBe(costoEnvio(k) + 800);
      }),
      // El borde de 5 kg es el único valor que distingue ciertos mutantes.
      { examples: [[5]] }
    );
  });

  it("peso <= 0 siempre lanza error", () => {
    fc.assert(
      fc.property(fc.double({ max: 0, noNaN: true }), (p) => {
        expect(() => costoEnvio(p)).toThrow(RangeError);
      }),
      // El azar no garantiza generar exactamente 0, que es el límite que
      // importa. Los casos conocidos se fijan con `examples`.
      { examples: [[0]] }
    );
  });

  it("peso no finito (NaN, Infinity, -Infinity) siempre lanza error", () => {
    fc.assert(
      fc.property(fc.constantFrom(NaN, Infinity, -Infinity), (p) => {
        expect(() => costoEnvio(p)).toThrow(RangeError);
      })
    );
  });

});
