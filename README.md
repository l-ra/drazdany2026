# Drážďany 2026

Offline PWA průvodce pro adventní výlet do Drážďan **5.–6. prosince 2026**.

## Verze v10

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
- diagnostika, vynucení aktualizace a přístup k „Moje data“ jsou schované v hamburger menu,
- service worker cache `drazdany2026-v10`, HTML používá network-first.

GitHub Pages:
https://l-ra.github.io/drazdany2026/

## Mapové odkazy

Každé konkrétní místo a každá plánovaná trasa v itineráři, trzích a MHD má přímý odkaz do Google Maps. Privátní adresa ubytování získá mapový odkaz dynamicky po načtení soukromých dat.

## Pozvánka v8

Pozvánka je nově uložena jako textový SVG soubor `invite.svg` místo binárního JPEG. Tím se odstranil problém s poškozeným / neúplným `invite.jpg` v repozitáři a obrázek je spolehlivě dostupný i offline.

## Pozvánka v9

Primární obrázek pozvánky je znovu `invite.jpg` (1200×900, ručně nahraný originální JPEG). `invite.svg` zůstává jako fallback při chybě načtení. Service worker cachuje oba soubory pro offline použití.

## UI v10

Sekce „Moje data“ je ve výchozím stavu skrytá a otevírá se přes hamburger menu nebo tlačítko „Upravit“ v kartě „Moje cesta“. Offline schematická mapa byla z aplikace odstraněna; praktické odkazy do Google Maps zůstávají u jednotlivých míst a tras.
