import { useTransition } from "@remix-run/react";
import type { ReactElement, MutableRefObject } from "react";
import { useEffect, useRef } from "react";

// https://edmund.dev/articles/setting-up-a-global-loading-indicator-in-remix
// https://gist.github.com/edmundhung/023e85cc731466bb5f4b350590ab30ea
function useProgress(): MutableRefObject<HTMLDivElement | null> {
  const el = useRef<HTMLDivElement>(null);
  const timeout = useRef<NodeJS.Timeout>();
  const { location } = useTransition();

  useEffect(() => {
    if (!location || !el.current) {
      return;
    }

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    const currEl = el.current;
    currEl.style.width = `0%`;

    let updateWidth = (ms: number) => {
      timeout.current = setTimeout(() => {
        if (!currEl) {
          return;
        }
        let width = parseFloat(currEl.style.width);
        let percent = !isNaN(width) ? 10 + 0.9 * width : 0;

        currEl.style.width = `${percent}%`;

        updateWidth(100);
      }, ms);
    };

    updateWidth(300);

    return () => {
      clearTimeout(timeout.current);

      if (!currEl || currEl.style.width === `0%`) {
        return;
      }

      currEl.style.width = `100%`;
      timeout.current = setTimeout(() => {
        if (currEl?.style.width !== "100%") {
          return;
        }

        currEl.style.width = ``;
      }, 200);
    };
  }, [location]);

  return el;
}

function Progress(): ReactElement {
  const progress = useProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-[0.35rem] flex">
      <div ref={progress} className="transition-all ease-out bg-sky-500" />
    </div>
  );
}

export default Progress;
