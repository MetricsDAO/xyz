import IframeResizer from "iframe-resizer-react";
import { Link } from "remix";
import AppHeader from "../../components/app-header-skinny";
import ZohoDashboard from "./zoho-dashboard";

export default function Index() {
  return (
    <>
      <AppHeader />
      <ZohoDashboard />      
    </>
  );
}
