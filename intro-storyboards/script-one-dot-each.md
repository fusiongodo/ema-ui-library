# Intro script: "One dot each" (version 3, 19 Nov 2026)

Written by Claude as the full script; whoever builds it executes this and decides nothing about the story. Status: proposal, not yet approved by Alex.

## The idea in one sentence

Every person is a star with a few days of data. Everyone gives their days; on the horizon they pile up into two heaps of points, placebo and real; the heaps differ, and that difference becomes the sunrise that lights every star.

The statistical picture and the picture of light are the same picture: **the distribution is the sun.**

## What it has to carry

| Idea | Where it shows |
|---|---|
| Everyone collects data | Sparks orbiting each star (shot 2) |
| Sharing, cooperation that spreads | One star starts, the neighbours follow, a wave runs through the sky (shot 3) |
| Unifying the data | All sparks land on one baseline, same size, same grid (shot 4) |
| Blinding | Sparks are colourless on the way; they take colour only when they land (shot 4) |
| The empirical process | With few points the two heaps look alike; with many, the shapes smooth and the shift shows (shot 4) |
| Detecting a signal | A short bright line between the two peaks (shot 4) |
| Published, the group learns | The light reaches every star, also those that gave nothing (shot 5) |
| Light into the dark | Sunrise (shot 6) |

## Vocabulary

- **Star** = a person. Warm yellow `#FFD27A`, soft glow. Stays in its place for the whole film.
- **Spark** = one day of one person's data. Pale `#FFF1C9`, radius 2.
- **Placebo** cool blue `#8FA3C4`, **real** warm yellow `#FFD27A`.
- **Horizon** = the baseline of the statistics, at 72 % of the height. Invisible until sparks land on it.
- Sky: night `#111A2C`, ground below the horizon a little darker `#0B1220`. Dawn `#1B2742` → `#4A4468` → `#C9825E` at the horizon. Day `#DCEBF2` → `#FFF2DF`. Wordmark teal `#2F6B6A`.
- Frame: portrait 390 × 844. Positions below are % of width, % of height. Glow is additive: where blue and yellow overlap, it turns pale.
- No lines that stay. Trails fade within 0.4 s.

## Shots (about 14 s)

**1 · One (0.0–2.0 s).** Dark. A star fades in at (50, 40) over 0.6 s, radius 4, glow 28. At 0.8 s it pulses once (grows to 1.5× and back, 0.4 s) and a spark comes off it and settles into a slow orbit of radius 14. At 1.4 s a second pulse, a second spark.
Line: *"Every day, each of us notices what helps."*

**2 · Many (2.0–4.0 s).** The star glides to (30, 28) and shrinks to radius 2.5. About 120 more stars fade in, from the middle outward, over 1.2 s, spread over the sky between 6 % and 64 % of the height, radius 1.5 to 3. Each has two or three sparks in orbit; the orbits are out of step and every star twinkles in its own rhythm (period 1.5 to 3 s). About one star in seven has no sparks and is dimmer: people who are not tracking.
Line: *"Alone, it's a guess."*

**3 · Give (4.0–6.5 s).** The first star pulses. Its sparks leave their orbit and fall in a soft arc toward the middle of the horizon. 0.3 s later its nearest neighbours do the same, then theirs: a wave that runs outward from the first star and has crossed the sky after 1.6 s. Each spark has a short fading tail. All sparks are pale. The stars stay and keep twinkling.
Line: *"So we put our days together."*

**4 · Signal (6.0–9.5 s, overlapping shot 3).** The sparks land on the horizon and stack, dot on dot, on a grid (column width 6, dot radius 2.5). On landing each spark flashes for 0.15 s and takes its colour: half blue, half yellow. Blue stacks into a heap centred at 43 %, yellow into a heap centred at 57 %; each heap is bell-shaped, about 150 dots, at most 16 dots high (about 80 px), width (one standard deviation) 9 % of the frame. They overlap strongly.
- First second: few dots, both heaps ragged, no difference to see.
- As they fill, the shapes become smooth; from 8.3 s the shift is plain.
- 8.3 s: tiny labels fade in under the heaps, "placebo" and "real" (10 pt, 60 % opacity).
- 8.8 s: a thin bright line draws itself just above the heaps from the blue peak to the yellow peak (0.4 s), with a small tick at each end: the difference.

Line: *"Together, it's a signal."*

**5 · Return (9.5–11.5 s).** The difference line slides into the yellow peak. The yellow heap brightens to pale gold; its dots melt together in their own glow into a soft half disc on the horizon: the sun. A ring of light spreads from it across the sky (the whole sky in 0.9 s), with thin rays from the sun to the stars that last 0.5 s, as in frame 5 of the first sketch. Each star flares as the ring passes (twice its size for 0.3 s) and stays 40 % brighter, also the dim ones that gave nothing. The blue heap sinks into the ground as a low hill in shadow; the labels fade.
Line: *"And it comes back to everyone."*

**6 · Day (11.5–14.0 s).** The sky turns: night, dawn (violet above, orange at the horizon), pale day, over 1.8 s. The sun rises by 6 % of the height. The stars do not go out; they stay as small teal points in the day sky (35 % opacity). At 12.6 s the wordmark "MEjority" fades in at 40 % of the height (0.6 s). Hold for one second.

## Versions

- **Full (14 s):** first launch, presentations.
- **Short (about 3 s):** shots 5 and 6 only, for every later launch.
- **Ending with hands (optional):** in shot 6 the stars glide into a ring around the wordmark and the five hands of the current intro fade in below it. Claude would end on points only; the ring of hands tells "together" a second time.

## Kept honest

The heaps overlap far more than they differ. It shows a signal, not a proof; the app itself says "likely" at most.

## Open

- Whether the last line is needed ("And it comes back to everyone") or the picture says it alone.
- Whether "placebo" and "real" are written in the picture or left to the voice.
- How it is made: programmed points (canvas now; a shader for real glow later). No SVG needed.
