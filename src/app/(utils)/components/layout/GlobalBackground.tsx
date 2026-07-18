export function GlobalBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative"
      style={{
        backgroundImage:
          "linear-gradient(45deg, transparent 42%, rgba(45,45,45,0.045) 42%, rgba(45,45,45,0.045) 47%, transparent 47%), linear-gradient(-45deg, transparent 42%, rgba(45,45,45,0.045) 42%, rgba(45,45,45,0.045) 47%, transparent 47%), linear-gradient(45deg, transparent 52%, rgba(45,45,45,0.035) 52%, rgba(45,45,45,0.035) 57%, transparent 57%), linear-gradient(-45deg, transparent 52%, rgba(45,45,45,0.035) 52%, rgba(45,45,45,0.035) 57%, transparent 57%)",
        backgroundPosition: "0 0, 0 0, 33px 33px, 33px 33px",
        backgroundSize: "66px 66px",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="absolute inset-0 bg-white/42 pointer-events-none" />
      {children}
    </div>
  );
}
