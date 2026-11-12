# PzH2000 gumibetét csere

Lépésről lépésre vezető, **offline is működő** webes alkalmazás (PWA) a PzH2000 lánc gumibetéteinek cseréjéhez – hangbemondással, szerszámlistával, idővonallal és lépésenkénti „Kész” visszajelzéssel.

Összeállította: **Strasszer szkv.**

## QR-kód
Nyomtatható plakát: `qr/qr-plakat.pdf` (A4, leírással). Kép: `qr/qr.png`. Cím: https://strattila90-hue.github.io/Pzh2000-gumibet-t-csere/

## Használat
1. Nyisd meg telefonon a GitHub Pages címet (QR-kód).
2. **Android / Chrome:** menü → *Hozzáadás a kezdőképernyőhöz*. **iPhone / Safari:** Megosztás → *Főképernyőhöz adás*.
3. Az első megnyitás után az app **internet nélkül** is működik.
4. Hangbemondás: a telefon magyar felolvasó hangját használja (Android: Beállítások → Szövegfelolvasás → Google → Magyar hang letöltése).

## Tartalom
- **Eligazítás** – az állomány köszöntése, a feladat és az 5 szakasz.
- **34 lépés** – oktató jellegű szöveg, mondatonkénti kiemeléssel felolvasva.
- **Alapismeretek** – lánctalp tag, gumibetét, cserekritériumok, feszítő görgő pár.
- **Nyomtatható oktatóanyag** – teljes anyag A4-re (szerszámlista, nyomatékok, 34 lépés jelölőnégyzettel, alapismeretek, végrehajtási lap). Közvetlen link: `…/#nyomtat`. Kész PDF: `docs/oktatoanyag.pdf`.

## Fájlok
| Fájl | Szerep |
|---|---|
| `index.html` | A kész app (egyetlen önálló fájl, pendrive-ról is fut) |
| `src/` | Forrás: `app.js`, `style.css`, `steps.json` (a lépések szövege), `draw.js`, `scenes.js` (tartalék rajzok, jelenleg kikapcsolva) |
| `build.py` | `python3 build.py` → újragenerálja az `index.html`-t |
| `sw.js`, `manifest.webmanifest`, `icons/` | PWA / offline működés |
| `docs/` | Lépések, alapismeretek, felolvasandó szövegek, **`oktatoanyag.pdf` (nyomtatható A4)** |

## Frissítés
1. Szöveg javítása: `src/steps.json`.
2. `python3 build.py`
3. `sw.js` → `VERSION` növelése (különben a telefonok a régi, gyorsítótárazott változatot mutatják).
4. Commit + push.

## Figyelmeztetés
Oktatási segédanyag. A nyomatékértékeket és eljárásokat mindig a hatályos TM alapján ellenőrizd. Nyilvános közzététel előtt kérd ki az illetékes parancsnok / biztonsági tiszt jóváhagyását.
