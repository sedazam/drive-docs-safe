import {
  Shield,
  BadgeCheck,
  Car,
  ClipboardCheck,
  Receipt,
  UserCheck,
  Building2,
  Search,
  FileText,
  IdCard,
  Home,
  File,
  Folder,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  // Existing
  shield: Shield,
  "badge-check": BadgeCheck,
  car: Car,
  "clipboard-check": ClipboardCheck,
  receipt: Receipt,
  "user-check": UserCheck,
  building: Building2,
  search: Search,
  "file-text": FileText,

  // NEW for DriverWallet
  "id-card": IdCard,
  home: Home,
  file: File,
  folder: Folder,
};

export const getIcon = (name: string): LucideIcon => {
  return iconMap[name] || FileText;
};
