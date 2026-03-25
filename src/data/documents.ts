import { DocumentCategory } from "@/types/document";

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    id: "insurance",
    label: "Insurance",
    icon: "Shield",
    description: "Motor insurance certificate",
  },
  {
    id: "private-hire-licence",
    label: "Private Hire Licence",
    icon: "BadgeCheck",
    description: "PHV driver licence",
  },
  {
    id: "vehicle-licence",
    label: "Vehicle Licence",
    icon: "Car",
    description: "Vehicle registration / logbook",
  },
  {
    id: "mot",
    label: "MOT Certificate",
    icon: "ClipboardCheck",
    description: "MOT test certificate",
  },
  {
    id: "road-tax",
    label: "Road Tax",
    icon: "Receipt",
    description: "Vehicle excise duty",
  },
  {
    id: "identity",
    label: "ID Documents",
    icon: "UserCheck",
    description: "Passport, driving licence, etc.",
  },
  {
    id: "operator",
    label: "Operator Documents",
    icon: "Building2",
    description: "Operator-related paperwork",
  },
  {
    id: "inspection",
    label: "Inspection Records",
    icon: "Search",
    description: "Vehicle inspection reports",
  },
];

export type DocumentStatus = "valid" | "expiring" | "expired" | "missing";

export interface StoredDocument {
  id: string;
  categoryId: string;
  name: string;
  expiryDate?: string;
  uploadedAt: string;
  status: DocumentStatus;
  notes?: string;
}

// Demo data
export const DEMO_DOCUMENTS: StoredDocument[] = [
  {
    id: "1",
    categoryId: "insurance",
    name: "Motor Insurance Policy",
    expiryDate: "2026-06-15",
    uploadedAt: "2025-12-01",
    status: "valid",
  },
  {
    id: "2",
    categoryId: "private-hire-licence",
    name: "TfL PHV Driver Licence",
    expiryDate: "2026-04-02",
    uploadedAt: "2025-11-20",
    status: "expiring",
  },
  {
    id: "3",
    categoryId: "mot",
    name: "MOT Test Certificate",
    expiryDate: "2026-01-10",
    uploadedAt: "2025-01-10",
    status: "expired",
  },
  {
    id: "4",
    categoryId: "road-tax",
    name: "Vehicle Excise Duty",
    expiryDate: "2026-09-30",
    uploadedAt: "2025-09-30",
    status: "valid",
  },
  {
    id: "5",
    categoryId: "vehicle-licence",
    name: "V5C Registration",
    uploadedAt: "2025-08-15",
    status: "valid",
  },
];
