interface WordmarkProps {
  className?: string;
}

export default function Wordmark({ className = "" }: WordmarkProps) {
  return (
    <h1
      className={`font-sans font-semibold uppercase tracking-[0.2em] text-cream text-[clamp(1rem,2.5vw,1.5rem)] leading-tight text-center ${className}`}
    >
      Logos Global Uptime Leaderboard
    </h1>
  );
}