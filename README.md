# Drážďany 2026

Responzivní offline PWA průvodce pro adventní výlet do Drážďan **5.–6. prosince 2026**.

## Funkce

- sobotní a nedělní itinerář s časovou osou,
- lokální odškrtávání jednotlivých bodů,
- hlavní vánoční trhy a Stollenfest,
- doporučení MHD a offline schematická mapa,
- soukromá sekce ukládaná do localStorage,
- export/import soukromých údajů přes JSON,
- přenos mezi telefony pomocí QR kódu,
- tematická úvodní pozvánka při prvním vstupu, později dostupná z hlavičky,
- service worker + manifest pro instalaci jako PWA.

## Soukromí

Repozitář je veřejný, proto neobsahuje přesnou adresu ubytování, rezervační kódy, telefon hostitele ani jiné soukromé údaje. Ty se zadávají až v zařízení uživatele.

QR kód obsahuje stejný JSON jako exportní pole. Jeho vygenerování aktuálně používá veřejnou službu api.qrserver.com a vyžaduje internet.

## GitHub Pages

Aplikace je publikovatelná z kořene větve `main`:

**Settings → Pages → Deploy from a branch → main → /(root)**

https://l-ra.github.io/drazdany2026/
