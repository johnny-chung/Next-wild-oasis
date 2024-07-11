// import { NextResponse } from "next/server";

// export function middleware(request) {
//   console.log(request);
//   // this alone will redirect infinitely -> need to implement this on route except /about
//   return NextResponse.redirect(new URL("/about", request.url));
// }

// export const config = {
//   matcher: ["/account"],  //this middle only run at route inside matcher array
// };

import { auth } from "@/app/_lib/auth";

export const middleware = auth;

export const config = {
  matcher: ["/account"], 
};


