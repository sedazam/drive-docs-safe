import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  DOCUMENT_CATEGORIES,
  DEMO_DOCUMENTS,
  StoredDocument,
} from "@/data/documents";
import { getIcon } from "@/lib/icons";
import StatusBadge from "@/components/StatusBadge";
import { format, differenceInDays, parseISO } from "date-fns";
import { Plus, LogOut, Files, ShieldCheck, Settings } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
// For demo: fetch from a public mock vehicle API
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const getDocForCategory = (categoryId: string): StoredDocument | undefined =>
  DEMO_DOCUMENTS.find((d) => d.categoryId === categoryId);

const DocumentCard = ({
  category,
  doc,
  index,
}: {
  category: (typeof DOCUMENT_CATEGORIES)[0];
  doc?: StoredDocument;
  index: number;
}) => {
  const Icon = getIcon(category.icon);
  const daysUntilExpiry = doc?.expiryDate
    ? differenceInDays(parseISO(doc.expiryDate), new Date())
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display truncate text-sm font-semibold leading-tight">
              {category.label}
            </h3>
            {doc ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {doc.title}
              </p>
            ) : (
              <p className="mt-0.5 text-xs italic text-muted-foreground">
                No document uploaded
              </p>
            )}
          </div>
        </div>

        {doc ? (
          <StatusBadge status={doc.status} className="shrink-0" />
        ) : (
          <Link to="/upload">
            <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </Link>
        )}
      </div>

      {doc?.expiryDate && (
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Expires</span>
          <span className="text-xs font-medium">
            {format(parseISO(doc.expiryDate), "dd MMM yyyy")}
            {daysUntilExpiry !== null &&
              daysUntilExpiry > 0 &&
              daysUntilExpiry <= 30 && (
                <span className="ml-1 text-warning">({daysUntilExpiry}d)</span>
              )}
            {daysUntilExpiry !== null && daysUntilExpiry <= 0 && (
              <span className="ml-1 text-expired">(overdue)</span>
            )}
          </span>
        </div>
      )}
    </motion.div>
  );
};

const SummaryBar = () => {
  const total = DOCUMENT_CATEGORIES.length;
  const uploaded = DEMO_DOCUMENTS.length;
  const expiring = DEMO_DOCUMENTS.filter((d) => d.status === "expiring").length;
  const expired = DEMO_DOCUMENTS.filter((d) => d.status === "expired").length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Total Categories", value: total, color: "text-foreground" },
        { label: "Uploaded", value: uploaded, color: "text-success" },
        { label: "Expiring Soon", value: expiring, color: "text-warning" },
        { label: "Expired", value: expired, color: "text-expired" },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-lg border border-border bg-card p-3 text-center"
        >
          <p className={`font-display text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

const QuickActions = () => {
  const actions = [
    {
      label: "All Documents",
      description: "View your saved records",
      to: "/documents",
      icon: Files,
    },
    {
      label: "Upload",
      description: "Add a new file",
      to: "/upload",
      icon: Plus,
    },
    {
      label: "Inspection Mode",
      description: "Quick access during checks",
      to: "/inspection",
      icon: ShieldCheck,
    },
    {
      label: "Settings",
      description: "Manage preferences",
      to: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {actions.map((action, index) => {
        const Icon = action.icon;

        return (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Link
              to={action.to}
              className="block rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold">
                    {action.label}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

const Dashboard = () => {
  const { signOut, user } = useAuth();

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
              <p className="text-xs text-muted-foreground">
                All your driver documents in one secure wallet.
              </p>
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
        <section>
          <DriverProfileCard user={user} />
        </section>
        <section>
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </h2>
          <QuickActions />
        </section>

        <section>
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Required Documents
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {DOCUMENT_CATEGORIES.map((cat, i) => (
              <DocumentCard
                key={cat.id}
                category={cat}
                doc={getDocForCategory(cat.id)}
                index={i}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

import type { User } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

function validateProfile(form: typeof initialForm) {
  const errors: Record<string, string> = {};
  if (!form.full_name.trim()) {
    errors.full_name = "Full name is required.";
  }
  if (!form.phone.trim()) {
    errors.phone = "Phone is required.";
  } else if (!/^\+?\d{7,15}$/.test(form.phone.trim().replace(/\s+/g, ""))) {
    errors.phone = "Enter a valid phone number.";
  }
  if (
    form.vehicle_reg &&
    !/^[A-Za-z0-9\- ]{3,15}$/.test(form.vehicle_reg.trim())
  ) {
    errors.vehicle_reg = "Invalid vehicle registration.";
  }
  return errors;
}

const initialForm = {
  full_name: "",
  address: "",
  phone: "",
  vehicle_reg: "",
  avatar_url: "",
  postcode: "",
  house_number: "",
};

function DriverProfileCard({ user }: { user: User }) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };
  const [vehicleInfo, setVehicleInfo] = useState<any>(null);
  const [vehicleInfoLoading, setVehicleInfoLoading] = useState(false);
  const [vehicleInfoError, setVehicleInfoError] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressOptions, setAddressOptions] = useState<string[]>([]);
  // Fetch address from postcodes.io (UK demo)
  const fetchAddress = async () => {
    setAddressLoading(true);
    setAddressError(null);
    setAddressOptions([]);
    try {
      const postcode = form.postcode.trim().replace(/\s+/g, "");
      if (!postcode) {
        setAddressError("Enter postcode");
        setAddressLoading(false);
        return;
      }
      // Get postcode data
      const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
      if (!res.ok) throw new Error("Postcode not found");
      const data = await res.json();
      // Restrict to UK and London
      if (
        data.result.country !== "England" &&
        data.result.country !== "Wales" &&
        data.result.country !== "Scotland" &&
        data.result.country !== "Northern Ireland"
      ) {
        setAddressError("Only UK addresses are supported.");
        setAddressLoading(false);
        return;
      }
      if (data.result.region !== "London") {
        setAddressError("Only London addresses are supported.");
        setAddressLoading(false);
        return;
      }
      // Use nearest endpoint to get possible addresses
      const lat = data.result.latitude;
      const lon = data.result.longitude;
      const res2 = await fetch(
        `https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}`,
      );
      if (!res2.ok) throw new Error("No addresses found for this postcode");
      const data2 = await res2.json();
      const options = (data2.result || [])
        .filter(
          (r: any) =>
            r.region === "London" && r.postcode === data.result.postcode,
        )
        .map(
          (r: any) =>
            `${form.house_number} ${r.admin_ward || r.parish || r.admin_district || ""}, ${r.postcode}`,
        );
      console.log("Address API response:", data2.result, "Options:", options);
      setAddressOptions(options);
      if (options.length === 0) {
        setAddressError(
          "No addresses found for this postcode and house number",
        );
      }
    } catch (err: any) {
      setAddressError(err.message || "Unknown error");
    } finally {
      setAddressLoading(false);
    }
  };
  // Fetch vehicle info from a public mock API
  const fetchVehicleInfo = async () => {
    setVehicleInfoLoading(true);
    setVehicleInfoError(null);
    setVehicleInfo(null);
    try {
      // Replace with a real API if you have a key
      const res = await fetch(
        "https://random-data-api.com/api/vehicle/random_vehicle",
      );
      if (!res.ok) throw new Error("Failed to fetch vehicle info");
      const data = await res.json();
      setVehicleInfo(data);
    } catch (err: any) {
      setVehicleInfoError(err.message || "Unknown error");
    } finally {
      setVehicleInfoLoading(false);
    }
  };

  useEffect(() => {
    // fetch profile data on mount or user change
    if (!user) return;
    supabase
      .from("profiles")
      .select(
        "id, user_id, full_name, phone, vehicle_reg, address, avatar_url, created_at, updated_at",
      )
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setForm({
            full_name: data.full_name || "",
            address: data.address || "",
            phone: data.phone || "",
            vehicle_reg: data.vehicle_reg || "",
            avatar_url: data.avatar_url || "",
            postcode: "",
            house_number: "",
          });
        } else {
          setProfile(null);
        }
      });
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setErrorDetail(null);
    const fileExt = file.name.split(".").pop();
    const filePath = `avatars/${user.id}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      setErrorDetail(uploadError.message);
      setUploading(false);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setForm((f) => ({ ...f, avatar_url: publicUrl }));
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const errors = validateProfile(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus("Please fix the errors above.");
      return;
    }
    setSaving(true);
    setStatus(null);
    setErrorDetail(null);
    let error;
    if (profile) {
      ({ error } = await supabase
        .from("profiles")
        .update(form)
        .eq("user_id", user.id));
    } else {
      setCreating(true);
      ({ error } = await supabase
        .from("profiles")
        .insert({ ...form, user_id: user.id }));
      setCreating(false);
    }
    setSaving(false);
    setStatus(error ? "Failed to save" : "Saved!");
    setErrorDetail(error?.message || null);
    if (!error) setEdit(false);
    // Refresh profile
    supabase
      .from("profiles")
      .select(
        "id, user_id, full_name, phone, vehicle_reg, address, avatar_url, created_at, updated_at",
      )
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setProfile(data));
  };

  if (!user) return null;
  if (!profile && !edit) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <div className="mb-2 font-display text-lg font-semibold">
          No profile found
        </div>
        <Button size="sm" onClick={() => setEdit(true)}>
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 rounded-lg border border-border bg-card p-6 mb-6">
      <div className="flex flex-col items-center">
        <div className="relative h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden group">
          {form.avatar_url || profile?.avatar_url ? (
            <img
              src={form.avatar_url || profile.avatar_url}
              alt="Profile"
              className="object-cover h-20 w-20 rounded-full cursor-pointer"
              onClick={() =>
                edit && document.getElementById("avatar-upload")?.click()
              }
            />
          ) : (
            <span
              className="text-4xl text-muted-foreground cursor-pointer"
              onClick={() =>
                edit && document.getElementById("avatar-upload")?.click()
              }
            >
              👤
            </span>
          )}
          {edit && (
            <button
              type="button"
              className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-card/90 rounded-full p-1 shadow group-hover:opacity-100 opacity-90 border border-border flex items-center justify-center"
              style={{ width: 28, height: 28 }}
              onClick={() => document.getElementById("avatar-upload")?.click()}
              tabIndex={-1}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 4.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5M16 3.13a4 4 0 0 1 0 7.75M8 3.13a4 4 0 0 0 0 7.75"
                />
              </svg>
            </button>
          )}
          {edit && (
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              className="hidden"
            />
          )}
          {uploading && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/40 text-xs text-white">
              Uploading...
              {addressOptions.length > 0 && (
                <div className="mt-2">
                  <Label>Select your address:</Label>
                  <select
                    className="block w-full mt-1 border rounded p-1"
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                    value={form.address}
                  >
                    <option value="">-- Select address --</option>
                    {addressOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {addressOptions.length === 0 && addressError && (
                <div className="text-xs text-red-500 mt-0.5">
                  {addressError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        {edit ? (
          <form onSubmit={handleSave} className="space-y-2" autoComplete="on">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                autoComplete="name"
                aria-invalid={!!formErrors.full_name}
              />
              {formErrors.full_name && (
                <div className="text-xs text-red-500 mt-0.5">
                  {formErrors.full_name}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="house_number">House Number</Label>
              <Input
                id="house_number"
                name="house_number"
                value={form.house_number}
                onChange={handleChange}
                autoComplete="address-line1"
              />
            </div>
            <div>
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                name="postcode"
                value={form.postcode}
                onChange={handleChange}
                autoComplete="postal-code"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <div className="flex gap-2">
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={fetchAddress}
                  disabled={
                    addressLoading ||
                    !form.postcode.trim() ||
                    !form.house_number.trim()
                  }
                >
                  {addressLoading ? "Finding..." : "Find Address"}
                </Button>
              </div>
              {addressError && (
                <div className="text-xs text-red-500 mt-0.5">
                  {addressError}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                aria-invalid={!!formErrors.phone}
              />
              {formErrors.phone && (
                <div className="text-xs text-red-500 mt-0.5">
                  {formErrors.phone}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="vehicle_reg">Vehicle Registration</Label>
              <div className="flex gap-2">
                <Input
                  id="vehicle_reg"
                  name="vehicle_reg"
                  value={form.vehicle_reg}
                  onChange={handleChange}
                  autoComplete="off"
                  aria-invalid={!!formErrors.vehicle_reg}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={fetchVehicleInfo}
                  disabled={vehicleInfoLoading || !form.vehicle_reg.trim()}
                >
                  {vehicleInfoLoading ? "Loading..." : "Get Vehicle Info"}
                </Button>
              </div>
              {formErrors.vehicle_reg && (
                <div className="text-xs text-red-500 mt-0.5">
                  {formErrors.vehicle_reg}
                </div>
              )}
              {vehicleInfoError && (
                <div className="text-xs text-red-500 mt-0.5">
                  {vehicleInfoError}
                </div>
              )}
              {vehicleInfo && (
                <div className="text-xs text-muted-foreground mt-1 border rounded p-2 bg-muted">
                  <div>
                    <b>Make:</b>{" "}
                    {vehicleInfo.make_and_model || vehicleInfo.make || "-"}
                  </div>
                  <div>
                    <b>Model:</b> {vehicleInfo.model || "-"}
                  </div>
                  <div>
                    <b>Color:</b> {vehicleInfo.color || "-"}
                  </div>
                  <div>
                    <b>Year:</b>{" "}
                    {vehicleInfo.year || vehicleInfo.year_of_manufacture || "-"}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <Button type="submit" size="sm" disabled={saving || creating}>
                {saving || creating ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
            </div>
            {status && (
              <div className="text-xs text-muted-foreground">{status}</div>
            )}
            {errorDetail && (
              <div className="text-xs text-red-500">{errorDetail}</div>
            )}
          </form>
        ) : (
          <>
            <div className="font-display text-lg font-semibold truncate">
              {profile.full_name || "-"}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {profile.address || <span className="italic">No address</span>}
            </div>
            <div className="text-sm text-muted-foreground">
              {profile.phone || <span className="italic">No phone</span>}
            </div>
            <div className="text-sm text-muted-foreground">
              {profile.vehicle_reg && (
                <span>Vehicle: {profile.vehicle_reg}</span>
              )}
            </div>
            <Button size="sm" className="mt-2" onClick={() => setEdit(true)}>
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
