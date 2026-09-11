# El Caballero Negro — Carta web

Sitio web de **El Caballero Negro**, restaurante de pastas y pizzas en Villa El
Salvador (Lima). Fase 1: la carta digital.

- **Backend:** ASP.NET Core 10 (minimal API). Sirve la carta en `/api/menu` y el
  cliente React compilado desde `wwwroot`.
- **Frontend:** React 19 + Vite + TypeScript. Una sola página, móvil primero,
  con navegación fija por categorías.
- **Infraestructura:** un único entorno de AWS Elastic Beanstalk
  (".NET 10 on AL2023", instancia única).
- **Datos:** la carta vive en [`src/CaballeroNegro.Api/Data/menu.json`](src/CaballeroNegro.Api/Data/menu.json),
  transcrita de la carta impresa. Cambiar un precio es editar ese archivo y desplegar.

## Estructura

```
caballero-negro/
├── src/CaballeroNegro.Api/     API .NET
│   ├── Data/menu.json          la carta
│   ├── Models/Menu.cs          contrato (espejo de client/src/types/menu.ts)
│   ├── Services/MenuService.cs lectura de la carta (aquí entraría una BD después)
│   └── Program.cs              endpoints, estáticos y fallback SPA
├── client/                     React + Vite
│   └── src/
│       ├── api/  hooks/  types/
│       └── components/         Hero, CategoryNav, CategorySection, MenuItemRow…
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

Toda categoría trae `items`; las bebidas además traen `groups`; las pizzas
traen `sizes` y cada ítem `prices` por tamaño en vez de `price`.

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
el 80. No hay variables de entorno obligatorias.

## Pendientes / siguientes fases

- Logo en alta resolución o vectorial (el original es de 448 px).
- Postres: la carta impresa no lista productos.
- Fotos de platos, dirección, horario, teléfono/WhatsApp y redes.
- Panel de administración con base de datos para editar la carta sin desplegar.
