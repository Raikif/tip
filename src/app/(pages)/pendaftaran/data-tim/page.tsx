"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegistrationDataTimRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pendaftaran");
  }, [router]);

  return null;
}
