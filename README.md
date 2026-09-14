# El Caballero Negro — Carta web

Sitio web de **El Caballero Negro**, restaurante de pastas y pizzas en Villa El
Salvador (Lima). Fase 1: la carta digital.

- **Backend:** ASP.NET Core 10 (minimal API). Sirve la carta en `/api/menu` y el
  cliente React compilado desde `wwwroot`.
- **Frontend:** React 19 + Vite + TypeScript. Una sola página, móvil primero,
  con navegación fija por categorías.
- **Infraestructura:** un único entorno de AWS Elastic Beanstalk
  (".NET 10 on AL2023", instancia única).
- **Datos:** la carta vive en [`src/CaballeroNegro.Api/Data/menu.json`](src/CaballeroNegro.Api/Data/menu.json)
  y los datos del local (historia, dirección, horario, redes) en
  [`Data/site.json`](src/CaballeroNegro.Api/Data/site.json). Cambiar un precio o
  el horario es editar el archivo y desplegar; páginas y chatbot leen de ahí.
- **Páginas:** `/` carta · `/nosotros` historia · `/ubicacion` mapa y horario · `/contacto` redes.

## Estructura

```
caballero-negro/
├── src/CaballeroNegro.Api/     API .NET
│   ├── Data/menu.json          la carta
│   ├── Data/site.json          historia, ubicación, horario, redes
│   ├── Models/Menu.cs          contrato (espejo de client/src/types/menu.ts)
│   ├── Services/MenuService.cs lectura de la carta (aquí entraría una BD después)
│   └── Program.cs              endpoints, estáticos y fallback SPA
├── client/                     React + Vite
│   └── src/
│       ├── api/  hooks/  types/
│       ├── pages/              MenuPage, AboutPage, LocationPage, ContactPage
│       └── components/         CardNav (React Bits), Hero, CategoryNav, ChatWidget…
├── scripts/bundle.sh           genera deploy/caballero-negro.zip
├── support/                    logo original
└── .elasticbeanstalk/config.yml
```

## API

| Método | Ruta                 | Respuesta                                  |
|--------|----------------------|--------------------------------------------|
| GET    | `/api/health`        | `{ "status": "ok" }`                       |
| GET    | `/api/menu`          | Carta completa (restaurante + categorías)  |
| GET    | `/api/menu/{id}`     | Una categoría (`pizzas`, `entrantes`…) o 404 |
| GET    | `/api/site`          | Datos del local: historia, ubicación, horario, contacto |
| GET    | `/api/chat/status`   | `{ "available": true|false }` según haya clave de OpenAI |
| POST   | `/api/chat`          | `{ "messages": [{ "role": "user", "content": "…" }] }` → `{ "reply": "…" }` |

Toda categoría trae `items`; las bebidas además traen `groups`; las pizzas
traen `sizes` y cada ítem `prices` por tamaño en vez de `price`.

## Chatbot (OpenAI)

Asistente de la carta en la esquina inferior derecha. Modelo económico
(`gpt-4.1-mini` por defecto, cambiable en `appsettings.json` → `OpenAI:Model`).
La carta completa va como contexto del sistema, así responde con precios reales.
Límite: 10 mensajes por minuto por IP (`/api/chat` devuelve 429 al pasarse).

**La clave nunca se escribe en el repo.** Sin clave, el botón del chat no aparece.

```bash
# Local (una sola vez; queda fuera del repo, en ~/.microsoft/usersecrets)
dotnet user-secrets set "OpenAI:ApiKey" "sk-..." --project src/CaballeroNegro.Api
```

En Beanstalk: Configuración → Actualizaciones, supervisión y registro →
Propiedades del entorno → `OpenAI__ApiKey` = `sk-...` (dos guiones bajos).

## Desarrollo local

Requisitos: .NET SDK 10, Node 24.

```bash
# Terminal 1 — API en http://localhost:5080
dotnet run --project src/CaballeroNegro.Api --urls http://localhost:5080
```

```bash
# Terminal 2 — cliente con recarga en caliente en http://localhost:5173 (proxy /api → 5080)
cd client && npm install && npm run dev
```

Para probar exactamente lo que verá producción (un solo origen):

```bash
cd client && npm run build && cd .. && dotnet run --project src/CaballeroNegro.Api --urls http://localhost:5080
```

## Despliegue en AWS Elastic Beanstalk

El build se hace en tu máquina; Beanstalk recibe solo la app publicada.

### Primera vez

```bash
pip install awsebcli --upgrade --user
eb init -p ".NET 10 on AL2023" caballero-negro --region us-east-1
eb create caballero-negro-prod --instance-types t3.micro --single
```

`--single` crea el entorno sin balanceador de carga (la opción más barata).

### Cada despliegue

```bash
./scripts/bundle.sh && eb deploy
```

`.elasticbeanstalk/config.yml` apunta `deploy.artifact` a
`deploy/caballero-negro.zip`; sin eso `eb deploy` subiría el código fuente.

La app lee la variable `PORT` que inyecta Beanstalk (5000) y nginx la expone en
el 80. Única variable opcional: `OpenAI__ApiKey` (activa el chatbot).

## Pendientes / siguientes fases

- Logo en alta resolución o vectorial (el original es de 448 px).
- Postres: la carta impresa no lista productos.
- Fotos de platos y del local (historia).
- Confirmar con el restaurante horario (12:00–23:00 vs 22:30 según fuentes) y teléfonos.
- Panel de administración con base de datos para editar la carta sin desplegar.
