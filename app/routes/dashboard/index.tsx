import Header from "~/components/Header";
import ZohoDashboard from "./zoho-dashboard";

export default function Index() {
  return (
    <>
      <section className="site-header-skinny">
        <div className="container">
          <Header />
        </div>
      </section>
      <ZohoDashboard />
    </>
  );
}
