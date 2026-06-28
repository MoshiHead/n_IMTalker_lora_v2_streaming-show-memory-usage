#!/usr/bin/env bash
set -euo pipefail

ROOT="${SPEECH2AVATAR_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
IMTALKER_DIR="${IMTALKER_DIR:-$ROOT/IMTalker}"
CHECKPOINT_DIR="${CHECKPOINT_DIR:-$ROOT/checkpoints}"
VENV="${VENV:-/workspace/preprocess_5090}"

cd "$IMTALKER_DIR"
if [[ -f "$VENV/bin/activate" ]]; then
  source "$VENV/bin/activate"
fi

export PYTHONPATH="$IMTALKER_DIR:${PYTHONPATH:-}"
export CUDA_VISIBLE_DEVICES="${CUDA_VISIBLE_DEVICES:-0}"
export PYTORCH_CUDA_ALLOC_CONF="${PYTORCH_CUDA_ALLOC_CONF:-expandable_segments:True}"

VOICE_ARGS=()
if [[ -n "${VOICE_PROMPT:-}" ]]; then
  VOICE_ARGS+=(--voice_prompt "$VOICE_PROMPT")
  if [[ -n "${VOICE_PROMPT_DIR:-}" ]]; then
    VOICE_ARGS+=(--voice_prompt_dir "$VOICE_PROMPT_DIR")
  fi
fi

python -u liveTryHeliumFrontendDequeStaticPoseFP32FM_ws_binary.py \
  --host "${HOST:-0.0.0.0}" \
  --port "${PORT:-8998}" \
  --device "${DEVICE:-cuda}" \
  --html_path "$IMTALKER_DIR/static/index_v3_binary_fullscreen.html" \
  --ref_path "${REF_PATH:-$IMTALKER_DIR/assets/3robert.jpeg}" \
  --renderer_path "${RENDERER_PATH:-$IMTALKER_DIR/checkpoints/renderer.ckpt}" \
  --generator_path "${GENERATOR_PATH:-$IMTALKER_DIR/checkpoints/generator.ckpt}" \
  --lora_generator_path "${LORA_GENERATOR_PATH:-$CHECKPOINT_DIR/lora/ditto_blink_lora_withaudio_r64_1h_last.ckpt}" \
  --lora_rank "${LORA_RANK:-64}" \
  --lora_alpha "${LORA_ALPHA:-128}" \
  --lora_dropout "${LORA_DROPOUT:-0.05}" \
  --wav2vec_model_path "${WAV2VEC_MODEL_PATH:-$IMTALKER_DIR/checkpoints/wav2vec2-base-960h}" \
  --adapter_path "${ADAPTER_PATH:-$CHECKPOINT_DIR/personaplex_helium_w2v_frontend_adapter/checkpoints/phase2_best_wav2vec_final_loss.pt}" \
  --adapter_num_layers "${ADAPTER_NUM_LAYERS:-6}" \
  --adapter_dropout "${ADAPTER_DROPOUT:-0.1}" \
  --enable_moshi_reply \
  --direct_reply_hidden \
  --moshi_root "${MOSHI_ROOT:-$CHECKPOINT_DIR/personaplex_bnb4}" \
  --mimi_hf_repo "${MIMI_HF_REPO:-nvidia/personaplex-7b-v1}" \
  --moshi_weight "${MOSHI_WEIGHT:-$CHECKPOINT_DIR/personaplex_bnb4/model_bnb_4bit.pt}" \
  --quantize_4bit \
  --num_codebooks "${NUM_CODEBOOKS:-8}" \
  --moshi_reply_device "${MOSHI_REPLY_DEVICE:-cuda}" \
  --moshi_cfg_coef "${MOSHI_CFG_COEF:-1.0}" \
  "${VOICE_ARGS[@]}" \
  --text_prompt "${TEXT_PROMPT:-You are a helpful person answering questions properly.}" \
  --a_cfg_scale "${A_CFG_SCALE:-2.0}" \
  --nfe "${NFE:-5}" \
  --wav2vec_sec "${WAV2VEC_SEC:-0.96}" \
  --audio_chunk_sec "${AUDIO_CHUNK_SEC:-0.96}" \
  --fm_chunk_frames "${FM_CHUNK_FRAMES:-24}" \
  --reply_hidden_steps_per_chunk "${REPLY_HIDDEN_STEPS_PER_CHUNK:-0}" \
  --prebuffer_chunks "${PREBUFFER_CHUNKS:-1}" \
  --frame_q_backpressure "${FRAME_Q_BACKPRESSURE:-160}" \
  --render_sub_batch "${RENDER_SUB_BATCH:-8}" \
  --jpeg_quality "${JPEG_QUALITY:-58}" \
  --reply_audio_gain "${REPLY_AUDIO_GAIN:-1.0}" \
  --shared_noise \
  --noise_seed "${NOISE_SEED:-42}" \
  --noise_max_frames "${NOISE_MAX_FRAMES:-5000}" \
  --fp32 \
  --tf32 \
  --dump_motion \
  --dump_dir "${DUMP_DIR:-$IMTALKER_DIR/live_try_dumps_withaudio_blink}" \
  --enable_eye_blink_composite \
  --blink_motion_path "${BLINK_MOTION_PATH:-$CHECKPOINT_DIR/lora/3robert_audio3_ditto_static_motion.pt}" \
  --eye_left_x "${EYE_LEFT_X:-0.36}" \
  --eye_right_x "${EYE_RIGHT_X:-0.64}" \
  --eye_center_y "${EYE_CENTER_Y:-0.405}" \
  --eye_radius_x "${EYE_RADIUS_X:-0.145}" \
  --eye_radius_y "${EYE_RADIUS_Y:-0.070}" \
  --eye_feather "${EYE_FEATHER:-0.10}"
