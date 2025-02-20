"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { FormControl } from "../ui/form";
import { api } from "~/trpc/react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<{
      name: string;
      price: string;
      description?: string | undefined;
      imageUrl?: string | undefined;
      categoryId?: number | undefined;
  }, any, undefined>;
  field: ControllerRenderProps<
    {
      name: string;
      price: string;
      description?: string | undefined;
      imageUrl?: string | undefined;
      categoryId?: number | undefined;
    },
    "name" | "description" | "price" | "imageUrl" | "categoryId"
  >;
}

export function CategoryBox({form, field}: Props) {
  const {data: categories} = api.category.getAllCategories.useQuery()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !field.value && "text-muted-foreground",
            )}
          >
            {field.value
              ? categories?.find((category) => category.id === field.value)
                  ?.name
              : "Select category"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search categories..." className="h-9" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories?.map((category) => (
                <CommandItem
                  value={category.name}
                  key={category.id}
                  onSelect={() => {
                    form.setValue("categoryId", category.id);
                  }}
                >
                  {category.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      category.id === field.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
