# speech2avatar

This repository contains the working PersonaPlex + IMTalker live avatar stack.

The intended runtime is a GPU pod under `/workspace`, but the paths are configurable.

## What Is Inside

- `IMTalker/` - the working IMTalker fork used for live PersonaPlex hidden-state driving, static-head LoRA, and blink motion-map compositing.
- `personaplex/` - the PersonaPlex/Moshi code needed by the live server.
- `scripts/download_live_assets.sh` - downloads the external checkpoints needed for live inference.
- `run_live.sh` - starts the live websocket server.
- `live.md` - full setup and run notes.

Large model files are intentionally not committed to Git. They are downloaded from Hugging Face.

Read [live.md](live.md) for the full explanation and paths.
