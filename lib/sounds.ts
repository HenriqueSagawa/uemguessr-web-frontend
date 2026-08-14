"use client";

type SoundName =
  | "confirm"
  | "tick"
  | "timeout"
  | "opponent"
  | "damage"
  | "win"
  | "lose"
  | "score"
  | "roundStart"
  | "roundEnd"
  | "found"
  | "countdown";

let audioCtx: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function preloadSounds() {
  getContext();
}

function playTone(
  type: OscillatorType,
  freq1: number,
  freq2: number | null,
  duration: number,
  gain: number,
  startTimeOffset = 0
) {
  const ctx = getContext();
  if (!ctx) return;

  const t = ctx.currentTime + startTimeOffset;
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;

  if (freq2) {
    osc.frequency.setValueAtTime(freq1, t);
    osc.frequency.linearRampToValueAtTime(freq2, t + duration);
  } else {
    osc.frequency.value = freq1;
  }

  gainNode.gain.setValueAtTime(0, t);
  // Attack
  gainNode.gain.linearRampToValueAtTime(gain, t + duration * 0.1);
  // Sustain
  gainNode.gain.setValueAtTime(gain, t + duration * 0.8);
  // Release
  gainNode.gain.linearRampToValueAtTime(0, t + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(t);
  osc.stop(t + duration);
}

export function playSound(name: SoundName) {
  switch (name) {
    case "confirm":
      playTone("sine", 600, 900, 0.1, 0.3);
      break;
    case "tick":
      playTone("square", 800, null, 0.05, 0.15);
      break;
    case "timeout":
      playTone("sawtooth", 600, 200, 0.4, 0.4);
      break;
    case "opponent":
      playTone("sine", 440, null, 0.08, 0.25, 0);
      playTone("sine", 550, null, 0.08, 0.25, 0.1);
      break;
    case "damage":
      playTone("sine", 150, 80, 0.3, 0.5);
      break;
    case "win":
      // C5(523) E5(659) G5(784) C6(1046)
      playTone("sine", 523, null, 0.15, 0.3, 0);
      playTone("sine", 659, null, 0.15, 0.3, 0.15);
      playTone("sine", 784, null, 0.15, 0.3, 0.3);
      playTone("sine", 1046, null, 0.15, 0.3, 0.45);
      break;
    case "lose":
      // C5(523) B4(493) G4(392) E4(329)
      playTone("sine", 523, null, 0.15, 0.3, 0);
      playTone("sine", 493, null, 0.15, 0.3, 0.15);
      playTone("sine", 392, null, 0.15, 0.3, 0.3);
      playTone("sine", 329, null, 0.15, 0.3, 0.45);
      break;
    case "score":
      playTone("triangle", 400, 800, 0.08, 0.2);
      break;
    case "roundStart":
      playTone("sine", 300, 600, 0.2, 0.3);
      break;
    case "roundEnd":
      playTone("sine", 660, null, 0.2, 0.3, 0);
      playTone("sine", 440, null, 0.2, 0.3, 0.2);
      break;
    case "found":
      // aviso de adversário encontrado (G4 C5 G5)
      playTone("sine", 392, null, 0.12, 0.3, 0);
      playTone("sine", 523, null, 0.12, 0.3, 0.12);
      playTone("sine", 784, null, 0.14, 0.3, 0.24);
      break;
    case "countdown":
      playTone("square", 880, null, 0.08, 0.2);
      break;
  }
}
