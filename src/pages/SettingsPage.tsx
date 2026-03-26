import { Link } from "react-router-dom";
import { Home, LogOut, Files, Plus, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-18 w-18 items-center justify-center rounded-lg">
              <Logo className="h-12 w-12" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold leading-tight">
                DriverWallet
              </h1>
              <p className="text-xs text-muted-foreground">Settings</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground"
          >
            <LogOut className="mr-1.5 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container space-y-6 py-6">
        <nav className="flex flex-wrap gap-2">
          <Link to="/">
            <Button variant="outline" size="sm">
              <Home className="mr-1.5 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link to="/documents">
            <Button variant="outline" size="sm">
              <Files className="mr-1.5 h-4 w-4" />
              Documents
            </Button>
          </Link>

          <Link to="/upload">
            <Button variant="outline" size="sm">
              <Plus className="mr-1.5 h-4 w-4" />
              Upload
            </Button>
          </Link>

          <Link to="/inspection">
            <Button variant="outline" size="sm">
              <ShieldCheck className="mr-1.5 h-4 w-4" />
              Inspection
            </Button>
          </Link>
        </nav>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This page will contain profile details, app preferences, and backup
            options later.
          </p>
        </section>
      </main>
    </div>
  );
}
