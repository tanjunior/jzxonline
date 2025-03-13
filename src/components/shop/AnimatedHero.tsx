"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AnimatedHero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className={`absolute left-0 top-0 h-full w-full`}>
        <Image
          src={"/hero.gif"}
          alt="hero"
          fill
          style={{ objectFit: "cover" }}
          priority
          unoptimized
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="mb-4 text-center text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
          JZXONLINE
        </h1>
        <p className="mb-8 text-center text-xl text-foreground">
          You Shop . We Deliver
        </p>
        <Button
          asChild
          variant={"outline"}
          size={"lg"}
          className="border-black bg-transparent"
        >
          <Link href="/product">SHOP NOW</Link>
        </Button>
      </div>
    </div>
  );
}
