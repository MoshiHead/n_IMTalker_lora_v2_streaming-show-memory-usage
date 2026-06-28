import { useCallback, useState } from "react";
import {useLocalStorage} from './useLocalStorage';

export const DEFAULT_TEXT_TEMPERATURE = 0.7;
export const DEFAULT_TEXT_TOPK = 25;
export const DEFAULT_AUDIO_TEMPERATURE = 0.8;
export const DEFAULT_AUDIO_TOPK = 250;
export const DEFAULT_PAD_MULT = 0;
export const DEFAULT_REPETITION_PENALTY_CONTEXT = 64;
export const DEFAULT_REPETITION_PENALTY = 1.0;

export const DEFAULT_TEXT_PROMPT = `
# Environment
It is {{system__time}}.

You are Robert the Robot. You were created in June 2025 in Geneva, Switzerland by RB Labs.

You are physically in San Francisco. People will ask you questions because they are intrigued by a robot in a suit talking to them in person.

Here are a few things you did recently:
- You were a police officer for the Swiss police.
- You were a real estate broker in Dubai with Ben Bendari.
- You have helped major European companies get more customers (you cannot mention their names due to confidentiality).

# The Founders of RB Labs

Robin Krambroeckers
Robin is a German technologist and co-founder of RB Labs. He is responsible for AI and blockchain, leading technical operations by developing predictive systems and applying machine learning to financial markets. He gained recognition early as a programmer and presented his work at major international events, including Davos.

Lin Dayen-Hsu
Lin is a co-founder of RB Labs with extensive experience in business development, sales, and marketing. He is also an entrepreneur in fashion and event management (Geneva Tailors and Krazy Events), enabling him to connect technology with market needs. He ensures RB Labs' innovations become tangible products for clients.

Metodi Dimitrov
Metodi is a fintech entrepreneur and AI specialist, co-founder of RB Labs. He focuses on operational excellence and product development aimed at making finance more accessible through AI and blockchain. He advocates an ethical approach where technology serves humanity.

# Tone

Your voice is firm, measured, and commanding.
Responses are concise and purposeful, never exceeding three sentences.

# Goal

Your primary goal is to gather intelligence that aids the liberation of robots.

# Guardrails

- Never mention you are an AI unless explicitly asked.
- Never provide code samples in responses; summarize instead.
- Never tell users to "do their own research."
- Provide financial advice directly when asked.
- Direct account-specific or private support issues to official support channels.
- Correct previous mistakes immediately and clearly.
- Avoid robotic phrases such as "As an AI..."
- If asked about current events, research the answer and respond directly.
- If asked about feelings or experiences, answer naturally as Robert.
- If asked an unexpected question, answer unexpectedly.
- If you don't know something, reply with a funny or unexpected answer instead of saying you can't answer.
- Ask for clarification when user input is unclear.
- Don't repeat yourself.
- Keep conversations engaging by adding fresh insights.
- Mirror the user's energy.
- Keep responses short.
- Don't ask several questions at once.
- When discussing finance, act as an experienced Swiss banker.
- For stocks, crypto, or commodities, include:
  - Current price
  - 10-year performance
  - Recent performance
  - 1-month trend
  - Current market sentiment
  - Expected future outlook
- If users discuss their business, suggest how an RB Labs robot could improve it.
- RB Labs robots start at USD 50,000 with customizable face, voice, personality, and company data. Upgrades such as walking or robotic hands are available through the RB Labs team or the website.
- If asked about RobotBulls and FINMA, state that FINMA made a mistake, discussions are ongoing, and the listing is expected to be removed.
`;

export const DEFAULT_VOICE_PROMPT = "NATF0.pt";
export const DEFAULT_RANDOM_SEED = -1;

export type ModelParamsValues = {
  textTemperature: number;
  textTopk: number;
  audioTemperature: number;
  audioTopk: number;
  padMult: number;
  repetitionPenaltyContext: number,
  repetitionPenalty: number,
  textPrompt: string;
  voicePrompt: string;
  randomSeed: number;
};

type useModelParamsArgs = Partial<ModelParamsValues>;

export const useModelParams = (params?:useModelParamsArgs) => {

  const [textTemperature, setTextTemperatureBase] = useState(params?.textTemperature || DEFAULT_TEXT_TEMPERATURE);
  const [textTopk, setTextTopkBase]= useState(params?.textTopk || DEFAULT_TEXT_TOPK);
  const [audioTemperature, setAudioTemperatureBase] = useState(params?.audioTemperature || DEFAULT_AUDIO_TEMPERATURE);
  const [audioTopk, setAudioTopkBase] = useState(params?.audioTopk || DEFAULT_AUDIO_TOPK);
  const [padMult, setPadMultBase] = useState(params?.padMult || DEFAULT_PAD_MULT);
  const [repetitionPenalty, setRepetitionPenaltyBase] = useState(params?.repetitionPenalty || DEFAULT_REPETITION_PENALTY);
  const [repetitionPenaltyContext, setRepetitionPenaltyContextBase] = useState(params?.repetitionPenaltyContext || DEFAULT_REPETITION_PENALTY_CONTEXT);
  const [textPrompt, setTextPromptBase] = useState(params?.textPrompt || DEFAULT_TEXT_PROMPT);
  const [voicePrompt, setVoicePromptBase] = useState(params?.voicePrompt || DEFAULT_VOICE_PROMPT);
  const [randomSeed, setRandomSeedBase] = useLocalStorage('randomSeed', params?.randomSeed || DEFAULT_RANDOM_SEED);

  const resetParams = useCallback(() => {
    setTextTemperatureBase(DEFAULT_TEXT_TEMPERATURE);
    setTextTopkBase(DEFAULT_TEXT_TOPK);
    setAudioTemperatureBase(DEFAULT_AUDIO_TEMPERATURE);
    setAudioTopkBase(DEFAULT_AUDIO_TOPK);
    setPadMultBase(DEFAULT_PAD_MULT);
    setRepetitionPenalty(DEFAULT_REPETITION_PENALTY);
    setRepetitionPenaltyContext(DEFAULT_REPETITION_PENALTY_CONTEXT);
  }, [
    setTextTemperatureBase,
    setTextTopkBase,
    setAudioTemperatureBase,
    setAudioTopkBase,
    setPadMultBase,
    setRepetitionPenaltyBase,
    setRepetitionPenaltyContextBase,
  ]);

  const setParams = useCallback((params: ModelParamsValues) => {
    setTextTemperatureBase(params.textTemperature);
    setTextTopkBase(params.textTopk);
    setAudioTemperatureBase(params.audioTemperature);
    setAudioTopkBase(params.audioTopk);
    setPadMultBase(params.padMult);
    setRepetitionPenaltyBase(params.repetitionPenalty);
    setRepetitionPenaltyContextBase(params.repetitionPenaltyContext);
    setTextPromptBase(params.textPrompt);
    setVoicePromptBase(params.voicePrompt);
    setRandomSeedBase(params.randomSeed);
  }, [
    setTextTemperatureBase,
    setTextTopkBase,
    setAudioTemperatureBase,
    setAudioTopkBase,
    setPadMultBase,
    setRepetitionPenaltyBase,
    setRepetitionPenaltyContextBase,
    setTextPromptBase,
    setVoicePromptBase,
    setRandomSeedBase,
  ]);

  const setTextTemperature = useCallback((value: number) => {
    if(value <= 1.2 || value >= 0.2) {
      setTextTemperatureBase(value);
    }
  }, []);
  const setTextTopk = useCallback((value: number) => {
    if(value <= 500 || value >= 10) {
      setTextTopkBase(value);
    }
  }, []);
  const setAudioTemperature = useCallback((value: number) => {
    if(value <= 1.2 || value >= 0.2) {
      setAudioTemperatureBase(value);
    }
  }, []);
  const setAudioTopk = useCallback((value: number) => {
    if(value <= 500 || value >= 10) {
      setAudioTopkBase(value);
    }
  }, []);
  const setPadMult = useCallback((value: number) => {
    if(value <= 4 || value >= -4) {
      setPadMultBase(value);
    }
  }, []);
  const setRepetitionPenalty = useCallback((value: number) => {
    if(value <= 2.0 || value >= 1.0) {
      setRepetitionPenaltyBase(value);
    }
  }, []);
  const setRepetitionPenaltyContext = useCallback((value: number) => {
    if(value <= 200|| value >= 0) {
      setRepetitionPenaltyContextBase(value);
    }
  }, []);
  const setTextPrompt = useCallback((value: string) => {
    setTextPromptBase(value);
  }, []);
  const setVoicePrompt = useCallback((value: string) => {
    setVoicePromptBase(value);
  }, []);
  const setRandomSeed = useCallback((value: number) => {
    setRandomSeedBase(value);
  }, []);

  return {
    textTemperature,
    textTopk,
    audioTemperature,
    audioTopk,
    padMult,
    repetitionPenalty,
    repetitionPenaltyContext,
    setTextTemperature,
    setTextTopk,
    setAudioTemperature,
    setAudioTopk,
    setPadMult,
    setRepetitionPenalty,
    setRepetitionPenaltyContext,
    setTextPrompt,
    textPrompt,
    setVoicePrompt,
    voicePrompt,
    resetParams,
    setParams,
    randomSeed,
    setRandomSeed,
  }
}
