import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSetting as updateSettingApi } from "../../services/apiSettings";

const useUpdateSetting = function (reset, setShowForm) {
  const queryClient = useQueryClient();
  const { mutate: updateSettingFunc, isPending: isUpdating } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success("Setting Successfully edited");

      // Using that query client to invalidate so that the data is refreshed
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateSettingFunc, isUpdating };
};

export default useUpdateSetting;
