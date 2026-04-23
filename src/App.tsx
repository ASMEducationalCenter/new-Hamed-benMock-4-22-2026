import React, { useState, useEffect, useCallback } from 'react';
import { InterviewStatus } from './types';
import { useGeminiLive } from './hooks/useGeminiLive';
import { auth, db, handleFirestoreError, OperationType, isUserAdmin } from "./services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import AuthPanel from "./components/auth/AuthPanel";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import IdleView from "./components/interview/IdleView";
import ActiveView from "./components/interview/ActiveView";
import FinishedView from "./components/interview/FinishedView";
import ErrorView from "./components/interview/ErrorView";
import AdminDashboard from "./components/admin/AdminDashboard";
import type { User } from "firebase/auth";

const App: React.FC = () => {
  const {
    status,
    setStatus,
    transcriptions,
    errorMsg,
    setErrorMsg,
    startSession,
    stopSession
  } = useGeminiLive();

  const [user, setUser] = useState(auth?.currentUser as User | null);
  const [resetKey, setResetKey] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const isAdmin = isUserAdmin(user?.email, user?.uid ? 'user' : undefined); // Initial check based on email

  useEffect(() => {
    if (!user || !db) {
      setIsExpired(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.createdAt) {
          const createdDate = data.createdAt.toDate();
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - createdDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 90) {
            const isCurrentAdmin = isUserAdmin(user.email, data.role);
            setIsExpired(!isCurrentAdmin);
          } else {
            setIsExpired(false);
          }
        }
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
      const msg = error.message.toLowerCase();
      // If permission denied, it might be because the account is expired (per rules)
      if (msg.includes("insufficient permissions") || msg.includes("permission denied")) {
        setIsExpired(true);
      } else {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user && status === InterviewStatus.ACTIVE) {
      stopSession();
      setErrorMsg("You were logged out. The interview has ended.");
      setStatus(InterviewStatus.ERROR);
    }
  }, [user, status, stopSession, setErrorMsg, setStatus]);

  const handleStart = useCallback(async () => {
    if (!auth?.currentUser) {
      setErrorMsg("Please login before starting the interview.");
      setStatus(InterviewStatus.ERROR);
      return;
    }
    setTimeUp(false);
    setResetKey((k) => k + 1);
    await startSession();
  }, [startSession, setErrorMsg, setStatus]);

  const handleTimeUp = useCallback(() => {
    setTimeUp(true);
    stopSession();
  }, [stopSession]);

  return (
    <div className="min-h-screen flex flex-col pb-12 bg-slate-50">
      <Header />
      <AuthPanel onUserChange={setUser} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4">
        {isAdmin && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {showAdmin ? "Back to Interview" : "Admin Dashboard"}
            </button>
          </div>
        )}

        {showAdmin && isAdmin ? (
          <AdminDashboard />
        ) : isExpired ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-xl border border-red-100 text-center px-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Expired</h2>
            <p className="text-slate-600 max-w-md mb-8">
              Your 90-day trial period has ended. Please contact support to renew your access to the ASM Interview Coach.
            </p>
            <button 
              onClick={() => auth.signOut()}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : status === InterviewStatus.IDLE && (
          <IdleView user={user} onStart={handleStart} />
        )}

        {!showAdmin && status === InterviewStatus.CONNECTING && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-xl border border-slate-200">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="mt-8 text-xl font-medium text-slate-900">Setting up your interview booth...</p>
            <p className="mt-2 text-slate-500">Checking microphone and connecting to ASM Coach</p>
          </div>
        )}

        {!showAdmin && status === InterviewStatus.ACTIVE && (
          <ActiveView
            transcriptions={transcriptions}
            resetKey={resetKey}
            onStop={stopSession}
            onTimeUp={handleTimeUp}
          />
        )}

        {!showAdmin && status === InterviewStatus.FINISHED && (
          <FinishedView
            transcriptions={transcriptions}
            timeUp={timeUp}
            onRestart={() => setStatus(InterviewStatus.IDLE)}
          />
        )}

        {!showAdmin && status === InterviewStatus.ERROR && (
          <ErrorView
            errorMsg={errorMsg || "An unexpected error occurred."}
            onRetry={() => setStatus(InterviewStatus.IDLE)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
