import type { Project } from "../../../data/projects";
import { cn } from "../../../lib/utils";
import RevealText from "./RevealText";
import Button from "./Button";

interface ProjectCardProps {
  project: Project;
  reverse?: boolean;
}

export default function ProjectCard({
  project,
  reverse = false,
}: ProjectCardProps) {
  return (
<article
      className={cn(
        "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center py-16 border-b border-bgBorder/70 reveal-fade group",
      )}
      data-project={project.id}
    >
      <div className={cn("lg:col-span-7", reverse && "lg:order-2")}>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden custom-radius-max border border-bgBorder bg-bgSurface/20 relative transition-colors hover:border-brandGreen/20"
        >
          <div className="w-full relative overflow-hidden parallax-img-container custom-radius-max">
            <div
              className={cn(
                "absolute inset-0 z-10 pointer-events-none from-bgDark/70 to-transparent",
                reverse ? "bg-gradient-to-tl" : "bg-gradient-to-tr",
              )}
            />
            <img
              src={project.image}
              alt={project.imageAlt}
              className="parallax-img relative w-full h-auto block brightness-90 transition-[filter] duration-700"
              style={{
                willChange: "transform",
                // This custom property can be set/read by the GSAP ScrollTrigger parallax
                // @ts-ignore
                "--parallax-scale": "1.12",
              }}
            />

            {/* Line-mask reveal — overflow-hidden clips the button as it slides up */}
            <div className="absolute bottom-6 right-6 z-20 overflow-hidden pointer-events-none">
              <Button
                variant="light"
                className="translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                aria-hidden="true"
              >
Explore Project
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 11L11 1M11 1H3M11 1V9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </a>
      </div>

      <div
        className={cn(
          "lg:col-span-5 flex flex-col justify-between h-full py-2",
          reverse && "lg:order-1",
        )}
      >
        <div>
          <h4 className="font-clash font-medium text-3xl md:text-4xl text-brandText tracking-tight mb-4 transition-colors group-hover:text-brandGreen">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brandGreen transition-colors"
            >
              <RevealText
                text={project.title}
                as="span"
                mode="word"
                stagger={0.03}
                duration={1.0}
              />
            </a>
          </h4>
          <RevealText
            text={project.description}
            as="p"
            mode="word"
            stagger={0.015}
            duration={1.0}
            className="text-brandTextMuted text-sm md:text-base leading-relaxed mb-8"
          />
        </div>

        <dl className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-bgBorder pt-6 font-sans">
          {project.meta.map((item) => (
            <div key={item.label}>
              <dt className="text-[10px] font-mono text-brandGreen/80 uppercase tracking-widest">
                <RevealText
                  text={item.label}
                  as="span"
                  mode="char"
                  stagger={0.03}
                  duration={1.0}
                />
              </dt>
              <dd className="text-sm text-brandText font-medium mt-1">
                <RevealText
                  text={item.value}
                  as="span"
                  mode="word"
                  stagger={0.02}
                  duration={1.0}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
