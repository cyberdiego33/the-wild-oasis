import styled from "styled-components";
import { useRecentBookings } from "./useRecentBookings";
import Spinner from "../../ui/Spinner";
import { useRecentStays } from "./useRecentStays";
import Stats from "./Stats";
import { useCabinQuery } from "../cabins/useCabinQuery";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

const DashboardLayout = function () {
  const { isLoading: isLoadingBook, bookings, numDays } = useRecentBookings();
  const { isLoading: isLoadingStays, stays, confirmedStays } = useRecentStays();
  const { cabinsData, isLoading: isLoadingCabins } = useCabinQuery();

  if (isLoadingBook || isLoadingStays || isLoadingCabins) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        cabinCount={cabinsData.length}
      />
      <div>Todays activity</div>
      <div>Chart stay durations</div>
      <div>Chart sales</div>
    </StyledDashboardLayout>
  );
};

export default DashboardLayout;
