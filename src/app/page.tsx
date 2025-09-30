"use client";
import { useMemo, useState } from "react";
import { AVAILABLE_MODELS } from "@/lib/models";
import Sidebar from "@/components/layout/AdvancedSidebar";

import Link from "next/link";
import { MessageSquare, BarChart3 } from "lucide-react";

type Result = { model: string; content?: string; error?: string };

import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/chat')
}