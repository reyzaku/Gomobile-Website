export function BackgroundGrain() {
  return (
    <>
      {/* Mesh gradient — theme-aware via CSS classes */}
      <div aria-hidden className="mesh-bg fixed inset-0 -z-20" />

      {/* Subtle orange accent blobs — sit above mesh */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 15% 8%, rgba(239,102,0,0.055), transparent 65%)," +
            "radial-gradient(ellipse 700px 400px at 88% 25%, rgba(203,0,0,0.04), transparent 60%)",
        }}
      />

      {/* Grain overlay */}
      <div aria-hidden className="grain-bg fixed -z-10" />
    </>
  );
}
