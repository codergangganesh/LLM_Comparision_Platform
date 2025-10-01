"use client";
import LandingPage from "@/components/landing/LandingPage";
import { useAuth } from "@/contexts/AuthContext";
import PageTransitionLoader from "@/components/ui/PageTransitionLoader";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading state while checking auth or page is loading
  if (authLoading || pageLoading) {
    return <PageTransitionLoader isLoading={true} message="Preparing your experience..." />;
  }

  // Show landing page for all users (authenticated or not)
  // Authenticated users can navigate to chat through the UI
  return <LandingPage />;
}