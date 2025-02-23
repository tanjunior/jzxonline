import { Table } from "@tanstack/react-table";
import { Input } from "./ui/input";
import { OneOfByKey, OneOfType, ValueOf } from "~/lib/utils";

interface DataTableFilteringProps<TData> {
  table: Table<TData>;
  filterKey: string;
}

export function DataTableFiltering<TData>({
  table,
  filterKey,
}: DataTableFilteringProps<TData>) {
  return (
    <Input
      placeholder={`Filter ${filterKey}...`}
      value={(table.getColumn(filterKey)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(filterKey)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
}
