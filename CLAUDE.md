# CRIME IF — Detective Shorts Channel (Project Brief)

You are helping me (Arian) produce animated 2D detective/crime Shorts for YouTube Shorts and TikTok.
Read this whole file before doing anything. It is the permanent spec for every video in this project.
I will attach the reference files listed below in this folder / in chat.

---

## 1. What we are making

- Short animated 2D crime/detective story videos, **25–40 seconds** each.
- Storytelling format: a deep narrator voice-over, short punchy lines, a hook in the first second, a twist, and a hard ending ("CASE CLOSED").
- Every video is a **real animated edit**: characters move (walk, turn, crouch, smoke, point a flashlight, talk), scenes change, camera moves vary. **Not** a slideshow of still pictures with zoom.
- Built entirely with code (2D vector animation + compositing + sound), rendered to MP4.

## 2. Reference files (in `references/`; `reference_2-40am.mp4` not added yet)

1. **`reference_2-40am.mp4`**: the storytelling and format reference. 92 s vertical 2D animated horror-crime short ("2:40 AM", a delivery rider, a killer on the 9th floor, "3 rules").
   Take from it:
   - flat 2D vector characters built from parts, with simple but real animation (walking, head turns, hands)
   - many short shots, with cuts on the beat of the voice
   - inserts and close-ups of objects (hammer, phone keypad, light switch, footprints)
   - **captions:** 1–3 words at a time, bold white uppercase, with the key word highlighted in yellow, centred in the lower-middle
   - a persistent small corner element (they use a red clock "2:40") and stamped labels ("RULE 1")
   - dark, moody palette, a low drone and small sound effects
2. **`soviet_cold_city_pack.pdf`**: the **visual style and ambience** reference ("Soviet Cold City Reveal", a Seedance production pack).
   Take from it:
   - painted graphic-novel look: bold variable-weight black ink outlines, flat gouache fills, hatched shadows, heavy paper grain and 35 mm film grain
   - locations: Soviet khrushchyovka concrete blocks, a blood-red sky like a ceiling, smokestacks with black smoke, power-line pylons, chain-link fences, small amber windows, heavy snow, breath fog
   - **stepped/choppy motion** on characters, smoke and snow (held poses, frame-stepped, never too smooth)
   - sound: howling wind, snow tick, a low industrial hum, close foley (lighter click, inhale)
   - Ignore the pack's "no narration / no text / no music" rules. Those were for a 7 s mood clip. Our videos **have** a voice-over and captions.
3. **`detective_character_sheet.png`**: the main character, Detective IF (full body plus 6 angle/close-up panels).
4. **`detective_action_pose_sheet.png`**: IF in 5 painted action panels: walking a lamp-lit street, lighting a cigarette with a Zippo, crouching over a bullet casing, flashlight in a doorway, at a desk reading case files.

## 3. Main character: Detective IF

- Man in his late 30s–40s, slim and tall, slicked-back dark-brown hair, **heavy-lidded tired eyes**, **thin moustache and stubble**, **small scar over the right eyebrow**.
- Wears a long dark charcoal/navy overcoat with a raised collar, a brown tweed waistcoat, a white shirt, a **dark red tie**, dark trousers, dark-brown leather gloves, brown shoes, a police badge on his belt, a shoulder holster, a magnifying glass and a notebook in his pocket.
- Personality: calm, grim, tired, sharp. Few words. Never cartoonish.
- **Build him as a rigged 2D vector character** (separate head, eyes, eyebrows, mouth shapes, torso, coat tails, upper and lower arms, hands, legs, feet) so he can actually **walk, turn, crouch, raise the lighter, smoke, point a flashlight, talk (simple mouth shapes) and blink**. Match the sheet's colours and features so he is clearly recognisable.
- The painted panels from the two sheets may also be used for a few dramatic close-ups (e.g. lighting the cigarette, at the desk), regraded and grained to fit the video. Most shots should use the animated vector rig.
- Build the rig **once** and save it in the project so every future video reuses it.

## 4. Other characters

- Design any other characters the story needs (suspects, victims, police, witnesses) yourself, in the **same 2D vector style** as IF, so everyone matches.
- Suspects can be shown as shadowy silhouettes where it adds mystery.
- Save each reusable character in the project library.

## 5. Locations and lighting (vary every video)

- The Soviet pack is the **style** reference, **not one fixed background**. Create whatever places each story needs: streets, mansion exteriors and interiors, stairwells, corridors, flats, rooftops, an interrogation room, a police office, docks, train yards, alleys, etc.
- Every location uses the same painted Soviet look (ink lines, flat fills, hatching, grain, concrete, snow, amber windows), but the scenes must look different from each other.
- **Vary the lighting and colour per video and per scene:** blood-red sky, cold blue night, dark noir, foggy grey, sodium orange, police red/blue flashes, brighter interiors. Don't reuse the same palette, background or camera move over and over.
- Build locations as **layered parallax** (foreground / midground / background) so camera moves feel 3D.
- Living environment: falling snow or rain, chimney smoke, flickering lamps and windows, a sweeping flashlight beam, dust in the light, breath fog, wind on coats.

## 6. Camera and editing

- Edit like a real video: wide establishing shots, medium shots, close-ups, inserts of clues and objects, reaction shots.
- Varied camera moves: slow push-ins, pans, tilts, arcs, tracking alongside walking characters, rack-focus blur, a small shake on impacts. Cut on the rhythm of the voice-over.
- Strong hook in the first 1–2 seconds; a big moment on the twist (punch-in, red accent, hit sound); a stamped **"CASE CLOSED"** ending.
- A small persistent channel element in a corner (like the clock in the reference), e.g. a case number "CASE 001" in red.

## 7. Captions (cinematic subtitle style, decided with Arian)

- **Main captions = film-subtitle style:** yellow (#F2D23C-ish), bold clean sans, sentence case (not all caps), soft dark shadow, no box. Short phrases of about 3–7 words, one line (two max), each shown in sync with the voice and cut on the phrase. Size large enough for a phone (about 52–58 px at 1080 wide).
- Placed in the lower-middle safe area (about 70–75 % down), clear of the right-side buttons and bottom UI, never over IF's face.
- Spoken quotes (characters talking) use a leading dash, like film subtitles: "- He was stabbed in the back."
- **Accent titles = motion-graphic style (sparingly, 3–5 per video):** big elegant italic serif in yellow, animating in fluidly (drift, scale, blur-in, letter stagger, light glow). Used only for key moments: the hook, the twist word, the final line. Captions hide while an accent title is on screen.
- Words timed from the audio (word timestamps), corrected against the script.

## 8. Sound

- My voice-over is the main track (I send it each time).
- Add an ambience bed (wind, city hum, rain or snow as the scene needs) and a low dark drone underneath.
- Sound effects matched to the action: footsteps, lighter click and flame, inhale, door creak, paper rustle, whooshes on cuts, a deep hit on the twist, a stamp slam on "CASE CLOSED".
- Keep the voice clearly on top. Effects and ambience are mixed under it.

## 9. Export spec (always)

- **9:16 vertical, 1080×1920, 60 FPS**
- H.264 (use NVENC on my RTX 2070 when possible), **20–25 Mbps** video bitrate, e.g. `-b:v 22M -maxrate 25M -bufsize 44M`, yuv420p, `+faststart`
- AAC 48 kHz, 320 kbps
- Ready for YouTube Shorts and TikTok.

## 10. Workflow (every video after setup)

1. I send: **voice-over audio** + **script text** (sometimes with scene notes).
2. You transcribe the audio for word timings, write a short shot list (show it to me briefly), then build the scenes and animation, captions and sound, and render the final MP4.
3. Reuse the saved characters, rig, effects, caption style and sound kit. Only build new locations or characters when the story needs them. Keep it efficient.

## 11. One-time setup (do this first)

1. Choose and install a good code-based 2D animation stack (e.g. Python + skia-python/pycairo for anti-aliased vector drawing, or Remotion/Node) plus ffmpeg with NVENC and faster-whisper. Tell me what you picked and why.
2. Build the reusable library: the IF vector rig, the caption system, the grain/ink/snow/smoke effects, the camera system and a sound-effects folder.
3. Make a **5-second test**: vector IF walking through a snowy Soviet street under a red sky, with parallax, falling snow, grain, a camera track and wind sound. I'll approve the look before we do full videos.

---

## 12. First video: CASE 001, "The Killer's One Mistake"

Target length 35–40 s. I'll send the voice-over audio. If I recorded the long version, keep the full script. This is the original:

> The killer made one mistake.
> He revealed something nobody knew.
> A millionaire was found dead inside his mansion.
> Three suspects were questioned: his wife, his driver, and his personal assistant.
> But Detective IF noticed something unusual.
> The police had kept everyone away from the body.
> It was still covered.
> Not even the cause of death had been revealed.
> Then Detective IF asked one question:
> "Does anyone know how he died?"
> Nobody answered.
> Until the assistant suddenly whispered:
> "He was stabbed in the back."
> Detective IF stopped.
> Nobody had mentioned a knife. Nobody had seen the wound.
> So how did the assistant know?
> Because he was the one who put it there.
> CASE CLOSED.

Shorter version (about 90 words, fits 35–40 s better):

> The killer made one mistake. A millionaire was found dead in his mansion. Three suspects: his wife, his driver, his assistant. The body was still covered. Nobody knew how he died. Detective IF asked one question: "Does anyone know how he died?" Silence. Then the assistant whispered: "He was stabbed in the back." Nobody had mentioned a knife. So how did he know? Because he put it there. CASE CLOSED.

Shot plan idea (adapt it to the real audio timing):
1. **Hook:** black frame, then a close-up of IF lighting a cigarette (flame flicker, smoke), "THE KILLER MADE ONE MISTAKE."
2. **Mansion exterior:** a big Soviet-style mansion under a blood-red sky, snow, one lit window, police car lights sweeping red and blue.
3. **The covered body:** a white sheet on the floor of a grand room, police tape, cold blue light. Nothing graphic.
4. **Three suspects:** a lineup of wife, driver and assistant (shadowy), each lit up as they're named.
5. **IF notices:** IF walks in, then crouches by the sheet. Close-up of his eyes narrowing.
6. **The question:** IF faces the suspects, "Does anyone know how he died?", then silence (only wind and clock ticks), a slow push across the faces.
7. **The whisper:** a hard punch-in on the assistant, "He was stabbed in the back.", a deep hit, the word "STABBED" in red.
8. **Realisation:** IF stops, his eyes slide to the assistant, quick inserts (the covered sheet, no knife visible).
9. **Reveal:** "Because he was the one who put it there." The assistant in red light, his shadow on the wall.
10. **Ending:** IF at the desk or walking away into the snow, then a red **"CASE CLOSED"** stamp slams down.

---

## 13. Decisions log

- **Stack:** Remotion (React/SVG, code-built animation), same approach as `finance-motion-studio` and `football-motion-studio`. Reuse their helper scripts (`transcribe.py`, `make-sfx.py`, `render.mjs`) where useful.
- **Other characters:** Arian lets Claude design all side characters (suspects, victims, police, witnesses) freely, based on the audio and script. They only need to fit the video and the shared style. No approval needed.
- **No video prompt needed:** this file is the standing brief. Each video needs only the voice-over audio and the script (scene notes optional). The Seedance prompt in the PDF is for an AI video generator and is used only as a style reference.
- **References** are in `references/`. The 2:40 AM reference video is not added yet.

---

## 14. Studio library (built for CASE 001, reuse for every case)

```
src/kit/time.ts        60 fps clock, sec(), stepF() (stepped "on 4s" cel motion), easing, hash/noise
src/kit/camera.tsx     <Stage cam={{x,y,zoom,rot,shake}}> + <Layer depth blur> = 2.5D parallax camera
src/kit/fx.tsx         <Defs/> (hatching, tweed, stubble, chain-link, parquet, glows), <Ink> (outline + fill + hatch),
                       Snow / SnowOverlay, Smoke (chimneys), CigSmoke, Dust, FilmFinish (grain+paper+vignette+flicker),
                       Grade (colour grade), Flash, policePhase (red/blue light bar)
src/kit/captions.tsx   Film subtitles (yellow, Inter Bold, sentence case) + AccentTitle (Playfair italic, letter blur-in),
                       CaseTag ("● CASE 00X", top-left) + CaseClosed stamp
src/kit/fonts.ts       Inter, Playfair Display Italic, Special Elite (typewriter), Anton (stamp); all OFL, in public/fonts
src/characters/        IFBust (close-up rig: mouth, blink, look, brow, tilt, rim, flip, cig)
                       IFBody (full-body side rig: walk cycle FK, coat follows legs, wind, cig) + ProfileHead
                       Suspects (bust rig: wife / driver / assistant; mouth, blink, look, fear, sweat)
src/locations/         soviet.tsx (RedSky, Block, Pylon, Cables, Factory, Lamp, Fence, BareTree, PoliceCar, Mansion, SnowGround)
                       StreetScene.tsx (5-depth snowy khrushchyovka street), interiors.tsx (Corridor, BodyRoomTop,
                       ReportCard, RevealWall, Tape, Sconce)
src/cases/case001/     timeline.ts (shot times, subtitles, accent titles), shots.tsx (one component per shot), Case001.tsx (edit + sound mix)
public/sfx/            synthesised sound kit (scripts/make-sfx.py): wind/drone/hum/room beds, siren, lighter, inhale/exhale,
                       steps (snow/wood), door creak, paper, whooshes, hit-deep, riser, tick/tock, heartbeat, stamp, sting, flash
public/tex/            grain frames + paper texture (scripts/make-textures.py)
public/img/            painted panels cropped from the reference sheets (if_lighter.jpg, if_desk.jpg)
```

### Per-video commands
```
cp <voiceover> public/audio/caseNNN.mp3
node scripts/analyze-audio.mjs public/audio/caseNNN.mp3 --noise -38 --min-silence 0.25   # phrase segments + loudness envelope (lip flap)
python3 scripts/transcribe.py public/audio/caseNNN.mp3                                   # word times (sherpa-onnx; model in models/, git-ignored)
node scripts/stills.mjs CaseNNN 1,5,9,...                                                # preview frames + contact sheet in out/
npx remotion render src/index.ts CaseNNN out/caseNNN_raw.mp4 --video-bitrate=22M --audio-bitrate=320k --x264-preset=slow
ffmpeg -i out/caseNNN_raw.mp4 -c copy -movflags +faststart out/CASE_NNN_final.mp4
```
Setup in a fresh container: `npm install`, `pip install numpy scipy soundfile sherpa-onnx pillow`, download the ASR model
`https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-zipformer-en-2023-06-26.tar.bz2` into `models/`.
On Arian's PC with the RTX 2070, re-encode with NVENC if wanted: `-c:v h264_nvenc -b:v 22M -maxrate 25M -bufsize 44M`.

---

## 15. Rules learned from CASE 001 (apply to every video)

- **Never open on black.** Frame 1 is already a strong, lit image (a character, motion, light), and the voice starts on frame 1. No silent or black pre-roll; the first second decides retention.
- **Keep the voice clean, especially the first words.** No hissy or noisy effects under the voice (e.g. the lighter spark/flame burst sat on the first words of CASE 001). Opening effects are quiet and low (a soft click, a low rumble), never broadband hiss. Breathing and the other effects as in CASE 001 are approved.
- **IF's signature car:** a black classic late-60s fastback (Mustang-style shape, no Ford logos/badges). It's his iconic car only. Use it whenever the story needs him driving or arriving (a good hook shot). Build it once into `src/characters/` the first time it's needed and reuse it.
- CASE 001 was approved by Arian as-is (rendered video in `videos/`).

---

## 16. After Arian approves a video (always, without being asked)

When Arian says the video is good / accepts it, deliver in one message:
1. **5 best YouTube Shorts titles** (curiosity gap, no spoiler of the twist, under ~50 characters), with one top pick.
2. **YouTube description** (hook line without spoiler, a comment-bait question, "CASE 00X · Detective IF", "Follow for the next case", 6–9 hashtags incl. #shorts) **plus a short TikTok caption**.
3. **Thumbnail/cover recommendation** (the most striking frame + timestamp), and render the clean cover (no subtitles, big yellow italic title + red CASE tag) as `videos/CASE_00X_thumbnail.jpg` (see `src/cases/case001/Thumbnail.tsx`), commit, push and send it.
Also: the final MP4 goes to `videos/` via Git LFS (needs the `crime-motion-studio` cloud environment), pushed and sent.

- **IF's car reference: `references/if_car.png`**: a black 1965–67 fastback (Mustang shape): long hood, sloping fastback roof with side louvres, chrome bumpers, window trim and rocker strip, wide grille with chrome surround, round amber-lit headlights, round fog/turn lights, dark five-spoke wheels, tri-bar red tail lights, thin antenna, weathered/dusty black paint with red rim light. Build the rig to match it (side, 3/4 front, rear, headlight close-ups), but draw no brand logos, emblems or lettering (blank grille centre, no pony badge).
- **Car sound:** a classic V8 muscle-car sound (deep burbling idle, rumbling throttle, growl on acceleration, exhaust crackle, door thunk, ignition crank). Synthesise it into `public/sfx/` the first time it's needed.
- Channel started Nov 2026; CASE 001 scheduled on YouTube.
