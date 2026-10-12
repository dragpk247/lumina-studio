export interface AudioTrackConfig {
  id: string;
  name: string;
  duration: number; // in seconds
  volume: number;
}

export class AudioEngine {
  private audioCtx: AudioContext | null = null;
  public isPlaying: boolean = false;
  public currentPlayhead: number = 0; // seconds

  constructor() {
    // AudioContext is initialized on first user gesture
  }

  public init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
  }

  public getAudioContext(): AudioContext | null {
    return this.audioCtx;
  }

  /**
   * Generates synthetic waveform audio buffer data for scrubbing visualization
   */
  public generateWaveformPoints(_clipDuration: number = 10, pointCount: number = 200): number[] {
    const points: number[] = [];
    let phase = 0;
    for (let i = 0; i < pointCount; i++) {
      phase += 0.2;
      // Synthesize realistic audio energy bursts & pauses
      const amp = Math.sin(i * 0.1) * 0.4 + Math.sin(phase) * 0.3 + (Math.random() * 0.3);
      points.push(Math.max(0.05, Math.min(1.0, Math.abs(amp))));
    }
    return points;
  }

  /**
   * Generates a scrub tone audio preview when dragging playhead
   */
  public playScrubTone(frequency: number = 440, duration: number = 0.05) {
    if (!this.audioCtx) this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }
}
