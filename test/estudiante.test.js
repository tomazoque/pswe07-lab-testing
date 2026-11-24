// PLANTILLA DEL ESTUDIANTE. Complete las Partes B y C.
// Use `npm run mutation` para medir su avance.
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { calcularTotal } from "../src/pedido.js";

// ---------- Parte B: ejemplos con valores exactos ----------
describe("Parte B: ejemplos exactos", () => {
  it.todo("sin descuentos: subtotal 50000 -> total exacto");
  it.todo("justo en el umbral de 100000");
  it.todo("cliente frecuente: total exacto");
  it.todo("cupón PROMO10: total exacto");
  it.todo("descuentos acumulados que activan el tope de 20%");
});

// ---------- Parte C: propiedades (fast-check) ----------
// Pista de generadores:
//   const subtotalArb = fc.oneof(
//     fc.constantFrom(0, 99999, 100000, 100001),
//     fc.integer({ min: 0, max: 5_000_000 })
//   );
describe("Parte C: propiedades", () => {
  it.todo("el total nunca es negativo ni supera subtotal + IVA");
  it.todo("el descuento máximo es 20%");
  it.todo("el cupón nunca aumenta el total");
  it.todo("el cliente frecuente paga ESTRICTAMENTE menos que el normal (¿en qué rango?)");
  it.todo("un subtotal negativo siempre lanza RangeError");
});
