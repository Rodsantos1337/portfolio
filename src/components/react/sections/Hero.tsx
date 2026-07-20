import { useEffect, useRef } from "react";
import gsap from "gsap";
import LazyVideo from "../ui/LazyVideo";
import RevealText from "../ui/RevealText";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!container || !row1 || !row2) return;

    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isReduced) {
      gsap.set(container, { opacity: 1 });
      gsap.set([row1, row2], { yPercent: 0 });
      return;
    }

    gsap.set([row1, row2], { yPercent: 115 });

    const tl = gsap.timeline();

    tl.to(container, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    })
      .to(
        row1,
        {
          yPercent: 0,
          duration: 1.2,
          ease: "power4.out",
        },
        "-=0.1"
      )
      .to(
        row2,
        {
          yPercent: 0,
          duration: 1.2,
          ease: "power4.out",
        },
        "-=0.8"
      );
  }, []);

  return (
    <section
      className="h-[calc(100vh-var(--marquee-h))] relative flex flex-col items-center justify-center pt-20 pb-12 md:pt-24 md:pb-16 px-4 md:px-6 overflow-hidden z-10"
      id="hero"
    >
      {/* Background Video (lazy playing when in viewport) */}
      <LazyVideo
        src="/hero-bg.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-15 pointer-events-none"
      />

      {/* Content Container */}
      <div
        ref={containerRef}
        className="text-center flex flex-col items-center max-w-7xl relative z-10 hero-fade"
        id="heroContent"
      >
        {/* Name Row 1: RODRIG + avatar "O" — slides up as a single unit.
            The overflow-hidden mask wrapper clips the content before reveal. */}
        <div className="hero-line overflow-hidden px-2 py-2 md:py-3 mb-2 w-full">
          <h1
            ref={row1Ref}
            className="font-clash font-bold text-[clamp(2.4rem,12vw,10rem)] md:text-[clamp(3.8rem,14vw,12.5rem)] leading-[0.85] tracking-wide flex items-center justify-center select-none text-brandText will-change-transform"
          >
            {"RODRIG".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block transition-colors duration-300 ease-out hover:text-brandGreen cursor-default"
              >
                {char}
              </span>
            ))}
            <span className="hero-char-mask relative w-[0.78em] h-[0.78em] mx-[0.03em] rounded-full overflow-hidden cursor-pointer inline-block transition-all duration-300 ease-out hover:ring-2 hover:ring-brandGreen">
              <img
                src="/rodrigo-santos.jpeg"
                alt="O"
                className="w-full h-full object-cover rounded-full select-none"
              />
            </span>
          </h1>
        </div>

        {/* Name Row 2: SANTOS — slides up as a single unit. */}
        <div className="hero-line overflow-hidden px-2 py-2 md:py-3 mb-6 w-full">
          <h2
            ref={row2Ref}
            className="font-clash font-light text-[clamp(1.8rem,8vw,7.5rem)] md:text-[clamp(2.8rem,10vw,9.5rem)] leading-[0.85] tracking-wide flex items-center justify-center select-none text-brandText will-change-transform"
          >
            {"SANTOS".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block transition-colors duration-300 ease-out hover:text-brandGreen cursor-default"
              >
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* Subtitle description — each line mask-reveals after the name animation. */}
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6 mt-4 px-4">
          <RevealText
            as="p"
            mode="line"
            playOnMount
            delay={1.3}
            stagger={0.08}
            duration={1.0}
            className="text-brandTextMuted text-base md:text-lg leading-relaxed font-normal"
            text="Designing and building high-fidelity marketing sites and interactive digital experiences."
          />
        </div>
      </div>
    </section>
  );
}
