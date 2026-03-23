# Apify Lead Pipeline

Pipeline automatizado para extraer leads de Google Maps, filtrar negocios sin sitio web, normalizar teléfonos y exportar un Excel listo para outreach por WhatsApp.

## Setup

```bash
npm install
```

## Configuración

1. Crear cuenta gratuita en [apify.com](https://apify.com) ($5 USD de crédito gratis/mes)
2. Obtener tu API token en Settings > Integrations
3. Exportar la variable de entorno:

```bash
export APIFY_TOKEN="apify_api_XXXXX"
```

## Uso

### Pipeline completo (scrape + filter + export)

```bash
npm run pipeline
```

### Personalizar búsquedas

Editar `src/config.ts`:

- `SEARCH_TARGETS`: categorías y ubicaciones a scrapear
- `MESSAGE_TEMPLATE`: plantilla del mensaje de WhatsApp
- `COUNTRY_CODES`: códigos de país para normalización

## Output

El pipeline genera un archivo Excel en `./output/` con las columnas:

| Columna | Descripción |
|---------|-------------|
| Negocio | Nombre del negocio |
| Teléfono Normalizado | Formato internacional (+54911...) |
| Link WhatsApp | Link directo wa.me con mensaje pre-cargado |
| Google Maps | URL al listing |
| Estado | Para trackear tu outreach (Pendiente/Enviado/Respondió) |

## Costos estimados

- Free tier Apify: $5 USD/mes en compute units
- ~500 resultados por búsqueda = suficiente para validar
- Actor Google Maps Scraper: ~$1.50 por 1000 resultados

## Agregar nuevas zonas

Agregar entries a `SEARCH_TARGETS` en `config.ts`:

```typescript
{ category: "Dentista", locations: ["Córdoba, Argentina"] },
{ category: "Inmobiliaria", locations: ["Rosario, Argentina"] },
{ category: "Clínica dental", locations: ["Madrid, España"] },
```

## Agregar nuevos rubros

El pipeline no está limitado a dental. Cambiá las categorías:

```typescript
{ category: "Inmobiliaria", locations: ["Buenos Aires, Argentina"] },
{ category: "Peluquería", locations: ["Montevideo, Uruguay"] },
{ category: "Veterinaria", locations: ["Santiago, Chile"] },
```
