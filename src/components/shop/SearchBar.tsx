"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type React from "react";
import { z } from "zod";

type SearchBarProps = {
  value: string | null;
  setSearch: (value: string | null) => void;
};

export default function SearchBar({ value, setSearch }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      setSearch(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      const result = z.string().safeParse(inputRef.current.value);
      if (result.success) {
        setSearch(result.data);
      }
    }
  };

  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
      <Input
        type="text"
        name="search"
        placeholder="Search products..."
        className="pr-10"
        ref={inputRef}
        defaultValue={value ?? undefined}
      />

      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-0 top-0 h-full px-3"
        >
          <X size={20} className="text-muted-foreground" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          type="submit"
          className="absolute right-0 top-0 h-full px-3"
        >
          <Search size={20} className="text-muted-foreground" />
        </Button>
      )}
      <span className="sr-only">{value ? "Clear search" : "Search"}</span>
    </form>
  );
}
