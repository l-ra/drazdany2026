# Drážďany 2026

Offline PWA průvodce pro adventní výlet do Drážďan **5.–6. prosince 2026**.

## Verze v8

Aplikace je rozdělena na:
- `index.html`
- `app.css`
- `app.js`
- `qrcode.js`
- `invite.jpg`
- `manifest.webmanifest`
- `sw.js`

Hlavní vlastnosti:
- stabilní responzivní itinerář,
- lokální označování bodů „Hotovo / Splněno“,
- soukromá data v localStorage,
- import/export JSON se zřetelnou zpětnou vazbou,
- lokální offline QR bez odesílání dat třetí straně,
- soukromá data se po načtení projeví v kartě „Moje cesta“ a v relevantních bodech itineráře,
- pozvánka při prvním spuštění v6 a znovu přes hamburger menu,
- diagnostika a vynucení aktualizace schované v hamburger menu,
- service worker cache `drazdany2026-v6`, HTML používá network-first.

GitHub Pages:
https://l-ra.github.io/drazdany2026/

## Mapové odkazy

Každé konkrétní místo a každá plánovaná trasa v itineráři, trzích, MHD a schematické mapě má přímý odkaz do Google Maps. Privátní adresa ubytování získá mapový odkaz dynamicky po načtení soukromých dat.

## Pozvánka v8

Pozvánka je nově uložena jako textový SVG soubor `invite.svg` místo binárního JPEG. Tím se odstranil problém s poškozeným / neúplným `invite.jpg` v repozitáři a obrázek je spolehlivě dostupný i offline.
