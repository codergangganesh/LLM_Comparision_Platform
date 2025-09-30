"use client";
import LandingPage from "@/components/landing/LandingPage";
import { useAuth } from "@/contexts/AuthContext";
import { redirect } from 'next/navigation'
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();

  // Redirect authenticated users to the chat page
  useEffect(() => {
    if (user) {
      redirect('/chat');
    }
  }, [user]);

  // Show landing page for all users (authenticated or not)
  return <LandingPage />;
}