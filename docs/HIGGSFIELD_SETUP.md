---
name: higgsfield-setup
description: "Higgsfield.ai MAX plan details, model credit costs, and Soul ID training workflow for fictional creators"
metadata: 
  node_type: memory
  type: project
  originSessionId: 7cf3bba4-ef40-4803-9c6e-b69b85b704eb
---

Video generation backbone for [[project-ai-influencer]]. Used to produce all Rani/Emma content.

**Plan:** MAX — $59/mo (25% off; normally $79)
- 1,800 credits/mo → ~206 raw Kling 3.0 gens → ~68 usable finals (3x iteration)
- Seedance 2.0 Fast UNLIMITED (free drafting)
- 8 parallel generations
- All models unlocked, Soul ID supported

**MCP endpoint:** https://mcp.higgsfield.ai/mcp

## Model credit costs
| Model | Use | Credits |
|---|---|---|
| Kling 3.0 | Final lifestyle / UGC | ~9 |
| Seedance 2.0 | Lip sync / talking head | ~15 |
| Seedance 2.0 Fast | Drafting / testing | Free (unlimited) |
| Soul V2 | Soul ID training photos | Free |

## ⚠️ Seedance 2.0 — ALWAYS use `mode=std`
On Piyush's MAX plan, `mode=fast` for Seedance 2.0 **silently fails AND still charges credits** (~50 credits per failed attempt confirmed 2026-06-27). Despite the docs implying fast is cheaper, on MAX tier it doesn't actually generate output.

**Always default to:** `mode=std`, `resolution=720p` (good Instagram quality, cheaper than 1080p), `generate_audio=true` (for native ambient sound — critical for UGC realism).

15-sec std 720p with audio gen ≈ 67 credits.

**Critical:** Do NOT attach an audio reference (`{role: "audio", value: ...}`) to Seedance 2.0 on MAX plan — every attempt with audio attached has failed silently (confirmed 2026-06-27 across multiple jobs). Generate video silent + `generate_audio=true` (for ambient sound only), then overlay cloned voice in CapCut/InShot externally.

## Soul ID workflow (fictional characters, no real photos)
1. Generate first reference image via Soul 2.0 text prompt — see [[creators-rani-emma]] for prompts
2. Use that image as Soul Reference → generate 19 more angle/expression variations
3. Upload all 20 → Train Soul ID → name "Rani" / "Emma"
4. All future videos lock to that face

**Why:** Soul ID is the only way to keep Rani/Emma faces consistent across 30–40 videos/month. Without it every gen drifts.

**How to apply:** Default to Seedance 2.0 Fast for drafting (free), Kling 3.0 for finals (~9 credits). Train both Soul IDs before any production run. Budget ~9 credits/final, plan iteration headroom.
