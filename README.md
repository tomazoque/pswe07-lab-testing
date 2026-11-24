# Laboratorio: Cobertura, mutación, PBT

Una IA generó pruebas con 100 % de cobertura. ¿Detectan errores de verdad? 

- **Mutation testing** (Stryker): inserta errores a propósito en el código y comprueba si las pruebas los detectan.
- **Property-based testing** (fast-check): en vez de ejemplos fijos, verifica reglas que deben cumplirse para cualquier entrada.

Stack: Node 22.12 o superior (LTS 22 o 24), Vitest, Stryker y fast-check.

## Preparación (antes de la sesión)

Compruebe su versión de Node:

```bash
node -v
```

Instale y verifique que todo funcione:

```bash
npm install
npm test               
npm run coverage       
npm run mutation       
```

Stryker tarda unos 10 segundos. El reporte HTML queda en `reports/mutation/mutation.html`. Para abrirlo en el navegador:

- Windows: `start reports\mutation\mutation.html`
- Mac: `open reports/mutation/mutation.html`

## Estructura

| Archivo o carpeta | Contenido |
|---|---|
| `src/pedido.js` | Módulo del ejercicio (`calcularTotal`) |
| `test/pedido.ia.test.js` | Suite "generada por IA" (100 % de cobertura, casi no verifica nada) |
| `test/estudiante.test.js` | Plantilla que usted completa |
| `demo/` | Guía de la profesora, con otra función: `costoEnvio` |

---

# Parte 1: Demostración (Explicación de la profesora)

Ejemplo corto con la función `costoEnvio` de `demo/envio.js`. 

**Paso 1. El problema de la cobertura**

```bash
npm run demo:coverage
```

Resultado: 100 % de cobertura. Parece que las pruebas son buenas.

**Paso 2. Mutation testing**

```bash
npm run demo:mutation:ia
```

Resultado: mutation score. Las mismas pruebas dejan sobrevivir la mayoría de los errores insertados.

**Paso 3. Propiedades**

```bash
npm run demo:test:pbt
npm run demo:mutation:pbt
```

Resultado: mutation score. Sobre el mismo código, pruebas que sí verifican.

---

# Parte 2: Ejercicio para el laboratorio (trabajo en grupo)

## Contexto

`src/pedido.js` calcula el total de un pedido en colones. Reglas:

- Cliente `"frecuente"`: 5 % de descuento.
- Subtotal de 100000 o más: 10 % de descuento.
- Cupón `"PROMO10"`: 10 % de descuento.
- Los descuentos se acumulan, con un máximo de 20 %.
- Se aplica IVA de 13 % y se redondea al colón.
- Subtotal negativo: `RangeError`.

Una IA generó `test/pedido.ia.test.js`. Las pruebas pasan con 100 % de cobertura.

## Fase A. Diagnóstico (10 min)

1. Ejecuten `npm run coverage` y anoten el resultado.
2. Ejecuten `npm run mutation` y anoten el mutation score. Es el porcentaje de mutantes (errores insertados a propósito) que sus pruebas detectan.
3. Abran `reports/mutation/mutation.html`. Elijan 3 mutantes sobrevivientes y expliquen en una frase qué error real representaría cada uno.

## Fase B. Matar mutantes con ejemplos (15 min)

En `test/estudiante.test.js` (Parte B) escriban pruebas con **valores exactos calculados a mano**. No usen la fórmula del código, porque eso repetiría la implementación.

Meta: llegar a 85 % o más.

## Fase C. Propiedades (20 min)

En la Parte C escriban propiedades con fast-check. Requisitos:

- Al menos una propiedad de **cota** (por ejemplo, "nunca supera el precio sin descuento").
- Al menos una propiedad **estricta** (por ejemplo, "el cliente frecuente paga *estrictamente* menos").
- Un generador que incluya valores **alrededor del umbral de 100000**.

Meta: superar 93 %. Vuelvan a ejecutar `npm run mutation` después de cada propiedad.

## Fase D. Revisión en clase (10 min)

Cada equipo reporta:

- Mutation score final.
- Qué mutantes quedaron y por qué.
- Cuál propiedad fue la más valiosa.
