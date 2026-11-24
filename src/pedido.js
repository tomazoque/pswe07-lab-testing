// Reglas de negocio (tienda en línea, montos en colones enteros):
//  - Cliente "frecuente": 5% de descuento.
//  - Subtotal de 100000 o más: 10% de descuento.
//  - Cupón "PROMO10": 10% de descuento.
//  - Los descuentos se acumulan, pero el máximo es 20%.
//  - Al resultado se le aplica IVA de 13% y se redondea al colón.
//  - Un subtotal negativo es inválido.
const IVA = 0.13;
const DESCUENTO_CLIENTE_FRECUENTE = 0.05;
const DESCUENTO_MONTO_ALTO = 0.1;
const DESCUENTO_CUPON = 0.1;
const DESCUENTO_MAXIMO = 0.2;
const MONTO_PARA_DESCUENTO = 100000;
const CLIENTE_FRECUENTE = "frecuente";
const CUPON_PROMO = "PROMO10";

export function calcularTotal({ subtotal, cliente, cupon }) {
  if (subtotal < 0) {
    throw new RangeError("subtotal negativo");
  }

  let descuento = 0;
  if (cliente === CLIENTE_FRECUENTE) descuento += DESCUENTO_CLIENTE_FRECUENTE;
  if (subtotal >= MONTO_PARA_DESCUENTO) descuento += DESCUENTO_MONTO_ALTO;
  if (cupon === CUPON_PROMO) descuento += DESCUENTO_CUPON;
  if (descuento > DESCUENTO_MAXIMO) descuento = DESCUENTO_MAXIMO;

  const base = subtotal * (1 - descuento);
  return Math.round(base * (1 + IVA));
}
