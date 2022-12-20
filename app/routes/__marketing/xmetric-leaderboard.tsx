import AppFooter from "~/features/marketing-shell/footer";
import Header from "~/features/marketing-shell/header";

export default function xMetric() {
  return (
    <>
      <section className="site-header-skinny">
        <div className="container">
          <Header />
        </div>
      </section>
      <iframe
        src="https://analytics.zoho.com/open-view/2467969000005415175"
        width={"100%"}
        height={2200}
        title="xMetric Dashboard"
      />
      <AppFooter />
    </>
  );
}
