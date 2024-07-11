"use client";
import { TrashIcon } from "@heroicons/react/24/solid";
import { deleteReservation } from "../_lib/actions";
import { useTransition } from "react";
import SpinnerMini from "./SpinnerMini";

function DeleteReservation({ bookingId, onDelete }) {
  // possible to put the server action in the code
  // function deleteReservation() {
  // need to add use sever as if we put DeleteResercation in a client component
  //  -> it become one as well
  //   "use server";
  //   // code
  // }

  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("Delete this booking?"))
      // for optimistic -> let the list call server action
      // if don't use optimistic -> call server action directly:
      // startTransition(() => deleteReservation(bookingId));
      startTransition(() => onDelete(bookingId));
  }

  return (
    <button
      className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
      onClick={handleDelete}
    >
      {isPending ? (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      ) : (
        <>
          <TrashIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span className="mt-1">Delete</span>
        </>
      )}
    </button>
  );
}

export default DeleteReservation;
