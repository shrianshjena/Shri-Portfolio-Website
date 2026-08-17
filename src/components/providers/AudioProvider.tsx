"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import {
  AUDIO_FADE_S,
  AUDIO_PREF_KEY,
  AUDIO_TARGET_VOLUME,
} from "@/lib/constants";
import { SITE } from "@/content/site";
import type { AudioTrack } from "@/content/types";

/*
 * One hidden <audio preload="none"> for the whole site. Playback starts only
 * from a user gesture (iOS policy); play/pause fade via a GSAP volume tween;
 * tracks auto-advance cyclically. The stored preference only styles the
 * toggle on revisit, it never autoplays.
 */
interface AudioContextValue {
  readonly isPlaying: boolean;
  readonly track: AudioTrack;
  readonly trackIndex: number;
  readonly trackCount: number;
  readonly toggle: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);
const TRACKS = SITE.audio;

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const fadeTo = useCallback((volume: number, onComplete?: () => void) => {
    const el = audioRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.to(el, {
      volume,
      duration: AUDIO_FADE_S,
      ease: "power1.inOut",
      onComplete,
    });
  }, []);

  const play = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0;
    el.play()
      .then(() => {
        setIsPlaying(true);
        fadeTo(AUDIO_TARGET_VOLUME);
      })
      .catch(() => setIsPlaying(false));
  }, [fadeTo]);

  const pause = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    setIsPlaying(false);
    fadeTo(0, () => el.pause());
  }, [fadeTo]);

  const toggle = useCallback(() => {
    const next = !isPlaying;
    try {
      localStorage.setItem(AUDIO_PREF_KEY, next ? "on" : "off");
    } catch {
      /* storage unavailable (private mode); preference simply not saved */
    }
    if (next) {
      play();
    } else {
      pause();
    }
  }, [isPlaying, play, pause]);

  const handleEnded = useCallback(() => {
    setTrackIndex((index) => (index + 1) % TRACKS.length);
  }, []);

  const wasPlayingRef = useRef(false);
  useEffect(() => {
    wasPlayingRef.current = isPlaying;
  }, [isPlaying]);

  /* When the track changes while playing, load the new source and continue. */
  const previousIndexRef = useRef(trackIndex);
  useEffect(() => {
    if (previousIndexRef.current === trackIndex) return;
    previousIndexRef.current = trackIndex;
    const el = audioRef.current;
    if (!el || !wasPlayingRef.current) return;
    el.load();
    play();
  }, [trackIndex, play]);

  const value = useMemo(
    () => ({
      isPlaying,
      track: TRACKS[trackIndex],
      trackIndex,
      trackCount: TRACKS.length,
      toggle,
    }),
    [isPlaying, trackIndex, toggle],
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={TRACKS[trackIndex].src}
        preload="none"
        onEnded={handleEnded}
      />
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used inside AudioProvider");
  }
  return context;
}
