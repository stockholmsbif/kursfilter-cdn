# kursfilter-cdn

Detta repo innehåller en JSON-export av kursdata för barngymnastik.nu, genererad från ett Google Sheet via Google Apps Script.

## Innehåll

- `courses.json`: En lista med godkända och aktuella kurser
  - Berikad med arrangörsinformation
  - Endast kurser som är godkända, publicerade och inom synlighetsdatum

## Uppdatering

- Exporteras automatiskt via schemalagt script i Google Apps Script
- Pushas till detta repo via GitHub API
- Uppdateras t.ex. varje timme

## Användning

- JSON laddas som statisk fil från GitHub Pages:
- Används av ett WordPress-plugin som visar kurser i frontend via React.
