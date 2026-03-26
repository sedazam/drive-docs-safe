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
                {doc.name}
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

export default Dashboard;
