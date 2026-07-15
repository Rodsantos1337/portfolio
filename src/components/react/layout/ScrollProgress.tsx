import { useScrollProgress } from "../../../hooks/useScrollProgress";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] bg-brandGreen z-[60] origin-left pointer-events-none"
      style={{ transform: `scaleX(${progress / 100})` }}
    />
  );
}
