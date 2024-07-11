import EditReservationForm from "@/app/_components/EditReservationForm";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  const { numGuests, observations, cabinId } = await getBooking(
    params.reservationId
  );
  console.log(numGuests);
  console.log(observations);
  const { maxCapacity } = await getCabin(cabinId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{params.reservationId}
      </h2>
      <EditReservationForm
        numGuests={numGuests}
        observations={observations}
        reservationId={params.reservationId}
        maxCapacity={maxCapacity}
      />
    </div>
  );
}
