import toast from "react-hot-toast";
import { createEditCabin } from "../../services/apiCabins";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useCreateCabin = function () {
  const queryClient = useQueryClient();

  const { mutate: createCabin, isPending: isAddingRow } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success("New Cabin Added");

      // Using that query client to invalidate so that the data is refreshed
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createCabin, isAddingRow };
};

export default useCreateCabin;
