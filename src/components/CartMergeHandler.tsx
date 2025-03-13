// components/CartMergeHandler.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";

export function CartMergeHandler() {
  const { status } = useSession();
  const { mergeLocalAndServerCarts } = useCart();
  const [hasMerged, setHasMerged] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !hasMerged) {
      console.log("User logged in, merging carts...");
      void mergeLocalAndServerCarts();
      setHasMerged(true);
    }

    if (status === "unauthenticated") {
      setHasMerged(false);
    }
  }, [status, hasMerged, mergeLocalAndServerCarts]);

  return null;
}
