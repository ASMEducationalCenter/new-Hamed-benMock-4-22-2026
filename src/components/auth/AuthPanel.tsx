import React, { useState, useEffect, useMemo } from "react";
import { auth, googleProvider, db, handleFirestoreError, OperationType, ADMIN_EMAIL, isFirebaseConfigured } from "../../services/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { isEmailAllowlisted } from "../../services/allowlist";

function getPasswordStrength(pw: string) {
  const len = pw.length;
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /\d/.test(pw);
  const hasSymbol = /[^A-Za-z0-9]/.test(pw);

  let score = 0;
  if (len >= 8) score++;
  if (len >= 12) score++;
  if (hasLower) score++;
  if (hasUpper) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;

  if (pw.length === 0) return { label: "", detail: "" };
  if (score <= 2) return { label: "Weak", detail: "Add 8+ chars, upper/lower, number." };
  if (score <= 4) return { label: "Medium", detail: "Add uppercase, number, or symbol." };
  return { label: "Strong", detail: "Good password." };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function AuthPanel({
  onUserChange,
}: {
  onUserChange?: (user: User | null) => void;
}) {
  const [user, setUser] = useState(auth?.currentUser as User | null);
  const [mode, setMode] = useState("signin" as "signin" | "signup");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null as string | null);
  const [successMsg, setSuccessMsg] = useState(null as string | null);
  const [googleMsg, setGoogleMsg] = useState(null as string | null);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      onUserChange?.(u);
    });
    return () => unsub();
  }, [onUserChange]);

  const clearMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleMsg(null);
    setResetSent(false);
  };

  const strength = getPasswordStrength(password);
  const strengthClass =
    strength.label === "Weak"
      ? "text-red-600"
      : strength.label === "Medium"
      ? "text-amber-600"
      : "text-green-600";

  const signupStrongEnough = useMemo(() => {
    return strength.label !== "Weak" && password.length >= 8;
  }, [strength.label, password.length]);

  const canSubmit = useMemo(() => {
    if (!email) return false;
    if (resetMode) return isValidEmail(email);
    if (!password) return false;
    if (password.length < 8) return false;
    if (mode === "signup") {
      if (!name.trim()) return false;
      if (!signupStrongEnough) return false;
    }
    return true;
  }, [email, password, mode, name, resetMode, signupStrongEnough]);

  async function syncUserToFirestore(u: User) {
    if (!db) return;
    const userRef = doc(db, "users", u.uid);
    try {
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          uid: u.uid,
          email: u.email,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      } else {
        // Update last login
        await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      }
    } catch (error: any) {
      const msg = error.message.toLowerCase();
      if (msg.includes("permission") || msg.includes("insufficient")) {
        console.warn("User document access denied - likely expired trial.");
        return; // Don't throw, let App.tsx handle the expired state
      }
      handleFirestoreError(error, OperationType.WRITE, `users/${u.uid}`);
    }
  }

  async function enforceAllowlistOrLogout(u: User) {
    const userEmail = (u.email || "").trim().toLowerCase();
    if (!userEmail) {
      await signOut(auth);
      throw new Error("Your account has no email attached. Access denied.");
    }
    // Admin bypass
    if (userEmail === ADMIN_EMAIL) return;

    const allowed = await isEmailAllowlisted(userEmail);
    if (!allowed) {
      await signOut(auth);
      throw new Error("Access denied. Your email is not authorized for this platform. Please contact ASM staff.");
    }
  }

  async function loginGoogle() {
    setGoogleMsg(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await syncUserToFirestore(cred.user);
      await enforceAllowlistOrLogout(cred.user);
      setResetMode(false);
      setShowEmailForm(false);
      clearMessages();
    } catch (e: any) {
      const code = e?.code as string | undefined;
      console.error("Google Auth Error:", e);
      if (code === "auth/popup-closed-by-user") {
        setGoogleMsg("Login window closed.");
      } else if (code === "auth/operation-not-allowed") {
        setGoogleMsg("Google login is not enabled in your Firebase project.");
      } else if (code === "auth/unauthorized-domain") {
        setGoogleMsg("This domain is not authorized in your Firebase console.");
      } else {
        const m = (e?.message || "").toString();
        if (m.includes("Access denied")) {
          setGoogleMsg("This Google account is not authorized. Please contact ASM staff.");
        } else {
          setGoogleMsg(e?.message || "Google login failed.");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function submitEmailPassword(e: React.FormEvent) {
    e.preventDefault();
    clearMessages();

    if (resetMode) {
      const cleanEmail = email.trim().toLowerCase();
      if (!isValidEmail(cleanEmail)) {
        setErrorMsg("Enter a valid email address.");
        return;
      }
      setLoading(true);
      try {
        // We add actionCodeSettings to make the link more robust and redirect back to the app
        const actionCodeSettings = {
          url: window.location.origin,
          handleCodeInApp: false,
        };
        await sendPasswordResetEmail(auth, cleanEmail, actionCodeSettings);
        setResetSent(true);
        setSuccessMsg("A password reset link has been sent! Please check your inbox (and spam folder) for the NEWEST email.");
        setResetMode(false);
        setMode("signin");
        setPassword("");
      } catch (e: any) {
        console.error("Reset Email Error:", e);
        const code = e?.code;
        if (code === "auth/user-not-found") {
          setErrorMsg("We couldn't find an account with that email address. Please try signing up instead.");
        } else if (code === "auth/too-many-requests") {
          setErrorMsg("Too many requests. Please try again later.");
        } else {
          setErrorMsg(e?.message || "Failed to send reset email.");
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (mode === "signup" && !signupStrongEnough) {
      setErrorMsg("Signup blocked: password is too weak. Use a stronger password.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
        if (name.trim()) await updateProfile(cred.user, { displayName: name.trim() });
        await syncUserToFirestore(cred.user);
        await enforceAllowlistOrLogout(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
        await syncUserToFirestore(cred.user);
        await enforceAllowlistOrLogout(cred.user);
      }
    } catch (e: any) {
      const code = e?.code as string | undefined;
      console.error("Auth Exception Details:", {
        code,
        message: e?.message,
        fullError: e
      });

      if (code === "auth/operation-not-allowed") {
        setErrorMsg("Email/Password login is not enabled in your Firebase project. Please enable it in the Firebase Console (Authentication > Sign-in method).");
      } else if (code === "auth/email-already-in-use") {
        setErrorMsg("That email is already in use. Try signing in.");
      } else if (code === "auth/invalid-credential") {
        setErrorMsg("Invalid email or password. Reminder: You recently switched to a NEW Firebase project. Please try 'Create Account' if you haven't registered on this specific database yet.");
      } else if (code === "auth/user-not-found") {
        setErrorMsg("No account found with this email on the new database. Please Create Account.");
      } else if (code === "auth/wrong-password") {
        setErrorMsg("Incorrect password. Please try again or use the reset link.");
      } else if (code === "auth/invalid-email") {
        setErrorMsg("Invalid email address format.");
      } else if (code === "auth/weak-password") {
        setErrorMsg("Password must be at least 8 characters long.");
      } else if (code === "auth/popup-closed-by-user") {
        setErrorMsg("Login window was closed before completion.");
      } else if (code === "auth/cancelled-popup-request") {
        // Ignore, another popup was opened
      } else {
        setErrorMsg(e?.message || "Authentication failed. Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  }

  const logoutFirebase = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 -mt-4 mb-6">
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4 text-amber-800 text-sm">
          <p className="font-bold mb-1">Firebase Configuration Required</p>
          <p>Please add your Firebase API keys to the <strong>Secrets</strong> panel (gear icon ⚙️) to enable login and allowlist features.</p>
          <p className="mt-2 text-xs opacity-70">Required: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, etc.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 -mt-4 mb-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        {!user ? (
          <>
            <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
              <div>
                <div className="text-sm font-semibold text-slate-900">Login required</div>
                <div className="text-xs text-slate-500">Use Google or email/password.</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loginGoogle}
                  disabled={loading}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailForm((v) => !v);
                    setGoogleMsg(null);
                  }}
                  disabled={loading}
                  className="bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-900 font-bold py-2 px-4 rounded-lg border border-slate-200"
                >
                  Continue with Email
                </button>
              </div>
            </div>
            {!showEmailForm && googleMsg && (
              <div className="mt-2 text-sm text-red-600">{googleMsg}</div>
            )}
            {showEmailForm && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setResetMode(false);
                      clearMessages();
                    }}
                    className={`text-sm font-semibold px-3 py-1 rounded-lg border ${
                      mode === "signin"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setResetMode(false);
                      clearMessages();
                    }}
                    className={`text-sm font-semibold px-3 py-1 rounded-lg border ${
                      mode === "signup"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    Create account
                  </button>
                </div>
                <form onSubmit={submitEmailPassword} className="grid md:grid-cols-3 gap-3">
                  {mode === "signup" && !resetMode && (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  )}
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                  {!resetMode ? (
                    <div className="relative">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password (min 8 chars)"
                        type={showPassword ? "text" : "password"}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-full pr-20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  ) : (
                    <div className="md:col-span-2 text-sm text-slate-600 flex items-center">
                      Enter your email and we’ll send a reset link.
                    </div>
                  )}
                  {mode === "signup" && !resetMode && strength.label && (
                    <div className="md:col-span-3 text-xs">
                      <span className={`font-bold ${strengthClass}`}>Strength: {strength.label}</span>
                      <span className="text-slate-500"> — {strength.detail}</span>
                    </div>
                  )}
                  <div className="md:col-span-3 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={!canSubmit || loading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      {resetMode ? "Send reset link" : mode === "signup" ? "Create account" : "Sign in"}
                    </button>
                  {mode === "signin" && !resetMode && (
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setResetMode(true);
                          clearMessages();
                          setPassword("");
                        }}
                        className="text-sm font-semibold text-slate-600 hover:text-slate-900 text-left"
                      >
                        Forgot password?
                      </button>
                      {email.toLowerCase() === ADMIN_EMAIL && (
                        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-100">
                          <strong>Admin Tip:</strong> You can also use "Continue with Google" for your <code>asmed.com</code> account to bypass passwords entirely.
                        </div>
                      )}
                    </div>
                  )}
                  {errorMsg && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 mt-2">
                       {errorMsg}
                    </div>
                  )}
                  {successMsg && (
                    <div className="text-sm text-green-700 bg-green-50 p-2 rounded-lg border border-green-100 mt-2">
                      {successMsg}
                    </div>
                  )}
                </div>
                  {mode === "signup" && !resetMode && (
                    <div className="md:col-span-3 text-xs text-slate-500">
                      Password must be at least 8 characters. For signup, weak passwords are blocked.
                    </div>
                  )}
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="profile"
                  className="w-9 h-9 rounded-full border border-slate-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-200" />
              )}
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {user.displayName || "Logged in"}
                </div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
            </div>
            <button
              onClick={logoutFirebase}
              disabled={loading}
              className="text-sm font-semibold text-slate-600 hover:text-red-600 disabled:opacity-60"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
