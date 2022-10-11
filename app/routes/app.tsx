import { Outlet } from "@remix-run/react";
import Header from "~/components/app/Header";
import WalletProvider from "~/components/app/WalletProvider";

export default function Index() {
  return (
    <WalletProvider>
      <Header />
      <Outlet />
    </WalletProvider>
  );
}
