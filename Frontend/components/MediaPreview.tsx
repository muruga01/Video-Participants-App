"use client";

import { useEffect, useRef, useState } from "react";

type MediaPreviewProps = {
  micEnabled: boolean;
  cameraEnabled: boolean;
};

export default function MediaPreview({
  micEnabled,
  cameraEnabled,
}: MediaPreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioBarRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [permissionError, setPermissionError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function setupMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: cameraEnabled,
          audio: micEnabled,
        });

        if (!isMounted) return;

        streamRef.current = stream;

        if (videoRef.current && cameraEnabled) {
          videoRef.current.srcObject = stream;
        }

        if (micEnabled) {
          const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!AudioCtx) return;

          const audioContext = new AudioCtx();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);

          analyser.fftSize = 64;
          source.connect(analyser);

          audioContextRef.current = audioContext;
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateMeter = () => {
            if (!analyserRef.current || !audioBarRef.current) return;

            analyserRef.current.getByteFrequencyData(dataArray);
            const avg =
              dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

            audioBarRef.current.style.width = `${Math.min(100, avg)}%`;
            animationFrameRef.current = requestAnimationFrame(updateMeter);
          };

          updateMeter();
        }
      } catch {
        if (isMounted) {
          setPermissionError("Could not access webcam or microphone.");
        }
      }
    }

    setupMedia();

    return () => {
      isMounted = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [micEnabled, cameraEnabled]);

  return (
    <div className="mediaPreviewWrapper">
      {permissionError ? (
        <div className="videoPlaceholder off">{permissionError}</div>
      ) : cameraEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="liveVideo"
        />
      ) : (
        <div className="videoPlaceholder off">Camera Off</div>
      )}

      <div className="audioMeter">
        <span>Audio Level</span>
        <div className="audioMeterTrack">
          <div ref={audioBarRef} className="audioMeterBar" />
        </div>
      </div>
    </div>
  );
}