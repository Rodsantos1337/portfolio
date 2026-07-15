import { siteConfig, socialLinks } from "../../../data/site";
import Button from "../ui/Button";
import RevealText from "../ui/RevealText";

interface FooterProps {
  onCopyEmail: () => void;
  onScrollTo: (href: string) => void;
}

export default function Footer({ onCopyEmail, onScrollTo }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleBackToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onScrollTo("#hero");
  };

  return (
    <footer
      className="border-t border-bgBorder bg-bgSurface/20 relative z-20 pt-28 pb-12 px-6 md:px-12 overflow-hidden"
      id="contact"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-20 border-b border-bgBorder">
          <div className="lg:col-span-8">
            <span className="text-xs font-mono text-brandGreen uppercase tracking-widest block mb-4">
              <RevealText
                text="Start a Conversation"
                as="span"
                mode="word"
                stagger={0.03}
                duration={1.0}
              />
            </span>
            <h2 className="font-clash font-semibold text-5xl md:text-8xl text-brandText leading-[0.9] tracking-tighter mb-8">
              <RevealText
                text="Let's build something great."
                as="span"
                mode="word"
                stagger={0.03}
                duration={1.0}
              />
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-8">
              <Button
                variant="primary"
                slide
                onClick={onCopyEmail}
                className="email-copy-trigger"
              >
                <span>{siteConfig.email}</span>
                <div className="w-7 h-7 rounded-full bg-bgDark border border-bgBorder flex items-center justify-center group-hover:bg-brandGreen group-hover:border-brandGreen transition-colors duration-300">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-brandTextMuted group-hover:text-bgDark transition-colors"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </div>
              </Button>
              <span className="text-xs font-mono text-brandTextMuted/70">
                <RevealText
                  text="Click to copy my email address instantly."
                  as="span"
                  mode="word"
                  stagger={0.02}
                  duration={1.0}
                />
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 lg:text-right flex flex-col items-start lg:items-end gap-6">
            <RevealText
              text="Based in Portugal, working worldwide."
              as="p"
              mode="word"
              stagger={0.015}
              className="text-brandTextMuted text-sm max-w-sm lg:text-right"
            />
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="secondary"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 text-xs font-mono text-brandTextMuted/60">
          <div className="flex items-center gap-4">
            <RevealText
              as="span"
              mode="word"
              stagger={0.02}
              text={`© ${currentYear} ${siteConfig.name}. All Rights Reserved.`}
            />
            <span className="text-brandGreen/30 hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              <RevealText
                as="span"
                mode="word"
                stagger={0.02}
                text="Built with clean structure and custom code."
              />
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#hero"
              onClick={handleBackToTop}
              className="hover:text-brandGreen transition-colors flex items-center gap-1.5"
            >
              <RevealText as="span" mode="word" stagger={0.02} text="Back to top" />
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                className="transform -rotate-45"
              >
                <path
                  d="M1 11L11 1M11 1H3M11 1V9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
