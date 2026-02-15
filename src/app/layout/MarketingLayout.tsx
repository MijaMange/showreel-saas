import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { seedProfilesIfEmpty } from "../profileStore";
import { applyTheme } from "../theme";
import { useHeaderHeight } from "../useHeaderHeight";
import "../../styles/header.css";
import "../../styles/marketing.css";

export function MarketingLayout() {
  const headerRef = useHeaderHeight();

  useEffect(() => {
    seedProfilesIfEmpty();
    applyTheme("Cinematic");
  }, []);

  return (
    <div className="shell marketing">
      <Header ref={headerRef} variant="marketing" />
      <main className="content marketing-main">
        <Outlet />
      </main>
    </div>
  );
}
