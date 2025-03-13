import React from "react";
import { Separator } from "../ui/separator";
import { NavigationMenuDemo } from "./Nav";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Cart from "./Cart";

export default function ShopHeader() {
  return (
    <header className="sticky top-0 z-20 mx-4 flex h-16 shrink-0 items-center justify-evenly gap-2 bg-transparent">
      <Link href={"/"}>
        <Image alt="LOGO" src="/logo.webp" width={132} height={64} priority />
      </Link>
      <div className="w-full place-items-center">
        <NavigationMenuDemo />
      </div>

      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Separator orientation="vertical" className="mx-2 h-4" />
      <Cart />
    </header>
  );
}
