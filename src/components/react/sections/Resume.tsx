import Button from "../ui/Button";

export default function Resume() {
  return (
    <section className="relative min-h-screen pt-20 md:pt-20 pb-8 md:pb-10 px-4 md:px-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-clash font-semibold text-xl text-brandText tracking-tight">
            Resume
          </h1>
          <Button variant="primary" slide href="/Rodrigo-Santos-Resume.pdf" download>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </Button>
        </div>
        <div className="bg-bgSurface border border-bgBorder rounded-lg overflow-hidden">
          <iframe
            src="/Rodrigo-Santos-Resume.pdf#view=Fit"
            className="w-full h-[calc(100vh-140px)] md:h-[calc(100vh-150px)]"
            title="Rodrigo Santos — Resume"
          />
        </div>
      </div>
    </section>
  );
}
