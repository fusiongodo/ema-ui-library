# Intro script: "The cloud" (Alex's own picture, 19 Nov 2026)

This is the sequence Alex saw in his head and described by voice on 19 Nov 2026, written down by Claude. It replaces "One dot each" as the direction. Where Claude added something, it says so. Nothing is built from it yet.

## What matters most

The effect comes from the movement itself: acceleration, rest, kinetics. "Sehr ansprechend und magisch." Everything flows into the next thing; no stopping between zoom, depth and rotation.

## The sequence

**1 · One faint star.** A single weak point of light in the dark. It lights up very gently and flickers a little: too little light for the dark around it. The camera is already beginning to pull back.

**2 · More and more.** Pulling back, more stars come into view, more and more toward the outside, and they are a little brighter. Still a flat picture.

**3 · It has depth.** Without a cut, in the same pull-back, the picture becomes three-dimensional and the viewpoint drifts a little to the right. Through that drift one suddenly sees it: this is a cloud in space, and it rotates. Every star circles one centre, at its own distance, position and angle. The moment of "oh, it's a three-dimensional cloud".

**4 · A few give.** Single stars, not all of them, send something into the centre.

**5 · The centre answers everyone.** Like a fusion reaction, a stronger impulse bursts from the centre to all stars. Every ray starts at the origin at the same time and reaches its star at the same time. So a ray to a near star travels slowly and a ray to a far star travels fast: speed is proportional to distance. All stars are hit in the same instant.

**6 · The switch to science.** In the instant of the hit all stars react at once. This must not look like "oh, it is flat again". It has to say clearly: now comes a different thing, a statistical evaluation, another model that belongs to science. A change of subject. Then every charged star, the whole cloud, rises to the ceiling and gathers along a line at the top: **everyone takes part in the study.**

How Claude makes the switch readable (first draft, not yet judged): the hit freezes the rotation for a quarter of a second, a held breath. Then the view swings face-on and the depth collapses while a straight baseline with fine tick marks draws itself at the bottom and a thin line at the top: the organic cloud gives way to the straight lines of a chart. Only then do the stars shoot up to the top line. As each star leaves the line to fall, it takes one of two colours at random: the randomisation of the study.

**7 · Rain.** From that line they fall, like rain, to the ground.

**8 · Two bells.** Out of the ground grow two normal distributions, two peaks side by side, quickly and with energy. "Sexy, and on the subject of science."

**9 · From the bells to a structure (open).** Alex: two lines that separate, then a curve; it need not be a rising curve, any data structure will do. He does not yet know how to get there. Claude's suggestion, not yet judged: no extra structure; the outlines of the two bells are already curves of points, they join at their ends and round themselves into the circle.

**10 · The circle.** The curve dissolves; its points draw together into a circle that turns.

**11 · Hands, name.** Hands pass over it and away again. Then "MEjority".

## Rhythm (Claude's reading of it, not yet judged)

Rest (1) · swelling (2) · wonder, slow (3) · a few quiet pulses inward (4) · one strong pulse outward (5) · the snap: flat, up, a held breath at the line (6) · acceleration (7) · impact and stillness (8) · flowing (9, 10) · rest (11).

## What it says

A weak light alone (1). There are many (2). They belong to one system without knowing it (3). A few contribute (4); everyone gets something back, at the same time, near or far (5). What comes back turns the crowd into data that can be read: statistics (6 to 8). And in the end a circle of people (10, 11).

## How to make it

SVG is out. This is a particle system in space with a moving camera: every star is one particle that has several target positions (cloud, line, rain, bells, circle) and moves between them. Claude's recommendation: Three.js (3D in the browser, real depth and glow, viewable on the phone by link, timing changed in minutes); a video can be recorded from it for the app. Video models cannot hold an exact choreography of the same points; Blender would be the most beautiful but slow to try things in. Not decided by Alex.

## Open

- Step 9.
- Whether the few in step 4 give one after another or together.
- Whether words are spoken or shown at all.
- Length. Claude's guess: 14 to 16 seconds for the full version, a short one from step 8 on.
- The tool.

## Short version (Alex, 19 Nov 2026, evening)

He now sees it more sharply, and much shorter: **5 to 7 seconds in all.** Same story, fewer beats, no pauses. This is the version to build next; the long sequence above stays as the source for details.

In his words, in order:
1. **One single star.**
2. **Pull back: many stars.**
3. **A dimension is added.** One sees a sphere, and it turns.
4. **Single points go into the centre.**
5. **One impulse goes out to all.** Every star lights up in the moment it is hit.
6. **Suddenly two-dimensional.** All lit points go to a line at the top.
7. **They fall down.**
8. **Out of the ground jumps the distribution with its two peaks.**
9. **A circling swirl with three points forms.**
10. **Hands move over it and apart again, and there stands "MEjority".**

What changed against the long version:
- Length: 5 to 7 seconds instead of 18.
- A sphere that turns, not a loose cloud. The surprise is the added dimension.
- The step from the bells to a structure (old step 9, open) is answered: a swirl of three points.
- The hands cover the swirl and open again; the wordmark is what they reveal.

Timing, Claude's proposal for 6.5 seconds (not judged): star 0.5 · pull back 0.8 · sphere appears and turns 1.0 · points in, impulse out, all light up 1.0 · flat, line at the top 0.6 · fall 0.5 · two peaks jump up 0.7 · swirl of three 0.6 · hands and wordmark 0.8. At this speed every beat has to flow into the next; nothing stands still except the wordmark.

Open: whether the two colours of the randomisation still fit in at this length (Claude: yes, as colour only, without an extra beat); what the three points of the swirl stand for (Claude's reading, not his: none needed, it is the sign that becomes the logo).

## Feedback on the playable draft, round 1 (Alex, 19 Nov 2026, late)

Times are seconds in the 18-second draft (`cloud/index.html`). Overall: "richtig fucking geil". The look from 7.3 on (rotation, single stars giving) is great, apart from the transitions.

**0 to 4.5 s: perfect.** Do not touch.

**4.5 to 7 s: the turn is jerky and changes direction.** What he sees: pull back, then a sideways shift (the observer moves right from about 4.7 to 5.3, so the cloud seems to turn left), a stop, then from about 5.7 the cloud turns the other way. "Das macht gar keinen Sinn." What he wants: while still pulling back, the turning begins slowly; the observer moves right, the cloud turns left, and the cloud's own rotation carries on **in that same direction**, in one smooth movement with the pull-back. No stop in between.

**7 to 8.8 s, a few give:** a star does not fall in and nothing flies like a star. The star stays where it is. It gets a very faint, very thin ray to the centre, and along that ray it sends one small light signal, "ein Mini-Stern", down to the centre. The centre flashes softly each time one arrives (that is already good) and grows brighter.

**8.8 to 9.7 s, the centre answers:** now it explodes in white and shoots stars at the stars. "Zu krass", it looks like an explosion. Wanted: the centre lights everyone gently. A very thin ray from the centre to every star; the centre lights up once; then a light signal runs back along every ray. What only a few sent in now goes out to all. Every star that is reached lights up; not white, not all at once like a flash.

**9.7 to 11 s, the switch:** now the motion stops when all are reached, they flash white, the rays vanish, the sphere is abruptly turned a few degrees further, then thrown to the ceiling, then down. "Stopp, gedreht, an die Decke geschmissen, runter." The flow is lost. Wanted: no stop, no jerk; one continuous movement.

### What Claude changes for round 2 (Claude's decisions, to be judged)
- The cloud's rotation is reversed so that it continues the turn the observer's move to the right begins. The observer's move is stretched (about 3.5 to 8 s, very soft), the rotation speeds up under it; measured on screen, the direction never reverses and nothing stands still between 4.5 s and the switch.
- Giving: a thin ray fades in per giver and follows the star; one small point travels down it; the ray fades after arrival.
- The answer: no shrinking, no burst, no background flash. The centre swells softly (8.8 to 9.3), faint rays to all fade in, small signals travel out with a gentle start and a gentle arrival (9.3 to 10.2), still all arriving in the same instant. Reached stars glow up over 0.3 s, warm, a little larger, and stay charged.
- The switch: the rotation is never frozen. From 10.5 to 12.0 the rotation slows to rest, the view swings face-on and the depth collapses in the same eased movement, and inside it every star leaves its orbit in a curve and settles on the top line (upper stars first, 0.9 s each, no bounce). The chart lines draw themselves meanwhile.
- Everything from the rain on is unchanged, 1.2 s later. The draft is 19.2 s long now.

**Round 2 is built and published (19 Nov 2026), not judged yet.** Measured: on screen the near stars move left without a change of direction from 4.6 s to the switch; in the switch no star's speed changes by more than 3 % of its peak between two frames. Also in it: after the hit the stars are a little larger and shrink back while they fall; an old error is fixed that turned the heaps into white blobs in Chrome, so the rain and the heaps look calmer than in round 1. Known: the flash when a star leaves the top line is the only near-white left. He has not commented on anything from the rain on.

## Feedback, round 2 (Alex, 19 Nov 2026, late)

Still a little rough. It runs in blocks: rotation, stop, move up, line, stop, heaps form, stop, curve drawn over the heaps, stop, ring. **"Die einzelnen kinetischen Elemente sollten überlappen."** In detail:
- After the broadcast (all reached, all glow, still turning) the rotation stops before the move upward has begun, then they accelerate upward. A break. The rotation may only come to rest after the move up is under way.
- At about 12.1 all are at the top, then all fall. Around 14.4 the heaps are done, and only then is the curve drawn over them. The bell curve should form, very pale, **while** the stars fall, and be finished when the last star has fallen. Two steps become one.

### What Claude changes for round 3 (Claude's decisions, to be judged)
- The rise begins right after the glow (10.45) and takes longer; the rotation keeps its full speed until 11.0 and only comes to rest at 12.4, when the last stars reach the line. The stars spiral upward.
- No standing line: a star falls shortly after it arrives at the top, so the first fall while the last still rise.
- The bell outlines grow out of the baseline, pale at first, during the fall, and are complete with the last landing.
- No "silence" before the ring: the first stars leave for the ring as the last ones land, and the ring already starts to turn while it fills.
- The draft gets shorter: about 17.6 s.

**Round 3 is built and published (19 Nov 2026), not judged yet.** 17.6 s. Measured: between the hit and the line the stars are never slower than while rotating (no rest); 507 stars are still rising when the first one falls; 31 are still falling when the first leaves for the ring; at most 266 of 600 sit on the top line at once; the bell outlines are at a third of their strength when half the stars have landed. Known: around 12.0 the top line still shows as a bright, near-white strip, because the stars sit side by side there; from the ring on nothing was changed except that it starts earlier and turns while it fills.

**Verdict on round 3 (Alex, 19 Nov 2026): "YES!!!"** Round 3 is the reference for the final animation. What made the difference, and holds for the final version: the movements overlap, nothing comes to rest between two steps.

## Feedback, round 3 (Alex, 19 Nov 2026, late)

"Ich fühle mich einfach verstanden." The giving at 7.5 to 8 s (small rays, light signals running along them, the centre flaring a little each time) is "perfekt, wunderschön". Still open:
- **The turn starts too late.** At 4 s one sees a cloud, but it only starts to rotate at about 4.6; between 4.5 and 4.6 there is hardly any movement. It should be a 3D cloud that starts turning at 3.5; visible movement from about 3.8, one second earlier.
- **The centre needs a small climax.** From 8.5 on, stimulated by what it received, it should get brighter and swell a little, inside the flowing movement, without costing time.
- **The broadcast is too synchronous.** All rays appear in one stroke (9.0 to 9.1), then "eine Detonation von Signalen" in one stroke. Each ray by itself looks great. Rays and signals should be slightly spread in time: almost together, not perfectly together.

### What Claude changes for round 4 (Claude's decisions, to be judged)
- Depth, the observer's move and the rotation all begin about half a second to a second earlier, so the cloud visibly turns from 3.8 s.
- The centre swells from 8.3 to 9.4 (overlapping the last arrivals), a little larger and brighter than before.
- Each ray to a star fades in at its own moment within about half a second, near stars slightly earlier; each signal leaves and arrives at its own moment within about a third of a second; each star glows up when its own signal arrives. This gives up the earlier rule "all are hit in the same instant", on his word.
- From the rise on (10.45) nothing changes.

**Round 4 is built and published (19 Nov 2026), not judged yet.** Depth opens from 2.8, the observer's move from 2.6, the rotation from 2.8; the rotation alone reaches about a quarter of its final speed on screen at 3.8 and half at 4.0. Rays to the stars fade in between 8.8 and 9.2, signals leave between 9.3 and 9.6 and arrive between 10.06 and 10.49; signals are invisible at the centre and brighten on the way out, so there is no white clump. From 8.0 on every star position is the same as in round 3. Known: between 4.2 and 5.0 the turn looks slower on screen for a moment because the pull-back makes the cloud smaller (the rotation itself keeps speeding up); the centre's bright core is at its widest around 9.6 to 9.7.

## Feedback, round 4 (Alex, 19 Nov 2026, late)

- **The first star is an individual.** It should shine a little brighter than the others, be alone at the start, be seen more strongly and have more presence. (This replaces "one faint, weak star" from the first script.)
- The pull-back stays continuous and must not take longer than now (about 3.5 s as he feels it).
- **The giving should start at 4.4 s** instead of 7.0, and everything up to the broadcast ends correspondingly earlier.

### What Claude changes for round 5 (Claude's decisions, to be judged)
- The first star: calm and clear instead of weak and flickering; larger at the start, and it stays a little larger and brighter than all others until it rises to the line. There it becomes one data point among the others (in the evaluation everyone counts the same). The first neighbours appear from 1.2 s instead of 0.8.
- Everything from the giving on moves 2.6 s earlier, unchanged in itself: giving 4.4 to 6.2, centre climax to 6.8, broadcast arrives around 7.5 to 7.9, rise from 7.85. The first star is the first to give. The draft is 15.0 s long.
- The rotation reaches its full speed by 5.6 and the observer's move ends at 6.0, so the turn is complete before the broadcast.

**Round 5 is built and published (19 Nov 2026), not judged yet.** 15.0 s. The first star: calm, about 14 px across with a soft warm glow for the first two seconds, then a little larger and brighter than the rest until it rises. Giving 4.4 to 6.2, rays to all 6.2 to 6.6, signals arrive 7.46 to 7.89, rise from 7.85, rain from 9.0, ring from 10.8, wordmark from 13.8. Known: from about 3 s on the first star is only slightly distinct from the brightest stars near it.

## Feedback, round 5 (Alex, 19 Nov 2026, late)

- **From the single star through the pull-back to the cloud everything is right, kinematically.** ("alles top")
- Same stars, same mapping, same camera path; only the timing changes: **the giving should start at 2.9 s**, the same rays in somewhat faster succession.
- **The centre should light up and grow before the rays to all and the broadcast begin.**

### What Claude changes for round 6 (Claude's decisions, to be judged)
- Giving from 2.9 s, one giver every 0.11 s instead of 0.1375; the signals arrive between 3.6 and 4.5. The eight other givers light up earlier than before so each is lit when its ray appears.
- The centre grows from 4.0 to 5.0 and holds its peak; the first ray to a star appears at 5.01, not before.
- Everything from the broadcast on moves 1.2 s earlier, unchanged in itself. The draft is 13.8 s long.

**Round 6 is built and published (19 Nov 2026), not judged yet.** 13.8 s. Camera identical to round 5 until 6.6 s, all star positions identical until 6.6 s. Giving 2.9 to 4.5, centre grows 4.0 to 5.0, rays to all 5.01 to 5.44, signals leave 5.5 to 5.8 and arrive 6.26 to 6.69, rise from 6.65, rain from 7.8, ring from 9.6, wordmark from 12.6. The centre now fades in with the first arrival instead of jumping on. **Known, a consequence of his three wishes together:** at 2.9 to 3.5 the picture is still zoomed in, so five of the eight other givers (144, 67, 351, 301, 273) are outside the frame when they give; their rays and signals come in from beyond the edge. With the same stars and the same camera every giver is in the frame only from a start at about 4.2 s; a start at 2.9 with every giver visible needs other stars.

## Feedback, round 6 (Alex, 19 Nov 2026, night)

"Ganz kleine störende Details." The timing stays as it is.
- **The first star should not give.** It disturbs him; he cannot say why.
- **The packages from the outer stars to the centre** are too tiny. The ray is fine; the package itself should be a little thicker, more luminous and have a trail.
- **What goes from the centre outwards** should not be such hard discrete dots.
- **The centre should swell larger** before it sends the rays out.
- (The givers outside the frame at 2.9 to 3.5 s were not mentioned.)

### What Claude changes for round 7 (Claude's decisions, to be judged)
- Eight givers instead of nine (144, 67, 351, 301, 273, 344, 322, 107), same order, same span 2.9 to 3.78.
- Each package is a small comet: a warm glowing head (size 11 instead of 5) with a continuous tapering tail of about 0.14 s of travel.
- The broadcast is a streak of light running along each ray, bright at the head and fading to the tail, with only a soft glint at the head. Inside the inner 45 % of a ray the streak stays dark, otherwise 600 streaks add up to a white burst at the centre.
- The centre swells to size 100 instead of 70, with a soft warm halo, and keeps drifting to 104 until 5.6 so it never freezes. The growth is warm glow, not a larger white disc.

**Round 7 is built and published (19 Nov 2026), not judged yet.** 13.8 s, camera, star positions and all times as in round 6. Measured: the visible glow of the centre at 5.0 is 1.46 times as wide as in round 6, its white core unchanged; white pixels around the centre during the broadcast (5.7 to 6.2) are at most 1.1 times round 6. Known: the first version of the streaks (round 7 before the fix) was a white star-burst around 6.0, the "explosion" he rejected in round 1; it took three steps to remove (darker inner zone, warmer and dimmer streaks, shorter streaks 0.16). In stills the larger centre is a modest change; the thin rays still converge into a white core about 25 px across.
