import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export const useBookingsQuery = function () {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER from search params
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue, method: "eq" };

  // SORT from search params
  const getSortBy = function () {
    const sortByParam = searchParams.get("sortBy");

    if (!sortByParam) return null;

    const [field, direction] = sortByParam.split("-");
    return { field, direction };
  };

  const sortBy = getSortBy();

  // PAGINATION from search params
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getAllBookings({ filter, sortBy, page }),
    // staleTime: 60 * 1000,
  }); // Fetching bookings data using reactQuery

  // PRE-FETCHING some data
  const nextPage = page + 1;
  const prevPage = page - 1;
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, nextPage],
      queryFn: () => getAllBookings({ filter, sortBy, page: nextPage }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, prevPage],
      queryFn: () => getAllBookings({ filter, sortBy, page: prevPage }),
    });

  return { isLoading, bookings, count, error };
};
