import ExternalLink from "./ExternalLink";

export default function DisclaimerBlock() {
  return (
    <section className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-muted text-xs">
      <span>Unofficial community project. Not affiliated with Logos or IFT.</span>
      <div className="flex gap-4">
        <ExternalLink href="https://logos.co">logos.co</ExternalLink>
        <ExternalLink href="https://blog.logos.co">blog.logos.co</ExternalLink>
        <ExternalLink href="https://build.logos.co">build.logos.co</ExternalLink>
      </div>
      <span>&copy; {new Date().getFullYear()}</span>
    </section>
  );
}