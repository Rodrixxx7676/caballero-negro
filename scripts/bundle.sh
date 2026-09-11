#!/usr/bin/env bash
# Genera deploy/caballero-negro.zip listo para `eb deploy`.
# El build ocurre aquí, no en la instancia EC2: Beanstalk solo recibe la app publicada.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API="$ROOT/src/CaballeroNegro.Api"
OUT="$ROOT/deploy"
PUBLISH="$OUT/publish"

echo "▸ Cliente React"
(cd "$ROOT/client" && npm ci --silent && npm run build --silent)

echo "▸ API .NET (incluye wwwroot con el cliente)"
rm -rf "$OUT"
dotnet publish "$API" -c Release -o "$PUBLISH" --nologo -v q

# Beanstalk (.NET en Linux) arranca lo que diga el Procfile y publica PORT=5000.
printf 'web: dotnet CaballeroNegro.Api.dll\n' > "$PUBLISH/Procfile"

echo "▸ Empaquetando"
(cd "$PUBLISH" && zip -qr "$OUT/caballero-negro.zip" .)
rm -rf "$PUBLISH"

echo "✔ $OUT/caballero-negro.zip ($(du -h "$OUT/caballero-negro.zip" | cut -f1))"
