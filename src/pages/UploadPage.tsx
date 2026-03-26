import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  Files,
  Upload as UploadIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { DOCUMENT_CATEGORIES } from "@/data/documents";
import { saveDocument } from "@/lib/indexedDb";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function getStatusFromExpiry(
    expiry?: string,
  ): "valid" | "expiring" | "expired" {
    if (!expiry) return "valid";

    const today = new Date();
    const expiryValue = new Date(expiry);

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffInMs = expiryValue.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInMs / msPerDay);

    if (diffInDays < 0) return "expired";
    if (diffInDays <= 30) return "expiring";
    return "valid";
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Title is required",
        description: "Please enter a document title.",
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: "Category is required",
        description: "Please choose a document category.",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "File is required",
        description: "Please choose a PDF or image file.",
      });
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF, JPG, PNG, WEBP, or HEIC file.",
      });
      return;
    }

    try {
      setIsSaving(true);

      const now = new Date().toISOString();

      await saveDocument({
        id: crypto.randomUUID(),
        categoryId,
        title: title.trim(),
        file: selectedFile,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        uploadDate: now,
        expiryDate: expiryDate || undefined,
        status: getStatusFromExpiry(expiryDate),
        notes: notes.trim() || undefined,
        fileSize: selectedFile.size,
      });

      toast({
        title: "Document saved",
        description: "Your document was stored locally on this device.",
      });

      setTitle("");
      setCategoryId("");
      setExpiryDate("");
      setNotes("");
      setSelectedFile(null);

      const fileInput = document.getElementById(
        "document-file",
      ) as HTMLInputElement | null;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Failed to save document:", error);
      toast({
        title: "Save failed",
        description: "Something went wrong while saving the document.",
      });
    } finally {
      setIsSaving(false);
    }
  }

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
              <p className="text-xs text-muted-foreground">Upload</p>
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

          <Link to="/inspection">
            <Button variant="outline" size="sm">
              <ShieldCheck className="mr-1.5 h-4 w-4" />
              Inspection
            </Button>
          </Link>

          <Link to="/settings">
            <Button variant="outline" size="sm">
              <Settings className="mr-1.5 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>

        <section className="rounded-lg border border-border bg-card p-6">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UploadIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">
                Upload Document
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a driver or vehicle document and store it locally on this
                device.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium"
                >
                  Document title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. PHV Driver Licence"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a category</option>
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="expiryDate"
                  className="mb-2 block text-sm font-medium"
                >
                  Expiry date
                </label>
                <input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(event) => setExpiryDate(event.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="document-file"
                  className="mb-2 block text-sm font-medium"
                >
                  File
                </label>
                <input
                  id="document-file"
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp,image/heic,image/heif"
                  onChange={handleFileChange}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
                />
                {selectedFile && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="mb-2 block text-sm font-medium">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional notes..."
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Document"}
              </Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
