"use client";
import LandingPage from "@/components/landing/LandingPage";
import { useAuth } from "@/contexts/AuthContext";
import OptimizedPageTransitionLoader from "@/components/ui/OptimizedPageTransitionLoader";
import { useState, useEffect } from "react";
import { useOptimizedLoading } from "@/contexts/OptimizedLoadingContext";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { setPageLoading } = useOptimizedLoading();
  const [pageLoading, setPageLoadingState] = useState(true);

  // Simulate page loading
  useEffect(() => {
    setPageLoading(true, "Preparing your experience...");
    const timer = setTimeout(() => {
      setPageLoadingState(false);
      setPageLoading(false);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      setPageLoading(false);
    };
  }, [setPageLoading]);

  // Show loading state while checking auth or page is loading
  if (authLoading || pageLoading) {
    return <OptimizedPageTransitionLoader />;
  }

  // Show landing page for all users (authenticated or not)
  // Authenticated users can navigate to chat through the UI
  return <LandingPage />;
}