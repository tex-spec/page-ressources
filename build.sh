#!/bin/bash
# Build unique du hub : la SOURCE est index.html (JSX + CSS inline).
# prod-live/ est generee, jamais editee a la main.
set -e
cd "$(dirname "$0")"
S=index.html; D=prod-live

# 1) JSX -> app.js
node -e "
const babel=require('/tmp/jsxcheck/node_modules/@babel/standalone');const fs=require('fs');
const m=fs.readFileSync('$S','utf8').match(/<script type=\"text\/babel\"[^>]*>([\s\S]*?)<\/script>/);
if(!m){console.error('JSX introuvable');process.exit(1)}
fs.writeFileSync('$D/app.js',babel.transform(m[1],{presets:[['react',{runtime:'classic'}]]}).code);
"

# 2) coquille : CSS inline de la source recopie dans la coquille servie
python3 - <<'PY'
import re
src=open('index.html',encoding='utf-8').read()
dst=open('prod-live/index.html',encoding='utf-8').read()
sb=re.findall(r'<style>([\s\S]*?)</style>', src)
db=re.findall(r'<style>([\s\S]*?)</style>', dst)
if sb and db:
    dst=dst.replace('<style>'+db[0]+'</style>', '<style>'+sb[0]+'</style>', 1)
    open('prod-live/index.html','w',encoding='utf-8').write(dst)
    print("  CSS synchronise source -> coquille")
PY

# 3) CSS Tailwind minimal
cp index.html /tmp/scan.html
/tmp/jsxcheck/node_modules/.bin/tailwindcss -c /tmp/jsxcheck/tw.config.js -i /tmp/in.css -o $D/tailwind.css --minify 2>/dev/null

# 4) empreintes anti-cache
cd $D && python3 - <<'PY'
import re,hashlib
s=open('index.html',encoding='utf-8').read()
for f in ['app.js','tailwind.css','header-base.css','header-apple.css','header-apple.js','header-glass.js','covers.js']:
    v=hashlib.md5(open(f,'rb').read()).hexdigest()[:8]
    s=re.sub(r'(["\'])'+re.escape(f)+r'(\?v=[a-f0-9]+)?\1', r'\g<1>'+f+'?v='+v+r'\1', s)
open('index.html','w',encoding='utf-8').write(s)
PY
echo "BUILD OK : $(wc -c < app.js) octets app.js, $(wc -c < tailwind.css) octets css"
