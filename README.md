# design/

- `PRINCIPLES.md`: the rules every screen is checked against
- `wireframes.html`: open in a browser (double-click), three views: Library, Flows, Play
- `screens/<area>/<name>.js`: one file per screen, structure only
- `flows/<name>.js`: one file per user flow (start screen only, the rest is derived)
- `lib/`: renderer (`render.js`), flow map (`flows.js`), player (`play.js`), router (`app.js`), `style.css`, `themes.css` (Play themes), `cozy.css` + `cozy.js` (Cozy theme), `buddy.js` (Cozy companion), `splash.js` + `splash.css` (intro)
- `refs/`: inspiration screenshots (Juno, Whoop, own ChatGPT mockups). Mood only, never the spec.

No build step, no npm. Plain JS, works from `file://`.

## Views
Opening the page without a hash starts **Play** on the first flow. The pill at the top (or `••• Menu` in the phone's status bar on a small screen) switches views.
- **Library**: every screen, Current vs. Proposed per area. Tap a phone (or `▶ play`) to start Play on that screen.
- **Flows**: one card per flow. Screens left to right in tap order, branches as extra rows, arrows start at the tapped element and carry its label. `‹ back`, `× close` and loops (`↻`) are only marked under a screen, not drawn. Tap a screen to play from it.
- **Play**: one clickable phone. Sheets slide up over the dimmed screen below. Tapping an unlinked spot flashes all hotspots. Folds, toggles, pills, segments, choices and sliders react locally (visual only). `‹ Back`, `↺ Restart`, `Flows`, `Library` sit above the phone; on a phone they open from `••• Menu`. Play draws the screens in iOS proportions (17 pt body, 34 pt large titles, 44 pt tap targets, 16 pt gutters, tab bar and sheet buttons pinned to the bottom; `PLAY · iOS scale` in `lib/style.css`), while Library and Flows keep the compact preview scale.

**Themes (Play only).** `••• Menu` / the bar above the phone has `Theme` (Cozy · Sky · Dusk · Meadow · Wire) and, for Cozy and Sky, `Time` (Auto · Morning · Noon · Evening · Night; Auto follows the clock). Default: Cozy, Auto. The choice is kept in `localStorage` when the browser allows it. Library and Flows always stay grey wireframes; **Wire** is the plain prototype.
- **Cozy** (default): friendly and soft, like a cozy game. Every area has its own colour world: a flat pastel page, a dark variant for titles, primary buttons and the active tab, a very light variant for icon tiles. Today apricot `#FFD49B` / `#8A3F0A` / `#FFF2DF`, Check-ins mint `#BDE5CC` / `#1B5C40` / `#E6F6EC`, Protocols (with all add / group / plan screens and sheets) periwinkle `#C5CBF7` / `#383D9C` / `#ECEEFE`, Benchmarks + Insights lilac rosé `#EDC8E2` / `#782C66` / `#FBEEF7`, Voice deep teal `#2F6B6A` (light text). The world comes from the screen's area (or its `world`), sheets keep the world of the screen below, and the page colour blends over ~400 ms on a tab change. White cards with 28 pt corners, Fredoka for titles and numbers, Nunito for text (Google Fonts; offline the rounded system font), round cartoon icons instead of the emoji and the grey tab placeholders, a floating pill tab bar with the mic as a round button in the middle, a centred page head with round buttons (a `+ Add` section action becomes the round primary `+` in the dark world colour), a short squish on press. A small companion (a person, `lib/buddy.js`) sits next to the Today greeting (awake with a mug by day, asleep at night) and in empty states (asleep). Quiet motion, one or two things per page: two clouds on Today, the pulse icon on Check-ins, the sun of the protocol folds, the dice on Benchmarks; it holds still while a sheet is open. Save sends up a few small sparks. The tinted card (PRINCIPLES 8) is the dark world colour. Styles: `lib/cozy.css`; Play calls `Cozy.decorate()` (`lib/cozy.js`) on each painted layer, screen files stay as they are.
  The companion is a placeholder from simple shapes. To use finished art, put one image per state into `BUDDY_ART` in `lib/buddy.js` (`sleep`, `awake`); nothing else changes.
- **Sky**: the background is a sky that follows the time of day (the same morning / noon / evening / night split as the protocol folds), slow clouds, milk-glass cards, glass tab bar and sheets. Accent: sunlight yellow by day, moon white at night.
- **Dusk**: dark and low-stimulus, a barely moving aurora, cards one step lighter than the ground, numbers and curves glow faintly. Accent: muted amber. Least motion.
- **Meadow**: sage mist to sand, two slowly breathing organic shapes, opaque warm-white cards. Accent: terracotta, only on the primary tile.

Sky, Dusk, Meadow: rounded type for titles and numbers, 24 pt card radius, depth from soft shadows instead of lines, cards rise slightly (staggered) on a screen change, a soft glow on a dragged slider thumb, one ring of light after a sheet's final button (Save, Add to …). Motion is transform/opacity only and switches off with `prefers-reduced-motion`. A theme is a set of CSS variables on the phone frame (`data-theme`, `data-tod`, class `soft`), see `lib/themes.css`; PRINCIPLES 8 still holds (one tinted tile, the theme only decides its colour). The Today greeting (`head` with `greet:true`) follows the same time of day.

Navigation is in-memory (a stack of screen ids), not the URL: no hash changes, no `hashchange`, no `history.go`, so it also works when the bundled page runs inside a sandboxed iframe. The browser's own back button therefore does not step through Play. As a convenience the current place is mirrored into the hash (`#library/<area>`, `#flows/<flow-id>`, `#play/<flow-id>/<screen-id>`) where the browser allows it, and a hash present on load is opened once as a deep link.

`./bundle.sh` writes everything into one page fragment, `.dist/ema-wireframes.html`, for sharing / phone review.

## Add a screen
1. Copy an existing file in `screens/<area>/`, change `id`, `title`, `status`, `w`.
2. Add one `<script src="screens/<area>/<name>.js">` line at the bottom of `wireframes.html`.

`sheet:true` = opens as a sheet over the screen it was opened from.

## Link screens: `go`
Put the target screen id on the tapped widget. `"back"` = one step back, `"close"` = close all open sheets.

| Widget | Property |
|---|---|
| `btn`, `tile`, `fold`, `mic`, `field`, `draft`, `note`, `sec` (no `act`), any other single widget | `go:"protocols/add-0-choose"` |
| `sec` with `act` | `go` = the act button |
| `tile` with `act` | `act` draws a button inside the tile; `go` = that button |
| `head` | `go` = the right circle |
| `shead` | `goLeft`, `goRight` |
| `seg` | `go` per item, `goRight` = the link on the right |
| `chips`, `pills`, `choice`, `list`, `tl`, `seg`, chips inside a `tile` | `go:[ "id", null, "id" ]` parallel to the items (`null` = not tappable), or one string for all |

A `tile` with `go` as an array links its chips; as a string, the whole tile. `pills` with `multi:true` allow several selections in Play.

Tab bars link via `TABLINKS` in `lib/render.js` (tab name → screen id, per tabset). Tab links are ignored when building flows.

Broken targets are logged to the console on load and shown as `⚠` in the flow map.

## Widget extras
- `head`: `n` = small line under the title (Today: the date); `greet:true` = in Play the title becomes "Good morning / afternoon / evening" for the current time of day.
- Screen (optional, Cozy only): `sub` = small status line under the page title ("All as planned · evening next"); `world` = colour world when it differs from the area (`today`, `checkins`, `protocols`, `insights`, `voice`; Benchmarks uses `insights`).
- `tile`: `cta:true` = a round arrow on the right, the whole tile reads as one button (Today's "Check-in now"). A `tone` other than `white` / `grey` gets class `tint`.
- `tile` `spark` rows: `["Name","value"]` draws the dashed placeholder; `["Name","value",[6,7,5,6,4,5,6]]` draws a small curve from the values (oldest → today, fixed 0–10 scale so rows compare, dashed midline at 5, today's point emphasised).

## Slider
`{t:"slider", l:"Pain", v:3, min:0, max:10, lo:"0", hi:"10", better:"low"}`: `v` = the last value (where the slider starts), `lo`/`hi` = names of the ends (default: `min`/`max`), `better` = which end is good (data only, not drawn). Library and Flows draw it static and muted. In Play a tap sets the value and a horizontal drag moves it (44 pt touch strip, `touch-action:pan-y`, so a vertical swipe still scrolls the sheet); a touched slider turns strong and shows a tick and "was N" at the last value. Visual only, nothing is stored.

## Add a flow
1. Create `flows/<name>.js`:
   ```js
   FLOWS.push({ id:"add-protocol", title:"Add protocol", status:"idea",
     start:"protocols/today-folds-empty", note:"What this flow is about." });
   ```
2. Add one `<script src="flows/<name>.js">` line in `wireframes.html`.

Which screens belong to the flow and all arrows come from the `go` links reachable from `start`. To change a flow, change the links.

## Status
- `current`: exists in the app as it is today
- `idea`: proposal, not built

## Using it with Cursor
"Implement `protocols/today-folds` as specified in `design/screens/protocols/today-folds.js`. Follow `design/PRINCIPLES.md`."
