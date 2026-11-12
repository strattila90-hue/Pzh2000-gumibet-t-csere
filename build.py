#!/usr/bin/env python3
"""Összefűzi a src/ fájlokat egyetlen önálló index.html-be.  Futtatás: python3 build.py"""
import json,os
d=os.path.dirname(os.path.abspath(__file__));r=lambda p:open(os.path.join(d,p),encoding='utf-8').read()
steps=json.loads(r('src/steps.json'))
app=r('src/app.js').replace('__STEPS__',json.dumps(steps,ensure_ascii=False))
head='''<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#1b1b1b">
<meta name="apple-mobile-web-app-capable" content="yes">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon.svg">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<title>PzH2000 gumibetét csere</title>
'''
sw="\nif('serviceWorker' in navigator&&location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(()=>{})}\n"
html=head+'<style>\n'+r('src/style.css')+'</style>\n</head>\n<body>\n<div id="app"></div>\n<script>\n'+r('src/draw.js')+'\n'+r('src/scenes.js')+'\n'+app+sw+'</script>\n</body>\n</html>\n'
open(os.path.join(d,'index.html'),'w',encoding='utf-8').write(html);print('index.html kész')
