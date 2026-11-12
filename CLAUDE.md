# CLAUDE.md – projekt memo

## Mi ez
PzH2000 lánc **gumibetét csere** (helyes írásmód: „gumibetét csere”) oktató PWA. Szerző: Strasszer szkv. (tüzér harcjárművezető, MH 25. Klapka György dandár, Tata). Cél: aki életében először cserél betétet, az app lépésről lépésre végigvezeti, magyar hangbemondással. Tervezett élettartam: ~20 év → egyetlen önálló HTML, külső függőség nélkül.

## Felépítés
- `src/steps.json` – 34 lépés: `t` cím, `v` oktató szöveg (ezt olvassa fel és jeleníti meg teljes képernyőn), `n` rövid jegyzet, `w` figyelmeztetés.
- `src/app.js` – UI-logika (kezdőlap, eligazítás, alapismeretek, lépéslista, lépés nézet, Kész gomb + pipa + hang, idővonal 5 szakasszal, localStorage-ben a haladás). `__STEPS__` helyére a build illeszti a JSON-t.
- `src/style.css` – fehér, letisztult (IKEA-szerű) stílus.
- `src/draw.js`, `src/scenes.js` – izometrikus SVG rajzmotor és jelenetek. **Jelenleg nincs megjelenítve** (a felhasználó kérésére csak szöveg van), de megtartva.
- Nyomtatható nézet: `printView()` / `index.html#nyomtat`; a PDF: `google-chrome --headless --print-to-pdf=docs/oktatoanyag.pdf "file://…/index.html#nyomtat"`.
- `build.py` → `index.html`. `sw.js` offline cache (VERSION-t növelni kiadáskor).

## Döntések / tények (a felhasználótól)
- Csak kesztyű kötelező, sisakot NE rajzolj/írj.
- Szélső (külső/belső) összekötő csavar: 32-es dugókulcs, 550 Nm. Láncfeszítő kerék kerek csavarjai: 30-as, 320 Nm.
- Sorrend: zárókupak ki → feszítő összehúzása → … → lánc fent, feszítés → zárókupak vissza (kézzel) → menetpróba (30–40 km/h + satufék, hátramenet kígyózva ~100 m, kigurítás üresben) → feszességmérés (13 külső összekötő, 7.-nél, 6–8 mm). Az „ülepítés” szót NE használd.
- Oldalanként 95 tag, 190 betét (94 tagnál 188), 2,5 kg/db. Lánc megfordításához 15–18 fő.
- Zárókupak = porvédő kupak. Nem lehet leszedni: csak kitekerjük (lazítjuk), a helyén marad, nem kell félretenni.
- Kéziféket nem húzzuk be: azért, hogy lazításkor/bontáskor a lánc tehermentesüljön, ne feszüljön.

## Nyitott kérdések
- Oktatási dián 52 Nm áll az összekötőkre, a felhasználó 550 Nm-et mond → TM-ből tisztázni.
- Középső összekötő csavar kulcsmérete (24?).
- Saját hangfájlok (`docs/felolvasando-szovegek.md` alapján) – az app még a böngésző beszédszintézisét használja (katonás beállítás: pitch 0.78, rate 0.97, férfihang előnyben, kezdőlapon állítható).

## Stílus
Magyar nyelv, rövid, határozott, gyakorlatias. A felhasználó iteratívan dolgozik, gyors visszajelzést ad.
