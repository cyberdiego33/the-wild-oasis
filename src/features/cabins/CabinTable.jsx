import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

import { useSearchParams } from "react-router-dom";
import { useCabinQuery } from "./useCabinQuery";

const CabinTable = function () {
  const { isLoading, cabinsData } = useCabinQuery();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;
  if (!cabinsData.length) return <Empty resourceName={`cabins`} />;
  // 1) For Filter by all/discount
  const filterValue = searchParams.get("discount") || "all";

  let filteredCabins;

  if (filterValue === "all") filteredCabins = cabinsData;
  if (filterValue === "no-discount")
    filteredCabins = cabinsData?.filter((cabin) => cabin.discount === 0);
  if (filterValue === "with-discount")
    filteredCabins = cabinsData?.filter((cabin) => cabin.discount > 0);

  // 2) For SORT name/price/capacity by asc and desc
  const sortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = filteredCabins.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>
        <Table.Body
          // data={cabinsData}
          // data={filteredCabins}
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
};

export default CabinTable;
