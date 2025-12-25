import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export const useCheckOut = function () {
  const queryClient = useQueryClient();
  const { mutate: checkOutFunc, isPending: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, {
        status: "checked-out",
      }),

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked Out`);
      queryClient.invalidateQueries({ active: true });
    },

    onError: () => toast.error("There was an error while checking in "),
  });

  return { checkOutFunc, isCheckingOut };
};
