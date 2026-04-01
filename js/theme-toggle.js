(() => {
  const STORAGE_KEY = "bistora-theme";
  const DARK = "dark";
  const LIGHT = "light";
  const root = document.documentElement;
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored === DARK || stored === LIGHT ? stored : null;
    } catch (error) {
      return null;
    }
  }

  function getSystemTheme() {
    return mediaQuery.matches ? DARK : LIGHT;
  }

  function getPreferredTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function applyTheme(theme) {
    const resolvedTheme = theme === DARK ? DARK : LIGHT;
    root.classList.toggle(DARK, resolvedTheme === DARK);
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
    syncThemeLogos(resolvedTheme);
    syncToggles(resolvedTheme);
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* noop */
    }
  }

  function clearStoredTheme() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* noop */
    }
  }

  function toggleTheme() {
    const nextTheme = root.classList.contains(DARK) ? LIGHT : DARK;
    applyTheme(nextTheme);
    persistTheme(nextTheme);
  }

  function syncToggles(theme) {
    const isDark = theme === DARK;
    document.querySelectorAll(".theme-toggole-button-wrap").forEach((toggle) => {
      toggle.setAttribute("role", "button");
      toggle.setAttribute("tabindex", "0");
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
      toggle.dataset.theme = theme;
    });
  }

  function syncThemeLogos(theme) {
    const isDark = theme === DARK;
    document.querySelectorAll("img[data-logo-light][data-logo-dark]").forEach((logo) => {
      const nextSrc = isDark ? logo.dataset.logoDark : logo.dataset.logoLight;
      if (nextSrc && logo.getAttribute("src") !== nextSrc) {
        logo.setAttribute("src", nextSrc);
      }
    });
  }

  function bindToggle(toggle) {
    if (toggle.dataset.themeToggleBound === "true") {
      return;
    }

    toggle.dataset.themeToggleBound = "true";
    toggle.addEventListener("click", toggleTheme);
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleTheme();
      }
    });
  }

  function init() {
    applyTheme(getPreferredTheme());
    document
      .querySelectorAll(".theme-toggole-button-wrap")
      .forEach((toggle) => bindToggle(toggle));
  }

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", (event) => {
      if (getStoredTheme()) {
        return;
      }
      applyTheme(event.matches ? DARK : LIGHT);
    });
  } else if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener((event) => {
      if (getStoredTheme()) {
        return;
      }
      applyTheme(event.matches ? DARK : LIGHT);
    });
  }

  window.BistoraTheme = {
    applyTheme,
    clearStoredTheme,
    getPreferredTheme,
    toggleTheme,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
