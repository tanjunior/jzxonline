"use client";

import { Button } from "./ui/button";
import { Github, Twitter } from "lucide-react";
import Image from "next/image";
import { signIn } from "~/actions/auth";

export default function SocialLoginButtons() {
  return (
    <div className="flex flex-col space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => console.log("Google login clicked")}
      >
        <Image
          src="/google-logo.svg"
          alt="Google logo"
          width={20}
          height={20}
          className="mr-2"
        />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => signIn("github")}
      >
        <Github className="mr-2 h-5 w-5" />
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => console.log("Twitter login clicked")}
      >
        <Twitter className="mr-2 h-5 w-5" />
        Continue with Twitter
      </Button>
    </div>
  );
}
