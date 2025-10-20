import { useLocation } from "wouter";

export default function TopNavigation() {
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container flex h-16 items-center justify-center">
        {/* Logo with Custom Font */}
        <button
          onClick={() => setLocation("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent" style={{ fontFamily: '"Pacifico", cursive' }}>
            Temu Kembali
          </h1>
        </button>
      </div>
    </header>
  );
}

