import React, { Suspense } from "react";
import Sub from "./Sub";

export default function page() {
  return (
    <div className="flex flex-col place-items-end">
      <Suspense>
        <Sub />
      </Suspense>
    </div>
  );
}
