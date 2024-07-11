"use client";
import React, { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";

import { deleteReservation } from "../_lib/actions";

export default function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);

      // for add booking
      // return [...bookings, newBooking]
    }
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    // call the actual server action
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
