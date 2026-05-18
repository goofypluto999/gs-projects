import { Socials } from "./Socials";

export function Footer() {
  return (
    <footer className="px-6 pt-16 pb-10 border-t border-border">
      <div className="mx-auto max-w-[1280px] flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div>
          <h3 className="font-heading text-3xl md:text-5xl font-800 text-text-primary leading-[0.95] tracking-tight">
            Have a problem
            <br />
            worth solving?
          </h3>
          <p className="mt-4 text-text-secondary text-sm md:text-base max-w-[420px]">
            I'm always open to a conversation about strategic projects, partnerships,
            or selling any of the products on this page.
          </p>
          <a
            href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
            className="inline-block mt-5 text-accent hover:text-accent-hover transition-colors duration-150 underline underline-offset-4 decoration-accent/30 hover:decoration-accent cursor-pointer text-[15px]"
          >
            giovanni.sizino.ennes@hotmail.co.uk
          </a>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4">
          <Socials />
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span>&copy; {new Date().getFullYear()}</span>
            <span>·</span>
            <span>Giovanni Sizino Ennes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
