import Image from "next/image";
import Link from "next/link";
import React from "react";
import { unstable_ViewTransition as ViewTransition } from "react";

export default async function page() {
  return (
    <div className="flex flex-col place-items-start">
      <div>
        <Link
          href={{
            pathname: "/test2",
            search: "/test",
            query: { from: "/test" },
          }}
        >
          <ViewTransition name={`fish-1`}>
            <Image
              src="/placeholder.png"
              alt="placeholder1"
              width={500}
              height={500}
            />
          </ViewTransition>
        </Link>
      </div>

      <div>
        <ViewTransition name={`fish-2`}>
          <Image
            src="/placeholder2.png"
            alt="placeholder2"
            width={500}
            height={500}
          />
        </ViewTransition>
      </div>
    </div>
  );
}
