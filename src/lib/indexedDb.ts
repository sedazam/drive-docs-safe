const DB_NAME = "driverwallet-db";
const DB_VERSION = 1;
const DOCUMENT_STORE = "documents";

export type DBDocumentStatus = "valid" | "expiring" | "expired" | "missing";

export type DBDocument = {
  id: string;
  categoryId: string;
  title: string;
  file: Blob;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  expiryDate?: string;
  issuedDate?: string;
  status: DBDocumentStatus;
  notes?: string;
};

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(DOCUMENT_STORE)) {
        db.createObjectStore(DOCUMENT_STORE, { keyPath: "id" });
      }
    };
  });
}

export async function saveDocument(doc: DBDocument): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOCUMENT_STORE, "readwrite");
    const store = tx.objectStore(DOCUMENT_STORE);
    const request = store.put(doc);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAllDocuments(): Promise<DBDocument[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOCUMENT_STORE, "readonly");
    const store = tx.objectStore(DOCUMENT_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as DBDocument[]);
    request.onerror = () => reject(request.error);
  });
}

export async function getDocumentById(
  id: string,
): Promise<DBDocument | undefined> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOCUMENT_STORE, "readonly");
    const store = tx.objectStore(DOCUMENT_STORE);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result as DBDocument | undefined);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOCUMENT_STORE, "readwrite");
    const store = tx.objectStore(DOCUMENT_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
