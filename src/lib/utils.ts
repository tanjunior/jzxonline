import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export type ValueOf<Obj> = Obj[keyof Obj];

export type OneOnly<Obj, Key extends keyof Obj> = Record<
  Exclude<keyof Obj, Key>,
  null
> &
  Pick<Obj, Key>;

export type OneOfByKey<Obj> = { [key in keyof Obj]: OneOnly<Obj, key> };
export type OneOfType<Obj> = ValueOf<OneOfByKey<Obj>>;

export async function hashPassword(
  password: string,
  salt: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password.normalize());
  const saltBuffer = encoder.encode(salt);

  // Import the password as a key for PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  // Directly derive bits using PBKDF2 (rather than deriving an AES key)
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256, // 256 bits
  );

  // Convert to base64 for storage
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

export async function comparePasswords(
  password: string,
  hashedPassword: string,
  salt: string,
): Promise<boolean> {
  const newHashedPassword = await hashPassword(password, salt);
  return newHashedPassword === hashedPassword;
}

export async function generateSalt(): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return btoa(String.fromCharCode(...salt));
}
