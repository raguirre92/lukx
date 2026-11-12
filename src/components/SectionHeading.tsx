type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
};

export default function SectionHeading({
  title,
  subtitle,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2
        className={`font-display text-4xl leading-[1.08] md:text-5xl lg:text-6xl ${
          light ? "text-white" : "text-lukx-charcoal"
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-4 text-base leading-relaxed md:text-lg ${
            light ? "text-white/85" : "text-lukx-muted"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
