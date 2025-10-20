import { useLocation } from "wouter";

export default function TopNavigation() {
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full bg-background backdrop-blur supports-[backdrop-filter]:bg-background/55 border-b border-border">
      <div className="container flex h-16 items-center justify-center">
        {/* Logo with Custom Font - 80% width */}
        <button
          onClick={() => setLocation("/")}
          className="hover:opacity-80 transition-opacity w-4/5"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent text-center" style={{ fontFamily: '"Pacifico", cursive' }}>
            Temu Kembali
          </h1>
        </button>
      </div>
    </header>
  );
}

