import { Outlet } from "@remix-run/react";
import Footer from "~/features/marketing-shell/Footer";
import Header from "~/features/marketing-shell/Header";

// This layout is mostly used to isolate the marketing css stuff from the rest of the app.
export default function Marketing() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
