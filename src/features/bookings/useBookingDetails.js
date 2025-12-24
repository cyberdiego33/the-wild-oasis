import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export const useBookigDetail = function () {
  const { bookingId } = useParams();

  const {
    isLoading,
    data: bookingData,
    error,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
  }); // Fetching cabins data using reactQuery

  return { isLoading, bookingData, error };
};
