import { AppHeader } from "./AppHeader";

// The Shell component is used to wrap the entire app. It's a good place to put things that should be on every page, like a header or footer.
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader
        links={[
          { link: "/app/ecosystem", label: "Ecosystem" },
          { link: "/app/brainstorm", label: "Brainstorm" },
          { link: "/app/analyze", label: "Analyze" },
        ]}
        userLinks={[{ link: "/app/rewards", label: "Rewards" }]}
      />
      <main className="flex-grow">{children}</main>

      {/* TODO: Not sticking to footer properly */}
      {/* <StatsBar /> */}
    </div>
  );
}

/* function StatsBar() {
  return (
    <div className="flex flex-row w-full h-14 absolute bottom-0 bg-neutral-200 text-neutral-400 items-center justify-center">
      Stats Bar
    </div>
  );
} */
