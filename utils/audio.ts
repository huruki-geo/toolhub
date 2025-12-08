// Audio Utility to play sounds without external files

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Call this on user interaction (e.g., Start button) to unlock audio on iOS/Android
export const unlockAudio = () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  // Play a tiny silent buffer to unlock
  const buffer = ctx.createBuffer(1, 1, 22050);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start(0);
};

export const playDefaultAlarm = () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
      ctx.resume();
  }
  
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  // "Pi-Pi-Pi-Pi" Sound
  osc.type = 'square';
  
  // 4 beeps
  const now = t;
  const beepLength = 0.08;
  const interval = 0.15;

  // We schedule values on the Gain Node to create pulses
  // Initial silence
  gain.gain.setValueAtTime(0, now);

  // Beep 1
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.setValueAtTime(0, now + beepLength);

  // Beep 2
  gain.gain.setValueAtTime(0.1, now + interval);
  gain.gain.setValueAtTime(0, now + interval + beepLength);

  // Beep 3
  gain.gain.setValueAtTime(0.1, now + interval * 2);
  gain.gain.setValueAtTime(0, now + interval * 2 + beepLength);
  
  // Beep 4
  gain.gain.setValueAtTime(0.1, now + interval * 3);
  gain.gain.setValueAtTime(0, now + interval * 3 + beepLength);

  osc.frequency.setValueAtTime(880, now); // A5

  osc.start(now);
  osc.stop(now + interval * 4);
};

// Play a single tick sound (e.g. for seconds) - Optional usage
export const playTick = () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
};