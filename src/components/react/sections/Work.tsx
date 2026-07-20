import { projects } from "../../../data/projects";
import ProjectCard from "../ui/ProjectCard";
import SectionLabel from "../ui/SectionLabel";
import RevealText from "../ui/RevealText";

export default function Work() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-20 relative" id="work">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-bgBorder">
        <div>
          <SectionLabel>Selected Projects</SectionLabel>
          <h3 className="font-clash font-medium text-4xl md:text-6xl tracking-tight text-brandText">
            <RevealText text="Web experiences built with care." as="span" mode="word" stagger={0.1} duration={1.0} />
          </h3>
        </div>
      </header>

      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          reverse={index % 2 === 1}
        />
      ))}
    </section>
  );
}
