#!/usr/bin/env bash
set -euo pipefail

ROOT="${SPEECH2AVATAR_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
IMTALKER_DIR="${IMTALKER_DIR:-$ROOT/IMTalker}"
CHECKPOINT_DIR="${CHECKPOINT_DIR:-$ROOT/checkpoints}"
PERSONAPLEX_BNB4_DIR="${PERSONAPLEX_BNB4_DIR:-$ROOT/checkpoints/personaplex_bnb4}"

export HF_HUB_ENABLE_HF_TRANSFER="${HF_HUB_ENABLE_HF_TRANSFER:-1}"

mkdir -p "$IMTALKER_DIR/checkpoints" "$CHECKPOINT_DIR" "$PERSONAPLEX_BNB4_DIR"

echo "[1/5] Downloading IMTalker pretrained renderer/generator/wav2vec files..."
for f in \
  config.yaml \
  renderer.ckpt \
  generator.ckpt \
  wav2vec2-base-960h/config.json \
  wav2vec2-base-960h/pytorch_model.bin \
  wav2vec2-base-960h/preprocessor_config.json \
  wav2vec2-base-960h/feature_extractor_config.json
do
  hf download cbsjtu01/IMTalker "$f" --local-dir "$IMTALKER_DIR/checkpoints"
done

echo "[2/5] Downloading PersonaPlex Helium->Wav2Vec adapter checkpoint..."
hf download niloy629/hdtf_preprocess \
  personaplex_helium_w2v_frontend_adapter/checkpoints/phase2_best_wav2vec_final_loss.pt \
  --repo-type dataset \
  --local-dir "$CHECKPOINT_DIR"

echo "[3/5] Downloading static-head LoRA generator checkpoint..."
hf download niloy629/hdtf_preprocess \
  lora/ditto_blink_lora_withaudio_r64_1h_last.ckpt \
  --repo-type dataset \
  --local-dir "$CHECKPOINT_DIR"

echo "[4/5] Downloading cached blink motion..."
hf download niloy629/hdtf_preprocess \
  lora/3robert_audio3_ditto_static_motion.pt \
  --repo-type dataset \
  --local-dir "$CHECKPOINT_DIR"

echo "[5/5] Downloading PersonaPlex bnb4 weights..."
hf download brianmatzelle/personaplex-7b-v1-bnb-4bit \
  --local-dir "$PERSONAPLEX_BNB4_DIR"

echo
echo "Done. Key paths:"
echo "  renderer: $IMTALKER_DIR/checkpoints/renderer.ckpt"
echo "  generator: $IMTALKER_DIR/checkpoints/generator.ckpt"
echo "  wav2vec: $IMTALKER_DIR/checkpoints/wav2vec2-base-960h"
echo "  adapter: $CHECKPOINT_DIR/personaplex_helium_w2v_frontend_adapter/checkpoints/phase2_best_wav2vec_final_loss.pt"
echo "  lora: $CHECKPOINT_DIR/lora/ditto_blink_lora_withaudio_r64_1h_last.ckpt"
echo "  blink motion: $CHECKPOINT_DIR/lora/3robert_audio3_ditto_static_motion.pt"
echo "  PersonaPlex bnb4: $PERSONAPLEX_BNB4_DIR"
