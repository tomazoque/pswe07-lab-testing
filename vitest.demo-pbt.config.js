import { defineConfig } from "vitest/config";
export default defineConfig({ test: { include: ["demo/envio.pbt.test.js"], coverage: { provider: "v8", include: ["demo/envio.js"], reporter: ["text"] } } });
