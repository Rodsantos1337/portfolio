import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

import Navigation from "./layout/Navigation";
import ScrollProgress from "./layout/ScrollProgress";
import { GrainOverlay } from "./layout/GrainOverlay";
import Toast from "./layout/Toast";
import Footer from "./layout/Footer";

import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import Work from "./sections/Work";
import About from "./sections/About";
import Contact from "./sections/Contact";
import LazyVideo from "./ui/LazyVideo";

import { topMarqueeItems, bottomMarqueeItems } from "../../data/skills";
import { siteConfig } from "../../data/site";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

interface AppProps {
  page?: "home" | "contact";
}

export default function App({ page = "home" }: AppProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copy, copied] = useCopyToClipboard();
  const lenisRef = useRef<Lenis | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleCopyEmail = () => {
    copy(siteConfig.email);
    showToast("Address copied beautifully to your clipboard!");
  };

  const handleScrollTo = (href: string) => {
    if (lenisRef.current && href.startsWith("#")) {
      lenisRef.current.scrollTo(href, { offset: -100 });
    }
  };

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    if (!isReduced) {
      // GSAP ScrollTrigger reveals (slide-up)
      document.querySelectorAll(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      // GSAP ScrollTrigger reveals (fade-in only) for ProjectCards
      document.querySelectorAll(".reveal-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      // Marquee container fade-in
      document.querySelectorAll(".marquee-fade").forEach((el) => {
        const delay = parseFloat(
          (el as HTMLElement).dataset.marqueeDelay || "0"
        );
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            delay,
          }
        );
      });

      // ScrollTrigger Parallax
      document.querySelectorAll(".parallax-img-container").forEach((container) => {
        const img = container.querySelector(".parallax-img");
        if (!img) return;
        const fromScale = parseFloat(
          getComputedStyle(img as HTMLElement).getPropertyValue("--parallax-scale") || "1.12"
        );
        gsap.fromTo(
          img,
          { y: -50, scale: fromScale },
          {
            y: 50,
            scale: 1.15,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      });
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [page]);

  return (
    <>
      <ScrollProgress />
      <Navigation onScrollTo={handleScrollTo} />
      <GrainOverlay />

      <main className="relative min-h-screen">
        {page === "home" ? (
          <>
            <Hero />
            <Marquee items={topMarqueeItems} mountDelay={2} />
            <Work />
            <Marquee items={bottomMarqueeItems} reverse />
            
            <section className="relative overflow-hidden">
              <LazyVideo
                src="/hero-bg.mp4"
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-20 pointer-events-none"
              />
              <div className="relative z-10">
                <About />
                <Footer onCopyEmail={handleCopyEmail} onScrollTo={handleScrollTo} />
              </div>
            </section>
          </>
        ) : (
          <>
            <Contact onCopyEmail={handleCopyEmail} />
            <Footer onCopyEmail={handleCopyEmail} onScrollTo={handleScrollTo} />
          </>
        )}
      </main>

      <Toast message={toastMessage} />
    </>
  );
}