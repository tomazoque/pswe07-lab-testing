// Suite "generada por IA" para la demo.
import { describe, it, expect } from "vitest";
import { costoEnvio } from "./envio.js";

describe("costoEnvio", () => {
  it("paquete liviano", () => {
    expect(costoEnvio(0.5)).toBeGreaterThan(0);
  });
  it("paquete mediano", () => {
    expect(typeof costoEnvio(3)).toBe("number");
  });
  it("paquete pesado", () => {
    expect(costoEnvio(10)).toBeDefined();
  });
  it("peso inválido", () => {
    expect(() => costoEnvio(0)).toThrow();
  });
});
