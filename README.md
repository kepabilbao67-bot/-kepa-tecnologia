[KEPA TECNOLOGIA.zip](https://github.com/user-attachments/files/29613781/KEPA.TECNOLOGIA.zip)

## Estructura

Web estática desplegada en Vercel (`vercel.json`, `cleanUrls`).

| Archivo | Contenido |
|---|---|
| `index.html` | Marcado de la página. Mantiene dentro el JSON-LD (SEO), la regla `url(#mkGrad)` del degradado SVG y el panel **Tweaks** con su bloque `EDITMODE` (lo reescribe la herramienta de diseño al guardar). |
| `css/styles.css` | Estilos principales. |
| `css/tweaks.css` | Estilos del panel Tweaks. |
| `js/main.js` | Navegación, formulario, idiomas y asistente KEPA IA (llama a `/api/chat`). |
| `js/booking.js` | Calendario de reservas por WhatsApp. |
| `js/voice-guide.js` | Guía por voz de las secciones. |
| `js/music.js` | Música de fondo sintetizada. |
| `api/chat.js` | Función serverless del chat (Claude). Necesita `ANTHROPIC_API_KEY`; dominios extra en `ALLOWED_ORIGINS`. |
| `assets/` | Imágenes. Vercel las sirve con caché de un año (`immutable`): si cambias una, cámbiale también el nombre. |
| `blog/` | Artículos del blog (páginas independientes). |

Los scripts son clásicos (sin módulos) y se cargan al final del `<body>`, en el mismo orden que tenían cuando estaban dentro del HTML: comparten variables globales, así que hay que mantener ese orden.
