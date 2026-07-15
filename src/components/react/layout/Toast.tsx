import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toast = toastRef.current;
    if (!toast) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (message) {
      setVisible(true);
      requestAnimationFrame(() => {
        if (isReduced) {
          gsap.set(toast, { opacity: 1, y: 0 });
        } else {
          gsap.fromTo(
            toast,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
          );
        }
      });
    } else if (visible) {
      const tl = gsap.to(toast, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setVisible(false),
      });
      // Skip animation for reduced motion
      if (isReduced) {
        tl.progress(1).kill();
        setVisible(false);
      }
    }
  }, [message, visible]);

  if (!visible && !message) return null;

  return (
    <div
      ref={toastRef}
      className="fixed bottom-8 left-1/2 z-[10000] bg-bgSurface border border-brandGreen/30 text-brandText px-6 py-4 shadow-2xl flex items-center gap-3 text-sm font-sans pointer-events-none"
      style={{
        borderRadius: "14px",
        transform: "translateX(-50%)",
        opacity: 0,
      }}
    >
      <div className="w-2 h-2 rounded-full bg-brandGreen animate-ping" />
      <span>{message}</span>
    </div>
  );
}