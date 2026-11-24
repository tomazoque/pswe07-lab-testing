# Parte 2: solución del laboratorio

Validación realizada el 23 de noviembre de 2026 sobre `src/pedido.js`, sin modificar su implementación ni la suite de IA.

## Preparación comprobada

Entorno: Windows, Node **v24.22.1** y npm **11.19.1**. Se ejecutaron correctamente:

```bash
npm install
npm test
npm run coverage
npm run mutation
```

La instalación agregó 220 paquetes. `npm install` sincronizó el nombre del paquete raíz en `package-lock.json` con `package.json` (`lab-testing`); no cambió versiones de dependencias.

## Fase A. Diagnóstico

Antes de completar la plantilla, pasaron las **6 pruebas de IA** y quedaron **10 pruebas pendientes** (`todo`). La cobertura inicial fue:

| Métrica | Resultado |
|---|---:|
| Sentencias | 100 % (21/21) |
| Ramas | 100 % (10/10) |
| Funciones | 100 % (1/1) |
| Líneas | 100 % (17/17) |

Stryker generó **30 mutantes**: las pruebas detectaron **11** y sobrevivieron **19**. No hubo timeouts, errores ni mutantes sin cobertura. El mutation score inicial fue **36,67 %**.

La cobertura confirma que se ejecutó el código. Aserciones como `toBeDefined()` o `typeof total === "number"` permiten que resultados numéricos incorrectos pasen.

Tres sobrevivientes del reporte inicial:

| ID | Cambio insertado | Error real que representa |
|---|---|---|
| 5 | `subtotal < 0` → `subtotal <= 0` | Un pedido con subtotal cero se rechazaría aunque sea válido. |
| 16 | `subtotal >= MONTO_PARA_DESCUENTO` → `subtotal > MONTO_PARA_DESCUENTO` | Un pedido de exactamente ₡100 000 perdería el descuento por monto alto. |
| 24 | Condición del tope de descuento → `false` | Se permitiría acumular 25 % de descuento aunque el máximo sea 20 %. |

Evidencia inicial: [reporte HTML](reports/parte-2/fase-a.html) y [datos JSON](reports/parte-2/fase-a.json).

## Fase B. Ejemplos exactos

Se completó la Parte B de [test/estudiante.test.js](test/estudiante.test.js) con resultados constantes calculados a mano:

| Caso | Cálculo manual | Total esperado |
|---|---|---:|
| Normal, subtotal ₡50 000, sin cupón | Sin descuento; IVA ₡6 500 | ₡56 500 |
| Normal, subtotal ₡100 000, sin cupón | 10 %: resta ₡10 000; base ₡90 000; IVA ₡11 700 | ₡101 700 |
| Frecuente, subtotal ₡50 000, sin cupón | 5 %: resta ₡2 500; base ₡47 500; IVA ₡6 175 | ₡53 675 |
| Normal, subtotal ₡50 000, PROMO10 | 10 %: resta ₡5 000; base ₡45 000; IVA ₡5 850 | ₡50 850 |
| Frecuente, subtotal ₡200 000, PROMO10 | 5 % + 10 % + 10 % = 25 %; se limita a 20 %; base ₡160 000; IVA ₡20 800 | ₡180 800 |

Pasaron **11 pruebas** (6 de IA y 5 ejemplos). Se detectaron **27 de 30 mutantes**: **90,00 %**, por encima de la meta de 85 %. Sobrevivieron los IDs 5, 9 y 25.

Evidencia: [reporte HTML](reports/parte-2/fase-b.html) y [datos JSON](reports/parte-2/fase-b.json).

## Fase C. Propiedades

Se agregaron cinco propiedades con fast-check. Cada una ejecuta **300 casos generados**, además de los ejemplos obligatorios, con semilla **20261123** para reproducir los resultados.

El generador general combina enteros entre **0 y 5 000 000** con los valores **0, 1, 99 999, 100 000 y 100 001**. Se usan `examples` para garantizar la ejecución de los bordes relevantes; incluirlos en un generador aleatorio por sí solo no garantiza visitarlos en una corrida.

1. **Cota superior y validez:** el total debe ser entero, no negativo y no superar el subtotal más IVA, con tolerancia de medio colón por redondeo. El ejemplo de subtotal cero detecta el mutante 5: ese pedido debe producir cero, sin lanzar una excepción.
2. **Cota inferior por el tope:** con un descuento máximo de 20 % y el IVA, el total debe ser al menos el 90,4 % del subtotal, menos medio colón por redondeo. Un total inferior viola el máximo de descuento permitido.
3. **Relación del cupón:** agregar PROMO10 nunca debe aumentar el total del mismo pedido.
4. **Relación estricta del cliente frecuente:** sin cupón y con subtotal entero desde **₡20**, el frecuente debe pagar estrictamente menos que el normal. Es un rango suficiente: la ventaja previa al redondeo es de al menos ₡1,13 y no se alcanza el tope. Para subtotales de cero o un colón pueden empatar por redondeo; con PROMO10 y monto alto ambos alcanzan el tope de 20 % y también empatan.
5. **Entradas negativas:** todo subtotal entero generado entre −5 000 000 y −1 debe lanzar específicamente `RangeError`, para ambos tipos de cliente y los cupones considerados.

Las cotas y relaciones comparan comportamientos sin reimplementar todas las ramas de descuentos. No se exige monotonía global respecto al subtotal: al cruzar ₡100 000 se activa un descuento nuevo y el total puede bajar.

Se ejecutó mutation testing después de incorporar cada propiedad, manteniendo los ejemplos de la Parte B:

| Propiedades incorporadas, en orden | Detectados | Sobrevivientes | Mutation score |
|---|---:|---:|---:|
| Ninguna: fin de la Parte B | 27/30 | 3 | 90,00 % |
| 1. Cota superior y validez | 28/30 | 2 | 93,33 % |
| 2. Cota inferior | 28/30 | 2 | 93,33 % |
| 3. Cupón | 28/30 | 2 | 93,33 % |
| 4. Comparación estricta | 28/30 | 2 | 93,33 % |
| 5. RangeError | 28/30 | 2 | 93,33 % |

La primera propiedad aporta una detección nueva; las demás verifican reglas generales sin aumentar adicionalmente el score de esta suite combinada. Se supera la meta de 93 %.

Las cinco mediciones quedan en `reports/parte-2/fase-c-1` hasta `fase-c-5`, cada una con archivos `.html`, `.json` y `.log`.

## Fase D. Revisión en clase

- **Resultado final:** 93,33 %; 28 mutantes detectados y 2 sobrevivientes, sin timeouts, errores ni mutantes sin cobertura. Pasan las **16 pruebas**, sin pendientes, y se conserva el **100 % de cobertura** en las cuatro métricas.
- **Mutante 9, mensaje vacío de RangeError:** cambia `"subtotal negativo"` por `""`. Sigue lanzando el tipo de excepción exigido. El mensaje exacto no está especificado por las reglas del ejercicio; es un cambio observable, pero no una violación del contrato que estamos probando. No se agrega una aserción del texto solo para elevar el score.
- **Mutante 25, `>` por `>=` en el tope:** es equivalente para estas reglas. Si el descuento ya es 20 %, asignarle otra vez 20 % deja el resultado igual; fuera de la igualdad, ambas versiones se comportan igual. Ninguna prueba del resultado puede distinguirlo.
- **Propiedad más valiosa para el score observado:** la cota superior y validez con el ejemplo obligatorio de subtotal cero. Eliminó el error de rechazar cero y elevó el score de 90,00 % a 93,33 %. La comparación estricta también es útil para evitar que una propiedad débil permita eliminar el beneficio del cliente frecuente.

El score se informa tal como lo calcula Stryker, incluyendo los dos sobrevivientes.

## Volver a ejecutar la solución

Desde la raíz del repositorio:

```bash
npm test
npm run coverage
npm run mutation
```

El reporte final se abre en Windows con:

```bat
start reports\mutation\mutation.html
```

Para generar también datos JSON:

```bash
npm run mutation -- --reporters clear-text,html,json
```

La evidencia HTML y JSON queda en `reports/`, carpeta ignorada por Git. Este documento conserva los resultados de las fases A a D aunque esos archivos locales no se publiquen.
