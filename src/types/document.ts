export type DocumentStatus = "valid" | "expiring" | "expired" | "missing";

export type DocumentCategoryId =
  | "driving_licence"
  | "private_hire_licence"
  | "driver_badge"
  | "vehicle_insurance"
  | "mot_certificate"
  | "vehicle_logbook"
  | "vehicle_inspection"
  | "road_tax"
  | "proof_of_address"
  | "other";

export type DocumentCategory = {
  id: DocumentCategoryId;
  label: string;
  description: string;
  icon: string;
  required: boolean;
};

export type StoredDocument = {
  id: string;
  categoryId: DocumentCategoryId;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  expiryDate?: string;
  issuedDate?: string;
  status: DocumentStatus;
  notes?: string;
  fileDataId?: string;
};

export type DriverProfile = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  licenceNumber?: string;
  privateHireLicenceNumber?: string;
  badgeNumber?: string;
  vehicleRegistration?: string;
  address?: string;
};
