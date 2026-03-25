import { motion } from "framer-motion";
import { DOCUMENT_CATEGORIES, DEMO_DOCUMENTS, StoredDocument } from "@/data/documents";
import { getIcon } from "@/lib/icons";
import StatusBadge from "@/components/StatusBadge";
import { format, differenceInDays, parseISO } from "date-fns";
import { Plus, FolderOpen } from "lucide-react";

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
      className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-sm font-semibold leading-tight truncate">
              {category.label}
            </h3>
            {doc ? (
              <p className="mt-0.5 text-xs text-muted-foreground truncate">
                {doc.name}
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-muted-foreground italic">
                No document uploaded
              </p>
            )}
          </div>
        </div>
        {doc ? (
          <StatusBadge status={doc.status} className="shrink-0" />
        ) : (
          <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {doc?.expiryDate && (
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Expires</span>
          <span className="text-xs font-medium">
            {format(parseISO(doc.expiryDate), "dd MMM yyyy")}
            {daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30 && (
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
          <p className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <FolderOpen className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold leading-tight">DriverVault</h1>
              <p className="text-xs text-muted-foreground">Document Wallet</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Summary */}
        <section>
          <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Overview
          </h2>
          <SummaryBar />
        </section>

        {/* Documents */}
        <section>
          <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Your Documents
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
