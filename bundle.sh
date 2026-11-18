#!/bin/zsh
# Bundles wireframes.html + lib/ (style.css, themes.css, js) + screens/ + flows/ into one self-contained page
# (.dist/ema-wireframes.html) for sharing / phone review. Source of truth stays wireframes.html.
set -e
cd "${0:A:h}"
mkdir -p .dist
OUT=.dist/ema-wireframes.html
{
  echo '<title>EMA Wireframes</title>'
  # Cozy theme type (the <head> of wireframes.html is not copied, so the font link is written here, at the top)
  echo '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400..700&family=Nunito:wght@400..800&display=swap">'
  echo '<style>'
  cat lib/style.css lib/themes.css lib/cozy.css lib/studio.css lib/splash.css
  # phone gutters that respect safe areas (overrides the padding shorthand above)
  echo 'body{padding:0;padding-block:24px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}'
  echo '</style>'
  # page markup: everything between <body> and the first screen <script>
  sed -n '/<body>/,/SCREENS: one line per file/p' wireframes.html | sed '1d;$d'
  echo '<script>'
  cat lib/render.js
  # screens and flows in the order wireframes.html loads them
  grep -o 'src="\(screens\|flows\)/[^"]*"' wireframes.html | sed 's/src="//;s/"$//' | while read -r f; do cat "$f"; echo; done
  cat lib/flows.js lib/play.js lib/buddy.js lib/cozy.js lib/splash.js lib/app.js
  echo 'boot();'
  echo '</script>'
} > "$OUT"
echo "bundled $(wc -c < "$OUT" | tr -d ' ') bytes -> $OUT"
