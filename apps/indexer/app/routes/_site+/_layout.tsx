import { Outlet } from "@remix-run/react";
import Header from "~/features/marketing-shell/header";

// This layout is mostly used to isolate the marketing css stuff from the rest of the app.
export default function Marketing() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
