import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

interface Props {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  mode?: "char" | "word" | "line";
  stagger?: number;
  delay?: number;
  duration?: number;
  className?: string;
  charsClassName?: string;
  wordsClassName?: string;
  linesClassName?: string;
  playOnMount?: boolean;
  children?: ReactNode;
}

export default function RevealText({
  text,
  as: Tag = "span",
  mode = "char",
  stagger = 0.05,
  delay = 0,
  duration = 1.2,
  className = "",
  charsClassName = "",
  wordsClassName = "",
  linesClassName = "",
  playOnMount = false,
  children,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const splitRef = useRef<SplitText | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const splitType = mode === "word" ? "words" : mode === "line" ? "lines" : "chars";
    const splitClass = mode === "word"
      ? `reveal-word ${wordsClassName}`.trim()
      : mode === "line"
      ? `reveal-line ${linesClassName}`.trim()
      : `reveal-char ${charsClassName}`.trim();

    splitRef.current = SplitText.create(container, {
      type: splitType,
      [splitType + "Class"]: splitClass,
      mask: splitType,
    });

    const masks = (splitRef.current as any).masks;
    const elements = mode === "word"
      ? splitRef.current.words
      : mode === "line"
      ? splitRef.current.lines
      : splitRef.current.chars;

    if (masks && masks.length) {
      masks.forEach((mask: HTMLElement) => {
        mask.style.overflow = "hidden";
      });
    }

    if (isReduced) {
      gsap.set(elements, { yPercent: 0 });
    } else {
      gsap.set(elements, { yPercent: 115 });

      const tl = gsap.timeline(
        !playOnMount
          ? {
              scrollTrigger: {
                trigger: container,
                start: "top 88%",
                once: true,
              },
            }
          : undefined
      );

      tl.to(elements, {
        yPercent: 0,
        duration,
        ease: "power3.out",
        stagger,
        delay,
      });
    }

    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
      }
    };
  }, [text, mode, stagger, delay, duration, charsClassName, wordsClassName, linesClassName, playOnMount]);

  const Component = Tag as keyof JSX.IntrinsicElements;

  return (
    <Component ref={containerRef} className={className} style={{ overflow: "hidden" }}>
      {text}
      {children}
    </Component>
  );
}
