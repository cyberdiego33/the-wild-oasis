import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

const useEditCabin = function (reset, setShowForm) {
  const queryClient = useQueryClient();
  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin Successfully edited");

      // Using that query client to invalidate so that the data is refreshed
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });

      reset();
      setShowForm((prev) => !prev);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { editCabin, isEditing };
};

export default useEditCabin;
