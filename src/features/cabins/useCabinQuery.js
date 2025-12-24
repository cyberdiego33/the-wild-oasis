import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";

export const useCabinQuery = function () {
  const {
    isLoading,
    data: cabinsData,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  }); // Fetching cabins data using reactQuery

  return { isLoading, cabinsData, error };
};
