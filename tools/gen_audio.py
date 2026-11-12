#!/usr/bin/env python3
"""Élethű magyar hangfájlok gyártása a Microsoft Edge neurális hangjával (hu-HU-TamasNeural).

Telepítés:  pip install edge-tts
Futtatás:   python3 tools/gen_audio.py            (csak a megváltozott szövegeket gyártja újra)
            python3 tools/gen_audio.py --all      (mindent újragyárt)
Hang/tempó: --voice hu-HU-NoemiNeural  --rate -4%  --pitch -6Hz

Mondatonként készül egy mp3 (audio/<kulcs>-<n>.mp3), így az app a felolvasott mondatot ki tudja emelni.
A kulcs a felolvasott szöveg hash-e – ha a szöveg változik, új fájl készül, a régi törlődik.
Ezt a GitHub Actions (.github/workflows/hang.yml) automatikusan lefuttatja, ha a szöveg változik.
"""
import asyncio, json, os, re, sys, argparse
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, 'audio')

def split(t):  # UGYANAZ, mint az app.js split() függvénye
    t = re.sub(r'(\d)\.', '\\1\u2024', t)
    parts = re.findall(r'[^.!?]+[.!?]+|[^.!?]+$', t)
    return [p.strip().replace('\u2024', '.') for p in parts if p.strip()]

def fnv(s):  # UGYANAZ, mint az app.js fnv() függvénye
    h = 0x811c9dc5
    for c in s:
        h ^= ord(c); h = (h * 0x01000193) & 0xffffffff
    return format(h, '08x')

def texts():
    steps = json.load(open(os.path.join(ROOT, 'src/steps.json'), encoding='utf-8'))
    vx = json.load(open(os.path.join(ROOT, 'src/voice.json'), encoding='utf-8'))
    out = []
    for k, s in enumerate(steps, 1):
        out.append((f'{k}. lépés:', s['v']))
    for v in vx.values():
        out.append(('', v))
    return out

async def main(a):
    import edge_tts
    os.makedirs(AUD, exist_ok=True)
    mpath = os.path.join(AUD, 'manifest.json')
    man = json.load(open(mpath)) if os.path.exists(mpath) and not a.all else {}
    meta = man.pop('_', {})
    if meta.get('voice') != a.voice or meta.get('rate') != a.rate or meta.get('pitch') != a.pitch:
        man = {}
    new = {}
    for pre, t in texts():
        full = (pre + ' ' + t) if pre else t
        key = fnv(full)
        ss = split(t)
        if pre: ss[0] = pre + ' ' + ss[0]
        files = [f'{key}-{n}.mp3' for n in range(len(ss))]
        if man.get(key) == len(ss) and all(os.path.exists(os.path.join(AUD, f)) for f in files):
            new[key] = len(ss); continue
        for f, x in zip(files, ss):
            print('→', f, x[:60])
            await edge_tts.Communicate(x, a.voice, rate=a.rate, pitch=a.pitch).save(os.path.join(AUD, f))
        new[key] = len(ss)
    keep = {f'{k}-{n}.mp3' for k, c in new.items() for n in range(c)}
    for f in os.listdir(AUD):
        if f.endswith('.mp3') and f not in keep:
            os.remove(os.path.join(AUD, f))
    new['_'] = {'voice': a.voice, 'rate': a.rate, 'pitch': a.pitch}
    json.dump(new, open(mpath, 'w'), indent=0)
    print('kész:', len(keep), 'fájl')

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--voice', default='hu-HU-TamasNeural')
    p.add_argument('--rate', default='-4%')
    p.add_argument('--pitch', default='-6Hz')
    p.add_argument('--all', action='store_true')
    asyncio.run(main(p.parse_args()))
