import Header from "~/components/Header";
import XmetricDashboard from "./xmetric-dashboard";

export default function xMetric() {
  return (
    <>
      <section className="site-header-skinny">
        <div className="container">
          <Header />
        </div>
      </section>
      <XmetricDashboard />
    </>
  );
}
