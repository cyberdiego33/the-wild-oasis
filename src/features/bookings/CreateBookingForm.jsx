import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import Checkbox from "../../ui/Checkbox";
import toast from "react-hot-toast";
import supabase from "../../services/supabase";
import { fromToday } from "../../data/data-bookings";
import { isFuture, isPast, isToday } from "date-fns";
import { differenceInDays } from "date-fns";
import { subtractDates } from "../../utils/helpers";
import { cabins } from "../../data/data-cabins";
import { useState } from "react";
// import { guests } from "./data-guests";

// const booking = {
//   created_at: fromToday(0, true),
//   startDate: fromToday(0),
//   endDate: fromToday(7),
//   cabinId: 1,
//   guestId: 2,
//   hasBreakfast: true,
//   observations: "I am testing the bookings",
//   isPaid: false,
//   numGuests: 1,
// };

const finalBookings = async function (booking) {
  const { data: guestsIds } = await supabase
    .from("guests")
    .select("id")
    .order("id");
  const allGuestIds = guestsIds.map((cabin) => cabin.id);
  const { data: cabinsIds } = await supabase
    .from("cabins")
    .select("id")
    .order("id");
  const allCabinIds = cabinsIds.map((cabin) => cabin.id);

  // Here relying on the order of cabins, as they don't have and ID yet
  const cabin = cabins.at(booking.cabinId - 1);
  const numNights = subtractDates(booking.endDate, booking.startDate);
  const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
  const extrasPrice = booking.hasBreakfast
    ? numNights * 15 * booking.numGuests
    : 0; // hardcoded breakfast price
  const totalPrice = cabinPrice + extrasPrice;

  let status;
  if (isPast(new Date(booking.endDate)) && !isToday(new Date(booking.endDate)))
    status = "checked-out";
  if (
    isFuture(new Date(booking.startDate)) ||
    isToday(new Date(booking.startDate))
  )
    status = "unconfirmed";
  if (
    (isFuture(new Date(booking.endDate)) ||
      isToday(new Date(booking.endDate))) &&
    isPast(new Date(booking.startDate)) &&
    !isToday(new Date(booking.startDate))
  )
    status = "checked-in";

  return {
    ...booking,
    numNights,
    cabinPrice,
    extrasPrice,
    totalPrice,
    guestId: allGuestIds.at(booking.guestId - 1),
    cabinId: allCabinIds.at(booking.cabinId - 1),
    status,
  };
};

const submitBooking = async function (data, onCloseModal) {
  const submitBooking = await finalBookings(data);

  // Testing 1 booking
  try {
    console.log(submitBooking);
    const { data, error } = await supabase
      .from("bookings")
      .insert([submitBooking])
      .select();
    if (error) throw new Error(error.message);
    console.log(data);
    toast.success("Booking Created");
  } catch (error) {
    console.log(`Catch error ${error}`);
    toast.error("Booking Not Created");
  } finally {
    onCloseModal();
  }
};

function CreateBookingForm({ onCloseModal }) {
  const { register, handleSubmit } = useForm();
  const [isPaid, setIspaid] = useState(false);
  const [hasBreakfast, setHasBreakfast] = useState(false);

  const getData = function (data) {
    const startDate = differenceInDays(new Date(data.startDate), new Date());
    const endDate = differenceInDays(new Date(data.endDate), new Date());
    const allData = {
      ...data,
      created_at: fromToday(0, true),
      startDate: fromToday(startDate),
      endDate: fromToday(endDate),
      isPaid,
      hasBreakfast,
    };
    submitBooking(allData, onCloseModal);
  };
  return (
    <Form
      onSubmit={handleSubmit(getData)}
      type={onCloseModal ? "Modal" : "regular"}
    >
      <FormRow forBooking={"Booking"} label="Start Date" error={""}>
        <Input type="date" id="startDate" {...register("startDate")} />
      </FormRow>

      <FormRow forBooking={"Booking"} label="End Date" error={""}>
        <Input type="date" id="endDate" {...register("endDate")} />
      </FormRow>

      <FormRow forBooking={"Booking"} label="Cabin Id" error={""}>
        <Input type="text" id="cabinId" {...register("cabinId")} />
      </FormRow>

      <FormRow forBooking={"Booking"} label="Guest Id" error={""}>
        <Input type="text" id="guestId" {...register("guestId")} />
      </FormRow>

      <FormRow forBooking={"Booking"} label="Observation" error={""}>
        <Textarea id="observations" {...register("observations")} />
      </FormRow>

      <FormRow forBooking={"Booking"} label="Number Of Guests" error={""}>
        <Input type="text" id="numGuests" {...register("numGuests")} />
      </FormRow>

      <FormRow forBooking={"Booking"} label="Has Breakfast" error={""}>
        <Checkbox
          value={hasBreakfast}
          onChange={() => setHasBreakfast((prev) => !prev)}
        />
      </FormRow>

      <FormRow forBooking={"Booking"} label="Is Paid" error={""}>
        <Checkbox value={isPaid} onChange={() => setIspaid((prev) => !prev)} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>Create new Booking</Button>
      </FormRow>
    </Form>
  );
}

/*
const booking = {
  created_at: fromToday(0, true),
  startDate: fromToday(0),
  endDate: fromToday(7),
  cabinId: 1,
  guestId: 2,
  hasBreakfast: true,
  observations: "I am testing the bookings",
  isPaid: false,
  numGuests: 1,
};*/

export default CreateBookingForm;
