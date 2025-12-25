import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export const useDeleteBooking = function () {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteBookingFunc } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      toast.success("Deleted Successfully");
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isDeleting, deleteBookingFunc };
};
