import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";
import toast from "react-hot-toast";

const useDeleteCabin = function () {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteCabinFunc } = useMutation({
    mutationFn: deleteCabinApi,
    onSuccess: () => {
      toast.success("Deleted Successfully!");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isDeleting, deleteCabinFunc };
};

export default useDeleteCabin;
