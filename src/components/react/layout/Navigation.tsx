import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { siteConfig } from "../../../data/site";
import Button from "../ui/Button";

interface NavigationProps {
  onScrollTo: (href: string) => void;
}

export default function Navigation({ onScrollTo }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerLines = useRef<HTMLSpanElement[]>([]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      onScrollTo(href);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    hamburgerLines.current.forEach((line, i) => {
      if (isReduced) return;
      if (isMenuOpen) {
        if (i === 0) {
          gsap.to(line, { rotation: 45, y: 9, duration: 0.2 });
        } else if (i === 1) {
          gsap.to(line, { opacity: 0, duration: 0.2 });
        } else if (i === 2) {
          gsap.to(line, { rotation: -45, y: -9, duration: 0.2 });
        }
      } else {
        gsap.to(line, { rotation: 0, y: 0, x: 0, opacity: 1, duration: 0.2 });
      }
    });
  }, [isMenuOpen]);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const menu = menuRef.current;
    if (!menu) return;

    const menuItems = menu.querySelectorAll("a");

    if (isMenuOpen) {
      if (isReduced) {
        gsap.set(menu, { opacity: 1, y: 0 });
        gsap.set(menuItems, { opacity: 1, x: 0 });
      } else {
        gsap.fromTo(
          menu,
          { opacity: 0, y: "-100%" },
          { opacity: 1, y: 0, duration: 0.4, ease: [0.16, 1, 0.3, 1] }
        );
        gsap.fromTo(
          menuItems,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", stagger: 0.05, delay: 0.1 }
        );
      }
    } else {
      if (!isReduced) {
        gsap.set(menu, { opacity: 0, y: "-100%" });
        gsap.set(menuItems, { opacity: 0, x: -20 });
      } else {
        gsap.set(menu, { opacity: 0 });
      }
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 px-4 md:px-12 flex items-center justify-between border-b border-bgBorder/50 bg-bgDark/80 backdrop-blur-xl"
        id="mainNav"
      >
        <div className="flex items-center gap-6 md:gap-12">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, "/")}
            className="font-clash font-semibold text-sm md:text-lg tracking-tight hover:text-brandGreen transition-colors flex items-center gap-1.5 md:gap-2 text-brandText"
          >
            <span className="w-2 h-2 bg-brandGreen rounded-full inline-block animate-pulse" />
            {siteConfig.name}
          </a>
        </div>

        <div className="flex items-center gap-4">
          {/* GitHub button (Desktop) */}
          <Button
            variant="secondary"
            href="https://github.com/Rodsantos1337"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </Button>

          {/* Let's Connect CTA (Desktop) */}
          <Button
            variant="primary"
            slide
            className="!hidden sm:!inline-flex text-xs"
            href="/contact"
          >
            <span>Let's Connect</span>
            <div className="w-7 h-7 rounded-full bg-bgDark border border-bgBorder flex items-center justify-center group-hover:bg-brandGreen group-hover:border-brandGreen transition-colors duration-300">
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                className="text-brandTextMuted group-hover:text-bgDark transition-colors"
              >
                <path
                  d="M1 11L11 1M11 1H3M11 1V9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Button>

          {/* Mobile Menu Hamburger Button */}
          <button
            className="md:hidden text-brandText p-2 z-50 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                ref={(el) => { if (el) hamburgerLines.current[0] = el; }}
                className="w-full h-[2px] bg-brandText block origin-center"
                style={{ display: "block" }}
              />
              <span
                ref={(el) => { if (el) hamburgerLines.current[1] = el; }}
                className="w-full h-[2px] bg-brandText block"
                style={{ display: "block", opacity: 1 }}
              />
              <span
                ref={(el) => { if (el) hamburgerLines.current[2] = el; }}
                className="w-full h-[2px] bg-brandText block origin-center"
                style={{ display: "block" }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        ref={menuRef}
        className={`fixed inset-0 z-40 bg-bgDark/95 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden ${
          isMenuOpen ? "" : "pointer-events-none"
        }`}
        style={{ opacity: 0 }}
      >
        <nav className="flex flex-col gap-6 text-left">
          <div className="flex flex-col gap-4">
            <Button
              variant="primary"
              slide
              href="/contact"
              className="w-full justify-center text-xs"
              onClick={() => setIsMenuOpen(false)}
            >
<span>Let's Connect</span>
              <div className="w-7 h-7 rounded-full bg-bgDark border border-bgBorder flex items-center justify-center group-hover:bg-brandGreen group-hover:border-brandGreen transition-colors duration-300">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="text-brandTextMuted group-hover:text-bgDark transition-colors"
                >
                  <path
                    d="M1 11L11 1M11 1H3M11 1V9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Button>
            <div className="flex gap-4 justify-start text-xs font-mono text-brandTextMuted">
              <a
                href="https://github.com/Rodsantos1337"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brandGreen transition-colors"
              >
                GitHub
              </a>
              <span>•</span>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brandGreen transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}