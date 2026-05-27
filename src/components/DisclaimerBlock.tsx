import ExternalLink from "./ExternalLink";

export default function DisclaimerBlock() {
  return (
    <section className="text-muted text-xs space-y-1 text-center sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6 sm:gap-y-1">
      <span>Unofficial community project. Not affiliated with Logos or IFT.</span>
      <div className="flex justify-center gap-4">
        <ExternalLink href="https://logos.co">logos.co</ExternalLink>
        <ExternalLink href="https://blog.logos.co">blog.logos.co</ExternalLink>
        <ExternalLink href="https://build.logos.co">build.logos.co</ExternalLink>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
    </section>
  );
}