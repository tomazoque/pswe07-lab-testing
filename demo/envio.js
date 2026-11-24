//  Tarifa de envío por peso:
//  - Hasta 1 kg: ₡2000 - LIVIANO.
//  - De 1 a 5 kg: ₡2000 + ₡500 por cada kg adicional (o fracción) - MEDIANO.
//  - Más de 5 kg: ₡4000 + ₡800 por cada kg adicional (o fracción) sobre 5 - PESADO.
//  - Peso <= 0 es inválido.
// Tarifas en colones y límites en kilogramos.

const TARIFA_BASE = 2000;
const LIMITE_BASE_KG = 1;
const LIMITE_MEDIO_KG = 5;
const ADICIONAL_MEDIO = 500; // por kg adicional entre LIMITE_BASE_KG y LIMITE_MEDIO_KG
const ADICIONAL_PESADO = 800; // por kg adicional sobre LIMITE_MEDIO_KG

// Costo al llegar al límite medio; se deriva para que la tarifa sea continua.
const TARIFA_EN_LIMITE_MEDIO =
  TARIFA_BASE + (LIMITE_MEDIO_KG - LIMITE_BASE_KG) * ADICIONAL_MEDIO;

export function costoEnvio(pesoKg) {
  if (!Number.isFinite(pesoKg) || pesoKg <= 0) {
    throw new RangeError("peso inválido");
  }
  if (pesoKg <= LIMITE_BASE_KG) return TARIFA_BASE;
  if (pesoKg <= LIMITE_MEDIO_KG) {
    return TARIFA_BASE + Math.ceil(pesoKg - LIMITE_BASE_KG) * ADICIONAL_MEDIO;
  }
  return TARIFA_EN_LIMITE_MEDIO + Math.ceil(pesoKg - LIMITE_MEDIO_KG) * ADICIONAL_PESADO;
}

