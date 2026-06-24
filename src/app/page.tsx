"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export default function HomePage() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/contacts");
    }

    if (status === "anonymous") {
      router.replace("/login");
    }
  }, [router, status]);

  return (
    <main className="grid min-h-screen place-items-center">
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
    </main>
  );
}
