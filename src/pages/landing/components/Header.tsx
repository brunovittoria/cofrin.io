import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Menu, X, Moon, Sun, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Recursos" },
    { href: "#testimonials", label: "Depoimentos" },
    { href: "#pricing", label: "Preços" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Entrar
          </Link>
          <Link to="/register">
            <Button className="rounded-full shadow-[0px_20px_32px_-18px_rgba(10,132,255,0.6)]">
              Começar Grátis
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
            <span className="sr-only">Alternar menu</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <MobileMenu
          navLinks={navLinks}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

const Logo = () => (
  <div className="flex items-center gap-2 font-bold">
    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#0A84FF] to-[#006FDB] text-white">
      <PiggyBank className="size-5" />
    </div>
    <span>cofrin.io</span>
  </div>
);

type ThemeToggleProps = {
  theme: string;
  toggleTheme: () => void;
};

const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={toggleTheme}
    className="rounded-full"
  >
    {theme === "dark" ? (
      <Sun className="size-[18px]" />
    ) : (
      <Moon className="size-[18px]" />
    )}
    <span className="sr-only">Alternar tema</span>
  </Button>
);

type MobileMenuProps = {
  navLinks: { href: string; label: string }[];
  onClose: () => void;
};

const MobileMenu = ({ navLinks, onClose }: MobileMenuProps) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="absolute inset-x-0 top-16 border-b bg-background/95 backdrop-blur-lg md:hidden"
  >
    <div className="container flex flex-col gap-4 py-4">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="py-2 text-sm font-medium"
          onClick={onClose}
        >
          {link.label}
        </a>
      ))}
      <div className="flex flex-col gap-2 border-t pt-2">
        <Link to="/login" className="py-2 text-sm font-medium" onClick={onClose}>
          Entrar
        </Link>
        <Link to="/register" onClick={onClose}>
          <Button className="w-full rounded-full">
            Começar
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
);

