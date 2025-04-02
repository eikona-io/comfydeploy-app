import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import * as React from "react";
import { columns } from "./columns";
import { filterFields as defaultFilterFields, filterFields } from "./constants";
import { DataTableInfinite } from "./data-table-infinite";
import { dataOptions } from "./query-options";
import { searchParamsParser } from "./search-params";
import { startOfDay, endOfDay } from "date-fns";

export function AnalyticsClient() {
  const [search] = useQueryStates(searchParamsParser);
  const { data, isFetching, isLoading, fetchNextPage } = useInfiniteQuery(
    dataOptions(search),
  );

  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data ?? []) ?? [],
    [data?.pages],
  );

  const lastPage = data?.pages?.[data?.pages.length - 1];
  const totalDBRowCount = lastPage?.meta?.totalRowCount;
  const filterDBRowCount = lastPage?.meta?.filterRowCount;
  const chartData = lastPage?.meta?.chartData;
  const totalFetched = flatData?.length;

  const { offset, limit, id, ...filter } = search;

  // Prepare default column filters with today's date range if needed
  const defaultFilters = React.useMemo(() => {
    const filters = Object.entries(filter)
      .map(([key, value]) => ({
        id: key,
        value,
      }))
      .filter(({ value }) => value ?? undefined);

    // Add default time range if not already set
    const timeFilterExists = filters.some(
      (filter) => filter.id === "created_at",
    );
    if (!timeFilterExists) {
      filters.push({
        id: "created_at",
        value: [startOfDay(new Date()), endOfDay(new Date())],
      });
    }

    return filters;
  }, []);

  return (
    <DataTableInfinite
      columns={columns}
      data={flatData}
      totalRows={totalDBRowCount}
      filterRows={filterDBRowCount}
      totalRowsFetched={totalFetched}
      // currentPercentiles={currentPercentiles}
      defaultColumnFilters={defaultFilters}
      // defaultColumnSorting={sort ? [sort] : undefined}
      defaultRowSelection={search.id ? { [search.id]: true } : undefined}
      filterFields={filterFields()}
      isFetching={isFetching}
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      chartData={chartData}
    />
  );
}
