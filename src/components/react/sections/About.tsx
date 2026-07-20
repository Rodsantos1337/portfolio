import { siteConfig } from "../../../data/site";
import SectionLabel from "../ui/SectionLabel";
import RevealText from "../ui/RevealText";

export default function About() {
  return (
    <section
      className="py-32 px-6 md:px-12 max-w-7xl mx-auto z-20 relative"
      id="about"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <aside className="lg:col-span-4 border border-bgBorder custom-radius-max p-8 bg-bgSurface/20 backdrop-blur-md lg:sticky lg:top-28 reveal">
          <div className="relative mb-6 group/avatar w-16 h-16 rounded-full overflow-hidden cursor-pointer border border-bgBorder">
            <div className="w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/avatar:-translate-y-full">
              {/* State 1: Image */}
              <img
                src="/rodrigo-santos.jpeg"
                alt={siteConfig.name}
                className="w-full h-full object-cover rounded-full select-none"
              />
              {/* State 2: Accent Initials */}
              <div className="absolute top-0 left-0 w-full h-full bg-brandGreen flex items-center justify-center text-bgDark rounded-full translate-y-full">
                <span className="font-mono font-bold text-base tracking-wider leading-none">RS</span>
              </div>
            </div>
          </div>
          <h5 className="font-clash font-semibold text-2xl text-brandText mb-8">
            <RevealText text={siteConfig.name} as="span" mode="word" stagger={0.03} duration={1.0} />
          </h5>

          <dl className="space-y-6 font-sans text-sm">
            <div className="border-b border-bgBorder/50 pb-4">
              <dt className="text-[10px] font-mono text-brandGreen/80 uppercase tracking-wider">
                <RevealText text="Location" as="span" mode="char" stagger={0.02} duration={1.0} />
              </dt>
              <dd className="text-brandText font-medium mt-1">
                <RevealText text={siteConfig.location} as="span" mode="word" stagger={0.03} duration={1.0} />
              </dd>
            </div>
            <div className="border-b border-bgBorder/50 pb-4">
              <dt className="text-[10px] font-mono text-brandGreen/80 uppercase tracking-wider">
                <RevealText text="Core Focus" as="span" mode="char" stagger={0.02} duration={1.0} />
              </dt>
              <dd className="text-brandText font-medium mt-1">
                <RevealText text="Webflow Development, Custom JS & GSAP, Component Design, React, Astro" as="span" mode="word" stagger={0.02} duration={1.0} />
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-mono text-brandGreen/80 uppercase tracking-wider">
                <RevealText text="Availability" as="span" mode="char" stagger={0.02} duration={1.0} />
              </dt>
              <dd className="flex items-center gap-2 text-brandText font-medium mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandGreen opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brandGreen" />
                </span>
                <RevealText text="Open to freelance projects and full-time roles" as="span" mode="word" stagger={0.03} duration={1.0} />
              </dd>
            </div>
          </dl>
        </aside>

        {/* Narrative columns */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <h3 className="font-clash font-medium text-2xl md:text-4xl text-brandText leading-snug tracking-tight">
            <RevealText
              text="&ldquo;I bridge the gap between static design and interactive code, turning layout blueprints into fast, engaging, and polished web realities.&rdquo;"
              as="span"
              mode="word"
              stagger={0.015}
              duration={1.0}
            />
          </h3>

          <div className="h-[1px] bg-bgBorder w-full my-4" />

          <RevealText
            text="Over the past four years, I have built production-ready, client-first web experiences. I polished my skills within the remote creative agency Better Mistakes also handled direct client communication as a top-rated freelancer,"
            as="p"
            mode="word"
            stagger={0.015}
            className="text-brandTextMuted text-base md:text-lg leading-relaxed"
          />

          <RevealText
            text="My development style is influenced by modern frontend practices. Working with React, Astro, and TypeScript taught me to think in reusable components and predictable states. Bringing this structured mindset to Webflow lets me build custom marketing platforms that look premium, remain easy for clients to update, and load instantly."
            as="p"
            mode="word"
            stagger={0.015}
            className="text-brandTextMuted text-base md:text-lg leading-relaxed"
          />

          <RevealText
            text="Before focusing fully on frontend development, I completed my degree in Audiovisual and Multimedia at ESCS and spent two years creating motion graphics at Bright Lisbon Agency. This design background ensures that every micro-interaction and custom GSAP scroll animation I build feels natural, intentional, and physically fluid."
            as="p"
            mode="word"
            stagger={0.015}
            className="text-brandTextMuted text-base md:text-lg leading-relaxed"
          />
        </div>
      </div>
    </section>
  );
}
