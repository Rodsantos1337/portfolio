import { siteConfig, socialLinks } from "../../../data/site";
import Button from "../ui/Button";
import SectionLabel from "../ui/SectionLabel";
import RevealText from "../ui/RevealText";

interface ContactProps {
  onCopyEmail: () => void;
}

export default function Contact({ onCopyEmail }: ContactProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-32 pb-20 px-6 md:px-12 max-w-5xl mx-auto relative z-10">
      <SectionLabel>Contact</SectionLabel>
      <h1 className="font-clash font-bold text-5xl md:text-8xl text-brandText leading-[0.9] tracking-tighter mb-6">
        <RevealText
          text="Let's build something great."
          as="span"
          mode="word"
          stagger={0.05}
          duration={1.0}
        />
      </h1>
      <RevealText
        text="Whether you have a detailed design specification ready or simply want to discuss a potential project, feel free to reach out."
        as="p"
        mode="word"
        stagger={0.015}
        className="text-brandTextMuted text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
      />

      <div className="flex flex-col gap-6">
        {/* Email Box */}
        <div className="border border-bgBorder custom-radius-max p-6 bg-bgSurface/20 hover:border-brandGreen/40 transition-all duration-300">
          <span className="text-[10px] font-mono text-brandGreen/80 uppercase tracking-widest block mb-2">
            Email
          </span>
          <button
            onClick={onCopyEmail}
            className="email-copy-trigger group flex items-center gap-3 text-lg md:text-2xl font-mono text-brandText hover:text-brandGreen transition-colors border-0 bg-transparent cursor-pointer p-0 text-left"
          >
            <span>{siteConfig.email}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-brandTextMuted group-hover:text-brandGreen transition-colors shrink-0"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        {/* Profiles Box */}
        <div className="border border-bgBorder custom-radius-max p-6 bg-bgSurface/20 hover:border-brandGreen/40 transition-all duration-300">
          <span className="text-[10px] font-mono text-brandGreen/80 uppercase tracking-widest block mb-3">
            Professional Profiles
          </span>
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
    </section>
  );
}
