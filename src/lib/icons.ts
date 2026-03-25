import {
  Shield, BadgeCheck, Car, ClipboardCheck, Receipt,
  UserCheck, Building2, Search, FileText, LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Shield, BadgeCheck, Car, ClipboardCheck, Receipt,
  UserCheck, Building2, Search, FileText,
};

export const getIcon = (name: string): LucideIcon => {
  return iconMap[name] || FileText;
};
