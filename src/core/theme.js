const THEME_KEY = 'legal-dashboard-theme-v1';

export function getStoredTheme() {
  return 'light';
}

export function applyTheme(theme = getStoredTheme(), persist = false) {
  document.documentElement.dataset.theme = 'light';
  document.documentElement.style.colorScheme = 'light';

  try {
    window.localStorage?.setItem(THEME_KEY, 'light');
  } catch {}

  return 'light';
}

export function toggleTheme() {
  return applyTheme('light', true);
}

export function initThemeUi() {
  applyTheme('light', true);
}
