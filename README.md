# design/

- `PRINCIPLES.md`: the rules every screen is checked against
- `wireframes.html`: open in a browser (double-click), renders every screen
- `screens/<area>/<name>.js`: one file per screen, structure only
- `refs/`: inspiration screenshots (Juno, Whoop, own ChatGPT mockups). Mood only, never the spec.

## Add a screen
1. Copy an existing file in `screens/<area>/`, change `id`, `title`, `status`, `w`.
2. Add one `<script src="screens/<area>/<name>.js">` line at the bottom of `wireframes.html`.

## Status
- `current`: exists in the app as it is today
- `idea`: proposal, not built

## Using it with Cursor
"Implement `protocols/today-folds` as specified in `design/screens/protocols/today-folds.js`. Follow `design/PRINCIPLES.md`."
