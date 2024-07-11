"use server";
import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfile(formData) {
  const session = await auth();
  // usually don't need try catch in server actions, just throw error
  if (!session) throw new Error("Not logged in");

  // formData is a common web api that also work on browser
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  // suppose data is unsafe -> check all data
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Input a valid national ID (a-z, A-Z, 0-9, 6-12 chars)");

  const updateData = { nationalID, nationality, countryFlag };
  await new Promise((res) => setTimeout(res, 2000));
  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);
  // .select()
  // .single();

  if (error) {
    //console.error(error);
    throw new Error("Guest could not be updated");
  }
  // manually revalidate cache
  revalidatePath("/account/profile");
}

// not invoke by form, but by a button
export async function deleteReservation(bookingId) {
  // await new Promise((res) => setTimeout(res, 2000));
  // throw new Error();
  const session = await auth();
  if (!session) throw new Error("Not logged in");

  // check if user is authorizate to delete the booking
  // must be his own booking
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsId = guestBookings.map((booking) => booking.id);

  if (!guestBookingsId.includes(bookingId))
    throw new Error("Not Authorized to delete this booking");

  // actual delete action
  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateReservation(formData) {
  
  // authentication
  const session = await auth();
  if (!session) throw new Error("Not logged in");
  // authorization
  const guestBookings = await getBookings(session.user.guestId);
  const bookingId = Number(formData.get("bookingId"));
  const guestBookingsId = guestBookings.map((booking) => booking.id);
  if (!guestBookingsId.includes(bookingId))
    throw new Error("Not Authorized to edit this booking");
  // update data
  const updatedData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  const { data, error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect("/account/reservations");
}

// create booking using binding method to add more params other then formData
export async function createBooking(bookingData, formData) {
  await new Promise((res) => setTimeout(res, 10000));
  // authentication
  const session = await auth();
  if (!session) throw new Error("Not logged in");

  // create an obj for formData if formData has many field
  // Object.entries(formData.entries())
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extraPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };
  //console.log(newBooking);
  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    console.log(error);
    throw new Error("Booking could not be created");
  }
  revalidatePath(`/cabin/${bookingData.cabinId}`);
}
