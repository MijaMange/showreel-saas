import { useEffect, useRef } from "react";

export function useHeaderHeight() {
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function update() {
      const h = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
    }

    update();
    window.addEventListener("resize", update);

    const el = headerRef.current;
    if (el) {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => {
        window.removeEventListener("resize", update);
        ro.disconnect();
      };
    }

    return () => window.removeEventListener("resize", update);
  }, []);

  return headerRef;
}
