import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured, handleFirestoreError, OperationType, ADMIN_EMAIL } from "./firebase";

/**
 * Returns true if the user is allowlisted in Firestore.
 * Firestore path: /allowlist/<email>
 */
export async function isEmailAllowlisted(email: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) {
    console.warn("Firebase not configured. Allowing all emails for development.");
    return true;
  }
  const emailNormalized = email.trim().toLowerCase();
  if (emailNormalized === ADMIN_EMAIL) return true;
  const ref = doc(db, "allowlist", emailNormalized);
  try {
    const snap = await getDoc(ref);

    if (!snap.exists()) return false;

    const data = snap.data() as { enabled?: boolean } | undefined;
    if (typeof data?.enabled === "boolean") return data.enabled;

    return true;
  } catch (error: any) {
    const msg = error.message.toLowerCase();
    if (msg.includes("permission") || msg.includes("insufficient")) {
      console.warn("Allowlist check denied - likely not on the list.");
      return false;
    }
    handleFirestoreError(error, OperationType.GET, `allowlist/${emailNormalized}`);
    return false; // Should not reach here as handleFirestoreError throws
  }
}

/**
 * Adds an email to the allowlist.
 */
export async function addEmailToAllowlist(email: string): Promise<void> {
  if (!db) return;
  const emailNormalized = email.trim().toLowerCase();
  const ref = doc(db, "allowlist", emailNormalized);
  try {
    await setDoc(ref, {
      enabled: true,
      addedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `allowlist/${emailNormalized}`);
  }
}

/**
 * Removes an email from the allowlist.
 */
export async function removeEmailFromAllowlist(email: string): Promise<void> {
  if (!db) return;
  const emailNormalized = email.trim().toLowerCase();
  const ref = doc(db, "allowlist", emailNormalized);
  try {
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `allowlist/${emailNormalized}`);
  }
}

/**
 * Lists all allowlisted users.
 */
export async function listAllowlistedUsers(): Promise<{ email: string; addedAt?: string }[]> {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "allowlist"));
    return snap.docs.map(d => ({
      email: d.id,
      ...(d.data() as { addedAt?: string }),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "allowlist");
    return [];
  }
}
