// Responsive layout for body content. Left and right panels are optional.

/** Example
 *    <Layout>
        <Layout.Content>
          <p>Content<p>
        </Layout.Content>
        <Layout.RightPanel>
          <p>Right Panel<p>
        </Layout.RightPanel>
      </Layout>
 *
 */

// Smaller screens need less padding on top
const sectionPadding = "tw-pt-5 md:tw-pt-10 tw-px-6";
export function Layout({ children }: { children: React.ReactNode }) {
  // Column on mobile, row on desktop
  return <main className="tw-flex tw-flex-col lg:tw-flex-row tw-justify-center">{children}</main>;
}

// eslint-disable-next-line react/display-name
Layout.LeftPanel = ({ children }: { children: React.ReactNode }) => {
  return <section className={`${sectionPadding} tw-basis-1/4 tw-border-r`}>{children}</section>;
};

// eslint-disable-next-line react/display-name
Layout.Content = ({ children }: { children: React.ReactNode }) => {
  return <section className={`${sectionPadding} tw-basis-1/2`}>{children}</section>;
};

// eslint-disable-next-line react/display-name
Layout.RightPanel = ({ children }: { children: React.ReactNode }) => {
  return <section className={`${sectionPadding} tw-basis-1/4 tw-border-l`}>{children}</section>;
};
