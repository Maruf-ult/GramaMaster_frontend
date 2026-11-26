"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Redirect /student/exams → /student/contests (exams are entered from contests)
export default function ExamsIndexPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/student/contests"); }, [router]);
  return null;
}
