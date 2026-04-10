import { Link } from "react-router-dom";
import { Home, LogOut, Files, Plus, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
          <h2 className="font-display text-xl font-semibold mb-4">
            Profile Details
          </h2>
          <ProfileDetails />
        </section>
      </main>
    </div>
  );
}

function ProfileDetails() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, phone, vehicle_reg, address")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
        setAddress(data?.address || "");
      });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setStatus(null);
    const { error } = await supabase
      .from("profiles")
      .update({ address })
      .eq("user_id", user.id);
    setSaving(false);
    setStatus(error ? "Failed to save" : "Saved!");
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-4 max-w-md">
      <div>
        <Label>Full Name</Label>
        <Input value={profile.full_name || ""} disabled />
      </div>
      <div>
        <Label>Phone</Label>
        <Input value={profile.phone || ""} disabled />
      </div>
      <div>
        <Label>Vehicle Registration</Label>
        <Input value={profile.vehicle_reg || ""} disabled />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </Button>
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
    </form>
  );
}
