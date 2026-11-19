# Play: where the games can come from

Research of 19 Nov 2026 for the Play section (cognitive benchmarks). Three Opus agents searched the web for 25 minutes each; Claude merged the reports. **Checked** = read in official docs or papers that day (link given). **Not checked** = from memory, forums or inference; confirm before relying on it. Nothing here was tried out in code.

Alex's question: can the person play any game they like (phone, computer, Roblox, Wordle, chess, Sudoku, brain training), a card in the app opens the real game, and the results come back into the app? And how would we add games of our own, as plugins?

## The short answer

1. **"Any game, results come back" does not exist.** iOS gives no way to read another app's results, and the big platforms keep results to themselves. It works for a small group of open skill games, and there it works well.
2. **Two different things were mixed in the question: measuring and playing.** A benchmark needs the same short task every time. Puzzles and brain training are fine as play and as logged activity, but they are poor measurements.
3. **Plugins are allowed in one form:** games written for the web (HTML5) may be downloaded later and run inside the app. Native game code may not be added after install.

## 1 · Linking existing games

**The pattern:** skill games run by open communities (chess, Go, typing, rhythm) treat every game as a public record with a timestamp and offer it through a simple interface, often with a rating that is a good long-term measure. Commercial platforms (consoles, stores, Game Center, Roblox across experiences) show lifetime totals or achievements at best, or only to the game's own maker. Subscription puzzles (NYT, Duolingo) have no interface and forbid scraping.

| Platform | How the person links | Result per session, with time | Terms | Status |
|---|---|---|---|---|
| **Lichess** (chess, puzzles) | Sign-in, no registration of our app needed | Yes: every game, **every solved puzzle** | Free, one request at a time | Checked |
| **Monkeytype** (typing) | Person pastes a key | Yes: every test with speed, accuracy, consistency, duration | 30 result calls a day | Checked |
| **Chess.com** | Types the username | Games yes, puzzles no (only best values) | Free, public data | Checked |
| **osu!** (rhythm) | Sign-in, our app registered | Yes: every play with accuracy | Ask them before long-term use; probably only the last 24 h are readable, so sync daily | Checked, the 24 h not |
| **OGS** (Go) | Sign-in | Probably, like Lichess | Unclear | Not checked |
| **Roblox, someone else's game** | Sign-in gives identity only | **No** | — | Checked |
| **Roblox, our own game** | Sign-in plus our own server | Yes, we define it | Makers must be ID-verified, users 13+, Roblox says: collect no more than user ID and name; many children | Checked |
| **Steam** | Key plus public profile | No: totals, achievements, playtime | Free | Checked |
| Xbox, PlayStation, Nintendo, Epic, Game Center, Google Play Games | — | No, closed or own game only | — | Partly checked |
| **NYT (Wordle, crossword)**, Duolingo | — | No interface; scraping forbidden in NYT's terms | — | Checked (NYT) |

Sources: Lichess API spec (lichess.org/api) · Chess.com PubAPI (chess.com/news/view/published-data-api) · Monkeytype (api.monkeytype.com/docs) · osu! (osu.ppy.sh/docs) · Roblox OAuth, HttpService, deep links (create.roblox.com/docs) · Steam Web API terms (steamcommunity.com/dev/apiterms) · Google Play Games REST (developer.android.com/games/services/web/api/rest).

**Roblox, the honest picture:** we cannot read how someone played in another maker's game. We could publish our own Roblox game and send its results to our server; a link from our app can open it and carry a pairing code. But it ties health data to a Roblox identity on a platform full of children, against Roblox's own advice on personal data. The riskiest of all options.

**Cards without results coming back** (Wordle, crossword, Sudoku apps, any game): always possible. The card opens the app or site; the result is typed in, pasted (the Wordle grid), or read from a screenshot on the phone (fragile, one layout per game). An app that is mainly a collection of links gets rejected by Apple, so these cards can only be a side dish.

## 2 · Measuring: which tasks

**What research finds in ME/CFS and long COVID (checked):** slowed speed and more variable reaction times, with accuracy preserved. Attention, memory and reaction time are affected; motor speed, vocabulary and reasoning are not (Cockshell & Mathias 2010, meta-analysis of 50 studies). In long COVID a 30-second reaction test found 53.5 % of patients more than two standard deviations slower than controls (EClinicalMedicine 2024). In the general population the deficits in memory and reasoning were small (Hampshire, NEJM 2024). After a tilt test, 2-back reaction time rose from 783 to 941 ms in ME/CFS.

**Problems of testing again and again (checked):** practice effects are large and underrated; a run-in phase and randomly generated variants help but do not remove them. The 3-minute vigilance test (PVT-B) stayed stable over 16 repetitions. Phone model and system change the scores. Smartphone studies use about 1.5 minutes per session, no test more than once a day. No study tested whether short tests trigger a crash; visits with testing can worsen cognition (MCAM), so: short, at most once a day, easy to skip.

**Recommended set, built by us from public paradigms (the ranking is the agent's inference):**

| Task | Measures | Length | Why |
|---|---|---|---|
| Vigilance test (PVT, 3 min) | Sustained attention, reaction time, lapses | 3 min | Best evidence for no practice effect; fits the slowing |
| Simple and choice reaction | Processing speed | 1 min | The core finding in both illnesses |
| Symbol search | Processing speed | 1 to 1.5 min | Very reliable in smartphone studies, endless variants |
| 2-back, fixed level | Working memory | 2 min | Sensitive to orthostatic load; we have an n-back already |
| Stroop (weekly, optional) | Interference control | 1 to 1.5 min | Code exists in Apple's ResearchKit (free licence) |
| Trail Making B (rarely, optional) | Switching | 1 to 2 min | Also in ResearchKit |

At most 3 minutes a day from a rotating set, at a fixed time of day; 5 to 7 sessions of run-in before a baseline; store every single trial with time and device.

**Avoid:** PASAT (unpleasant, strong practice effect); scores of adaptive brain training; puzzles as measurements; closed commercial platforms (Creyos about $59 to 250 a month without an interface, Cogstate by contract, Lumosity and the like without any); copying GPL code (Brain Workshop) into the app; any test longer than about 3 minutes; calling a result a diagnosis.

**Puzzles and brain training (Sudoku, crosswords, arithmetic):** training improves the trained task with little transfer (Simons 2016). No fixed difficulty, strong strategy effects. Treat them as activity (cognitive load, useful for pacing and for the exertion question), not as a benchmark.

Sources: Cockshell & Mathias 2010 (Psychol Med) · Sci Rep 2022 systematic review (PMC8828740) · MCAM cognitive substudy 2024 (PMC11565701) · EClinicalMedicine 2024 (PubMed 38318123) · Hampshire 2024 (PMC11156184) · PVT-B (PubMed 29126328, PMC3197786) · practice effects (PMC7375457) · smartphone cognitive EMA (PMC9377465, PMC8225552) · Simons 2016.

## 3 · Our own games and "plugins" on iOS

**Checked in Apple's App Review Guidelines (read 19 Nov 2026):**
- 2.5.2: an app may not download code that adds or changes features. Native game code after install is out.
- 4.7: an app may offer HTML5 and JavaScript mini games that are not in the app itself. Conditions: we answer for their content; no native functions exposed to them without Apple's permission; no data shared with a game without consent each time; an index of all games, each with a link; age flags.
- Background Assets may download assets, not code.
- Game Center scores belong to their own game; no app can read another's. Screen Time data can be shown as a chart but our app cannot read the numbers, and it is minutes, never results.
- An app that is mainly a collection of links is rejected (4.2.2). No other maker's name or icon in ours (4.1c).

**Inference, not checked:** downloading web games into the app's web view with a bridge that only returns a score should be fine under 4.7; first-party, curated games avoid most of the extra duties.

**How to build, for a tiny team:**
- The measuring tasks natively in SwiftUI: exact timing, almost no size, no web view.
- Fun games as web games inside the app (Phaser, MIT licence, about 1 MB, or plain canvas) with one shared result message (game, score, duration, errors). The same games would run on the web and Android, and new ones can arrive without an app update.
- Unity or Godot: tens of megabytes and a second build pipeline. Not worth it.
- Licences: MIT or CC0 only; no GPL in an App Store app; check art and sound per file.
- Clones: a genre is free, names, characters, art and levels are not. A runner or a slingshot game of our own design is fine; "Flappy", "Subway Surfers", "Angry Birds", "Wordle" as names or looks are not.

## Recommendation (Claude)

Three layers, in this order:
1. **Measure:** four short tasks of our own (vigilance, reaction, symbol search, fixed 2-back), built natively. This is the benchmark that goes into patterns and trials.
2. **Connect:** Lichess first (every puzzle with a timestamp, no registration), then Monkeytype and Chess.com. For people who play there anyway, their rating becomes a measure without any effort, the same idea as Apple Health.
3. **Play:** fun games of our own as web games inside the app, later downloadable; and plain cards for anything else (Wordle, Sudoku) with the result typed or pasted, counted as activity.

Roblox only as our own game, and only after the question of children and health data is answered. Not now.

## Alex's verdict (19 Nov 2026) and what changes
- **Roblox is in.** His brother has built a Roblox game that is really good; we do have a game of our own there. Claude's condition for it: the Roblox side only ever sees a pairing code, never health data; results travel from the game to our server to the app. That needs a small server, which the app does not have yet.
- **The agent is the interface, not a wall of links.** Nobody wants to see 20 links. The agent says: we have many games that work with the evaluation, which one do you want to sign in to? Then tiles. If signing in on a website is too much work, take one of the games that are in the app.
- **"Mainly speed and reaction time" is wrong from the inside.** He knows it as a patient: associations are worse, general creativity has dropped extremely, working memory is lower. Claude's reading of the papers after this: they say speed is what is measured most consistently, not that it is the only loss; memory and attention are in the same meta-analysis, and creativity and association are hardly ever tested, which is a gap in the research, not a finding. Consequence: the set needs tasks for working memory (span, n-back) and for association and fluency. Candidates from Claude's memory, not checked: verbal fluency (as many words of one kind as possible in 60 seconds, spoken, fits the voice agent) and the Divergent Association Task (ten words as unrelated as possible, scored by distance in meaning).
- **Brain training does count as a measure.** His argument: even while one is still getting better, a crash shows as a dip against last week, and in one week there is little learning. Played longer, the learning curve flattens; the app can say that some games need a while before they give good data. Claude agrees with this and withdraws "puzzles are only activity": it is the same stance as Apple Health, the value against your own usual. What stays necessary: tasks are randomised and never repeat, the difficulty is fixed or the reached level is the score, and the slow learning trend is taken out before a dip is called a dip.
- **Crash warning.** Everyone stays within their limit. Not playing is a data point too: too weak to play is one thing, no desire is another, so a skip should be able to say which.
- **Web games must feel native.** No browser frame; embedded as if they were part of the app. Technically possible (a web view without any chrome, full screen); runners and slingshot games run fine in the browser today.

## Open
- Which of the four tasks first, and how the Play section shows "measure" next to "play".
- Whether a rating from Lichess or a typing speed is trusted as a measure (it also changes with training and opponents).
- Not checked: OGS endpoints, the 24-hour window of osu!, links into the native chess apps, current terms of jsPsych-like libraries other than jsPsych itself, ResearchKit 3.x status, NYT terms page (could not be fetched by one agent; quoted by another).
