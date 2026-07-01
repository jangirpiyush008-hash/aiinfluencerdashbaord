---
name: voice-locks
description: Locked Higgsfield preset voice IDs for the 4 AI creators — use these in every audio gen
metadata: 
  node_type: memory
  type: project
  originSessionId: 7cf3bba4-ef40-4803-9c6e-b69b85b704eb
---

One voice locked per creator. Always use these IDs when generating audio for the named creator. See [[creators-roster]].

## Voice locks

| Creator | Voice name | Voice ID | Model |
|---|---|---|---|
| **Siya Sharma** (Bangalore, beauty + fashion) | **Cloned** (Kiara Rai-1 — reassigned because tone is sweet/simple, perfect for Siya) | `7791a070-fef3-4e07-97e5-ad27346fb3ab` (voice_type=`element`) | text2speech_v2_elevenlabs |
| **Kiara Rai** (Mumbai/Punjab, fitness + beauty + fashion) | **Cloned** (Kiara Rai-2) | `967c5bb0-bdfe-4c8d-b7e6-c0fe82f39f44` (voice_type=`element`) | text2speech_v2_elevenlabs |
| **Mia Carter** (Austin, fitness + healthy meals) | Quinn | `80914268-dfae-4f76-8306-36f2d55f58f8` | text2speech_v2_elevenlabs |
| **Ava Monroe** (NYC, fashion + beauty) | Sloane | `b57b22a0-f287-405b-bc82-6f08f5e6bb1f` | text2speech_v2_elevenlabs |

## Usage
- `voice_type: "preset"`, `voice_id: "<from above>"`, `model: "text2speech_v2_elevenlabs"`
- ElevenLabs handles Hinglish + Hindi natively for Siya/Kiara
- All voices handle English for Mia/Ava

## Why these choices
- **Maya** (Kiara): Indian-named preset, strongest match for Hindi/Hinglish delivery
- **Luna** (Siya): Soft warm female, fits beauty creator voice
- **Quinn** (Mia): Bright energetic, fits Austin fitness vibe
- **Sloane** (Ava): Sophisticated calm, fits NYC editorial vibe
