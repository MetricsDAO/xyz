import { AppHeader } from "./shell-header";

// The Shell component is used to wrap the entire app. It's a good place to put things that should be on every page, like a header or footer.
export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute w-screen h-full top-0 left-0 z-0 overflow-x-hidden" aria-hidden>
        <img src="/img/bg-blur.png" className="absolute -top-2/3 left-1/3 opacity-30" alt="bg blur vibes" />
        <img src="/img/bg-blur.png" className="absolute top-1/2 left-1/2 opacity-20" alt="bg blur vibes" />
        <img src="/img/bg-blur.png" className="absolute top-1/5 -left-[600px] opacity-20" alt="bg blur vibes" />
      </div>

      <AppHeader />

      <main className="relative flex-grow z-10">{children}</main>
    </div>
  );
}
