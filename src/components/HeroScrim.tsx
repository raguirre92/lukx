export default function HeroScrim() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.45) 40%, rgba(0,0,0,0) 75%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,.55) 0%, rgba(0,0,0,.22) 36%, rgba(0,0,0,0) 68%)",
        }}
        aria-hidden
      />
    </>
  );
}
