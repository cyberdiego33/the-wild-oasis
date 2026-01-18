import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getBookingsAfterDate } from "../../services/apiBookings";

export function useRecentBookings() {
  const [searchParams] = useSearchParams();

  const lastParam = searchParams.get("last");
  const numDays = !lastParam ? 7 : Number(lastParam);

  // console.log(`SearchParam ${searchParams} numDays ${numDays}`);

  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isPending: isLoading, data: bookings } = useQuery({
    queryFn: () => getBookingsAfterDate(queryDate),
    queryKey: ["Bookings", `last-${numDays}`],
  });

  return { isLoading, bookings, numDays };
}
