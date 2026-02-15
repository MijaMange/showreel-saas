import type { Theme } from "./profileStore";

export function applyTheme(theme: Theme) {
  document.body.dataset.theme = theme.toLowerCase();
}
