"use client";
import React, { useCallback } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  useQueryState,
  parseAsInteger,
  useQueryStates,
  parseAsFloat,
  parseAsArrayOf,
} from "nuqs";
import ProductItem from "./Item";
import type { SortOption, ViewMode } from "~/lib/types";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";
import ViewToggle from "./ViewToggle";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { DualSlider } from "~/components/ui/dual-slider";
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

export default function List() {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ clearOnDefault: true }).withDefault(1),
  );

  const [search, setSearch] = useQueryState("search", { clearOnDefault: true });
  const [category, setCategory] = useQueryState(
    "category",
    parseAsArrayOf(parseAsInteger)
      .withOptions({
        clearOnDefault: true,
      })
      .withDefault([]),
  );
  const [priceRange, setPriceRange] = useQueryStates({
    minPrice: parseAsFloat.withDefault(0),
    maxPrice: parseAsFloat.withDefault(9999),
  });

  const [data] = api.product.getAllProducts.useSuspenseQuery({
    page,
    category,
    priceRange,
    search,
  });

  const { items, metadata } = data;
  const { totalCount, pageCount } = metadata;

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= pageCount; i++) {
    pageNumbers.push(i);
  }

  const [categories] = api.category.getAllCategories.useSuspenseQuery();

  const [sort, setSort] = useQueryState("sort", { defaultValue: "name" });
  const [view, setView] = useQueryState("view", { defaultValue: "grid" });

  const handlePageChange = (page: number) => {
    void setPage(page);
    // Scroll to top when changing pages
    void window.scrollTo(0, 0);
  };

  const sortedProducts = items.sort((a, b) => {
    if (sort === "price") {
      return a.price - b.price;
    } else if (sort === "price-desc") {
      return b.price - a.price;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const handleCategoryChange = useCallback(
    (categoryId: number) => {
      void setCategory((prev) => {
        if (!prev) return [categoryId];
        if (prev?.includes(categoryId))
          return category?.filter((c) => c !== categoryId);
        else return [...prev, categoryId];
      });
    },
    [category, setCategory],
  );

  const handlePriceRangeChange = useCallback(
    (value: number[]) => {
      void setPriceRange({ minPrice: value[0], maxPrice: value[1] });
    },
    [setPriceRange],
  );

  const handleSearch = (search: string | null) => {
    void setSearch(search);
  };

  const handleClearFilters = () => {
    void setCategory([]);
    void setPriceRange({ minPrice: 0, maxPrice: 9999 });
  };

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="w-full lg:w-1/2 xl:w-1/3">
          <SearchBar value={search} setSearch={handleSearch} />
        </div>
        {/* Pagination controls */}

        <div className="flex flex-col items-center gap-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {pageNumbers.map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                    isActive={page === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                  aria-disabled={page === pageCount}
                  className={
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * 9 + 1} to {Math.min(page * 9, totalCount)} of{" "}
            {totalCount} products
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <SortDropdown value={sort as SortOption} onChange={setSort} />
          <ViewToggle value={view as ViewMode} onChange={setView} />
        </div>
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-64">
          <Card className="w-full md:w-64">
            <CardHeader className="flex flex-row items-center justify-between py-2">
              <CardTitle className="text-base">Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-medium">Price Range</h3>
                <DualSlider
                  min={0}
                  max={9999}
                  value={[priceRange.minPrice, priceRange.maxPrice]}
                  onValueChange={handlePriceRangeChange}
                  className="mb-2"
                />
                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange.minPrice}</span>
                  <span>${priceRange.maxPrice}</span>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-medium">Categories</h3>
                {categories.map((categoryItem) => (
                  <div className="flex items-center" key={categoryItem.id}>
                    <Checkbox
                      checked={category?.includes(categoryItem.id)}
                      onCheckedChange={() =>
                        handleCategoryChange(categoryItem.id)
                      }
                      className="mr-2"
                    />
                    <label className="flex-1 cursor-pointer">
                      {categoryItem.name}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
        <main className="flex-grow">
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {sortedProducts.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                searchParams={{
                  search: search ?? "",
                  category: category?.join(","),
                  minPrice: priceRange.minPrice.toString(),
                  maxPrice: priceRange.maxPrice.toString(),
                  view: view as ViewMode,
                }}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
