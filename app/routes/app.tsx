import { Outlet } from "@remix-run/react";
import AppFooter from "~/components/app/Footer";
import Header from "~/components/app/Header";
import WalletProvider from "~/components/app/WalletProvider";

export default function Index() {
  return (
    <WalletProvider>
      <Header />
      <Outlet />
      <AppFooter />
    </WalletProvider>
  );
}
