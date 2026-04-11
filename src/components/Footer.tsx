export function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-border">
      <div className="mx-auto max-w-[1200px] flex items-center justify-between text-xs text-text-tertiary">
        <span>&copy; {new Date().getFullYear()} Giovanni Sizino</span>
        <a
          href="mailto:giovanni.sizino.ennes@hotmail.co.uk"
          className="hover:text-text-secondary transition-colors duration-150 cursor-pointer"
        >
          Contact
        </a>
      </div>
    </footer>
  );
}
