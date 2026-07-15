import { useEffect, useRef } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
}

/**
 * A performance-oriented video component that only plays when in the viewport.
 * Uses IntersectionObserver to pause the video when scrolled out of view,
 * saving CPU/GPU decoding overhead and RAM.
 */
export default function LazyVideo({ src, className = "" }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Browser policies might block autoplay until user interaction
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.01 } // Trigger as soon as 1% is visible
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      preload="none" // Prevent downloading bytes until component mounts
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
