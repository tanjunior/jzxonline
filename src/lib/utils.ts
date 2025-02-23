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
