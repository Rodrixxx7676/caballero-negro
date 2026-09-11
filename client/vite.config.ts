import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo, /api se reenvía a la API .NET (dotnet run → http://localhost:5080).
// En producción, el build se copia a wwwroot de la API y todo sale del mismo origen.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5080',
    },
  },
  build: {
    outDir: '../src/CaballeroNegro.Api/wwwroot',
    emptyOutDir: true,
  },
})
