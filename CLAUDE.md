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

## 7. Captions

- Synced word by word to the voice-over (transcribe the audio for word timestamps, e.g. with faster-whisper).
- 1–3 words on screen at a time, bold uppercase white sans font with a dark outline or shadow, the key word highlighted (yellow, or red for danger/twist words).
- Placed in the lower-middle, inside the Shorts/TikTok safe area (avoid the right-side buttons and bottom UI).

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
