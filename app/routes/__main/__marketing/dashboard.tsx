import AppFooter from "~/components/Footer";
import Header from "~/components/Header";

export default function Index() {
  return (
    <>
      <section className="site-header-skinny">
        <div className="container">
          <Header />
        </div>
      </section>
      <iframe
        src="https://analytics.zoho.com/open-view/2467969000003171716"
        width={"100%"}
        height={3850}
        title="ZohoDashboard"
      />
      <AppFooter />
    </>
  );
}
