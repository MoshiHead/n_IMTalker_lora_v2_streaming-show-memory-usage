# Live PersonaPlex + IMTalker Static-Head Server

This document describes how to run the working live setup:

```text
PersonaPlex response audio + hidden states
-> Helium/Wav2Vec adapter
-> IMTalker generator with static-head LoRA
-> IMTalker renderer
-> optional cached eye-blink motion-map composite
-> browser websocket video/audio
```

## Folder Layout

After cloning:

```text
speech2avatar/
  IMTalker/
  personaplex/
  scripts/download_live_assets.sh
  run_live.sh
  live.md
```

Runtime checkpoints are downloaded to:

```text
speech2avatar/IMTalker/checkpoints/
speech2avatar/checkpoints/
```

These folders are ignored by Git.

## Hugging Face Files

Adapter checkpoint already lives in:

```text
dataset: niloy629/hdtf_preprocess
path: personaplex_helium_w2v_frontend_adapter/checkpoints/phase2_best_wav2vec_final_loss.pt
```

Static LoRA checkpoint uploaded for this repo:

```text
dataset: niloy629/hdtf_preprocess
path: lora/ditto_blink_lora_withaudio_r64_1h_last.ckpt
sha256: 7d139c5fb310b3b58ff1a0c856e2fe713e9ceb64efb18f5551e882ade1634ac1
```

Cached blink motion used by the live server:

```text
dataset: niloy629/hdtf_preprocess
path: lora/3robert_audio3_ditto_static_motion.pt
sha256: e29a41ff004b228d7efee15cad0f32f4d4bc5466563709e2ba78b158d4e340bb
```

Base IMTalker checkpoints:

```text
model: cbsjtu01/IMTalker
paths:
  renderer.ckpt
  generator.ckpt
  wav2vec2-base-960h/*
```

PersonaPlex bnb4 weights:

```text
model: brianmatzelle/personaplex-7b-v1-bnb-4bit
expected file: model_bnb_4bit.pt
```

## Fresh Pod Setup

Start from a Python 3.11 CUDA pod:

```bash
apt-get update && apt-get install -y python3.11 python3.11-venv ffmpeg git htop tmux

cd /workspace
git clone <your-github-url> speech2avatar
cd /workspace/speech2avatar

python3.11 -m venv /workspace/preprocess_5090
source /workspace/preprocess_5090/bin/activate

python -m pip install --upgrade pip wheel
python -m pip install "setuptools==80.9.0"
pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/cu128
pip install -r IMTalker/requirement.txt
pip install "huggingface_hub[cli]" hf_transfer tensorboard
pip install "sphn>=0.2.0,<0.3.0" einops sentencepiece aiohttp av aiortc bitsandbytes
```

Login to Hugging Face:

```bash
export HF_TOKEN=...
hf auth login --token "$HF_TOKEN"
```

Download checkpoints:

```bash
bash scripts/download_live_assets.sh
```

Install the PersonaPlex/Moshi Python package without changing the working PyTorch version:

```bash
source /workspace/preprocess_5090/bin/activate
cd /workspace/speech2avatar/checkpoints/personaplex_bnb4
pip install -e moshi/ --no-deps
cd /workspace/speech2avatar
```

## Run

Default run:

```bash
cd /workspace/speech2avatar
bash run_live.sh
```

Open port `8998` through your pod proxy.

## Useful Overrides

Use source_5 instead of 3robert:

```bash
REF_PATH=/workspace/speech2avatar/IMTalker/assets/source_5.png bash run_live.sh
```

Change CFG:

```bash
A_CFG_SCALE=1.0 bash run_live.sh
A_CFG_SCALE=2.0 bash run_live.sh
```

Set prompt:

```bash
TEXT_PROMPT="You are a helpful person answering questions properly." bash run_live.sh
```

Use a voice prompt if you have one:

```bash
VOICE_PROMPT=NATM0.pt VOICE_PROMPT_DIR=/workspace/voices bash run_live.sh
```

Disable blink by editing `run_live.sh` and removing:

```text
--enable_eye_blink_composite
--blink_motion_path ...
--eye_...
```

## Expected Healthy Log Signs

Look for:

```text
frontend-fp32 loaded
using direct Moshi reply hidden
installed PersonaPlex graphed hidden capture
Uvicorn running on http://0.0.0.0:8998
serving .../static/index_v3_binary_fullscreen.html
```

## What This Run Uses

- Renderer: original pretrained IMTalker renderer.
- Generator base: original pretrained IMTalker generator.
- Generator modification: LoRA checkpoint `ditto_blink_lora_withaudio_r64_1h_last.ckpt`.
- PersonaPlex adapter: `phase2_best_wav2vec_final_loss.pt`.
- Static-head behavior: learned in LoRA checkpoint.
- Blink behavior: cached motion maps blended into the eye region before rendering.

## Notes

- Keep PyTorch `2.8.0+cu128`; do not let PersonaPlex dependencies downgrade it.
- Install PersonaPlex/Moshi with `--no-deps`.
- The live path captures PersonaPlex hidden states directly; it does not re-encode generated audio.
- `checkpoints/` is intentionally not committed to Git.
