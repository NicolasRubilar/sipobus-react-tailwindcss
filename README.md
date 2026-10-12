# SipoBus · Frontend

Rediseño del proyecto SipoBus con **React + Vite + Tailwind CSS v4**.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
```

## Estructura

```
src/
  components/   Navbar, Footer, HeroDestinos (carrusel), BuscadorViaje, GestionPasaje, ui.jsx…
  context/      AuthContext: sesión del usuario (login, registro, actualizar)
  lib/
    storage.js  ÚNICO archivo que toca localStorage → aquí se conectará el backend
    destinos.js Ciudades, horarios e imágenes
    precios.js  Precios por tipo de asiento, comida, cupones y formato CLP
    viajes.js   Anular / cambiar viajes
    boletoPdf.js Boleto en PDF (jsPDF, se carga solo al descargar)
  pages/        Una página por ruta
```

## Rutas

| Ruta | Página | Requiere sesión |
|------|--------|:---:|
| `/` | Inicio (hero de destinos + buscador) | |
| `/comprar` → `/asientos` → `/resumen` → `/pago` → `/exito` | Flujo de compra | desde `/asientos` |
| `/login`, `/registro` | Cuenta | |
| `/perfil`, `/cupones` | Perfil, viajes y cupones | ✔ |
| `/cambiar`, `/anular` | Gestión de pasajes | |
| `/contacto` | Formulario de contacto | |

## Rendimiento

Lighthouse (build de producción): **93 móvil / 100 escritorio**. Mide siempre con
`npm run build && npm run preview`: el modo `dev` no está optimizado y da puntajes bajos.

- **Imágenes:** `vite-imagetools` genera AVIF/WebP en 320–1920 px desde los maestros de
  `src/assets/destinos/` (máx. 2560 px). El componente `<Foto>` usa `sizes` para que el
  navegador baje solo el tamaño necesario. Para agregar un destino, pon un JPG grande ahí
  e impórtalo en `lib/destinos.js` con el mismo query.
- **Hero:** solo monta la foto visible y precarga la siguiente.
- **Fuentes:** servidas desde el propio sitio con `@fontsource` (sin Google Fonts).
- **JS:** cada página se carga al visitarla (`React.lazy`); jsPDF solo al descargar un boleto.

## Pendiente para el backend

- Reemplazar las funciones de `lib/storage.js` por llamadas a la API.
- Las contraseñas hoy se guardan en texto plano en localStorage (solo demo): en el backend deben ir con hash (bcrypt).
- Validar cupones y asientos ocupados en el servidor.
