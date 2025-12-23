import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";

export const useBookingsQuery = function () {
  const [searchParams] = useSearchParams();

  // FILTER from search params
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue, method: "eq" };

  const sortByParam = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByParam.split("-");

  const sortBy = { field, direction };

  const {
    isLoading,
    data: bookings,
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy],
    queryFn: () => getAllBookings({ filter, sortBy }),
  }); // Fetching bookings data using reactQuery

  return { isLoading, bookings, error };
};
