"use client";
import React, { useCallback } from "react";
import { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Sub() {
  const searchParams = useSearchParams();

  const getBackUrl = useCallback(() => {
    // If you passed the previous URL as state during navigation
    const from = searchParams.get("from");
    if (from) {
      return from;
    }

    return `/test`;
  }, [searchParams]);

  return (
    <>
      <ViewTransition name={`fish-1`}>
        <Image
          src="/placeholder.png"
          alt="placeholder"
          priority
          width={800}
          height={800}
        />
      </ViewTransition>
      <Link href={getBackUrl()}>back</Link>
    </>
  );
}
