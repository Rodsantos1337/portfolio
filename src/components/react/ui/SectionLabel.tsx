import RevealText from "./RevealText";

interface SectionLabelProps {
  children: string;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <span className="text-xs font-mono text-brandGreen uppercase tracking-widest block mb-4">
      <RevealText
        text={children}
        as="span"
        mode="word"
        stagger={0.03}
        duration={1.0}
      />
    </span>
  );
}
