import { VideoClip } from '../types';
import { AudioEngine } from './audioEngine';

export interface TimelineTrack {
  id: string;
  type: 'video' | 'audio';
  name: string;
}

export class TimelineController {
  private clips: VideoClip[];
  private tracks: TimelineTrack[];
  private duration: number; // total duration in seconds (e.g. 30s)
  private currentTime: number = 0;
  private isPlaying: boolean = false;
  private playheadRafId: number | null = null;
  private lastRafTime: number = 0;
  public pixelsPerSecond: number = 50; // zoom level
  private audioEngine: AudioEngine;
  private onTimeUpdateCallback?: (time: number) => void;
  private onStateChangeCallback?: () => void;

  constructor(clips: VideoClip[], audioEngine: AudioEngine, duration: number = 30) {
    this.clips = clips;
    this.audioEngine = audioEngine;
    this.duration = duration;
    this.tracks = [
      { id: 'v1', type: 'video', name: 'Video 1' },
      { id: 'v2', type: 'video', name: 'Video 2' },
      { id: 'a1', type: 'audio', name: 'Audio 1' },
      { id: 'a2', type: 'audio', name: 'Audio 2' },
    ];
  }

  public setOnTimeUpdate(cb: (time: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public setOnStateChange(cb: () => void) {
    this.onStateChangeCallback = cb;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public setCurrentTime(time: number, triggerAudioTone: boolean = false) {
    this.currentTime = Math.max(0, Math.min(this.duration, time));
    if (triggerAudioTone) {
      // Harmonic scrub pitch shifting based on timeline position
      const freq = 220 + (this.currentTime % 4) * 80;
      this.audioEngine.playScrubTone(freq, 0.04);
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime);
    }
  }

  public getDuration(): number {
    return this.duration;
  }

  public getClips(): VideoClip[] {
    return this.clips;
  }

  public getTracks(): TimelineTrack[] {
    return this.tracks;
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.audioEngine.init();
    this.lastRafTime = performance.now();

    const loop = (now: number) => {
      if (!this.isPlaying) return;
      const deltaSeconds = (now - this.lastRafTime) / 1000;
      this.lastRafTime = now;

      this.currentTime += deltaSeconds;
      if (this.currentTime >= this.duration) {
        this.currentTime = 0; // loop
      }

      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTime);
      }

      this.playheadRafId = requestAnimationFrame(loop);
    };

    this.playheadRafId = requestAnimationFrame(loop);
    if (this.onStateChangeCallback) this.onStateChangeCallback();
  }

  public pause() {
    this.isPlaying = false;
    if (this.playheadRafId !== null) {
      cancelAnimationFrame(this.playheadRafId);
      this.playheadRafId = null;
    }
    if (this.onStateChangeCallback) this.onStateChangeCallback();
  }

  public isPlaybackActive(): boolean {
    return this.isPlaying;
  }

  /**
   * Razor cut clip at current playhead position
   */
  public razorCutAtPlayhead(): boolean {
    const time = this.currentTime;
    const clipIndex = this.clips.findIndex(
      c => time > c.startTime && time < (c.startTime + c.duration)
    );

    if (clipIndex === -1) return false;

    const targetClip = this.clips[clipIndex];
    const firstDuration = time - targetClip.startTime;
    const secondDuration = targetClip.duration - firstDuration;

    // Mutate first clip
    targetClip.duration = firstDuration;

    // Create split piece
    const newClip: VideoClip = {
      id: 'clip_' + Math.random().toString(36).substring(2, 9),
      trackId: targetClip.trackId,
      name: `${targetClip.name} (Cut)`,
      startTime: time,
      duration: secondDuration,
      color: targetClip.color,
    };

    this.clips.splice(clipIndex + 1, 0, newClip);
    if (this.onStateChangeCallback) this.onStateChangeCallback();
    return true;
  }

  /**
   * Format seconds to standard SMPTE timecode (HH:MM:SS:FF at 30fps)
   */
  public static formatTimecode(seconds: number, fps: number = 30): string {
    const totalFrames = Math.floor(seconds * fps);
    const ff = String(totalFrames % fps).padStart(2, '0');
    const s = Math.floor(seconds) % 60;
    const ss = String(s).padStart(2, '0');
    const m = Math.floor(seconds / 60) % 60;
    const mm = String(m).padStart(2, '0');
    const h = Math.floor(seconds / 3600);
    const hh = String(h).padStart(2, '0');
    return `${hh}:${mm}:${ss}:${ff}`;
  }
}
