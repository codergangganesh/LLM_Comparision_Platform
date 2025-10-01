"use client";
import LandingPage from "@/components/landing/LandingPage";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Show landing page for all users (authenticated or not)
  // Authenticated users can navigate to chat through the UI
  return <LandingPage />;
}