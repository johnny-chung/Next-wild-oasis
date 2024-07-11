import React from "react";
import CabinCard from "./CabinCard";
import { getCabins } from "@/app/_lib/data-service";

export default async function CabinList({ filter }) {
  const cabins = await getCabins();
  if (!cabins.length) return null;
  
  let filteredCabins;
  switch (filter) {
    case "small":
      filteredCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
      break;
    case "medium":
      filteredCabins = cabins.filter(
        (cabin) => cabin.maxCapacity > 3 && cabin.maxCapacity <= 7
      );
      break;
    case "large":
      filteredCabins = cabins.filter((cabin) => cabin.maxCapacity > 7);
      break;
    default:
      filteredCabins = cabins;
  }

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {filteredCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
