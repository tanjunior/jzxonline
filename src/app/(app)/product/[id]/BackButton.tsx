"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

export default function BackButton() {
  const searchParams = useSearchParams();

  const getBackUrl = useCallback(() => {
    // If you passed the previous URL as state during navigation
    const from = searchParams.get("from");
    if (from) {
      return from;
    }

    return `/product`;
  }, [searchParams]);
  return <Link href={getBackUrl()}>back</Link>;
}
