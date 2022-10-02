// Smaller screens need less padding on top
const sectionPadding = "tw-pt-5 md:tw-pt-10 tw-px-6";

export function Layout({ children }: { children: React.ReactNode }) {
  // Column on mobile, row on desktop
  return <main className="tw-flex tw-flex-col md:tw-flex-row">{children}</main>;
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
