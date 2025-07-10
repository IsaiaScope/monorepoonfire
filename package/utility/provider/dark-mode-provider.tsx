import { createContext, use, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const DarkModeProviderContext = createContext<ThemeProviderState>(initialState);

export function DarkModeProvider({
  children,
  defaultTheme = "system",
  storageKey = "dark-mode",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      },
    }),
    [theme, storageKey],
  );

  return (
    <DarkModeProviderContext {...props} value={value}>
      {children}
    </DarkModeProviderContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDarkMode = () => {
  const context = use(DarkModeProviderContext);

  if (context === undefined)
    throw new Error("useDarkMode must be used within a DarkModeProvider");

  return context;
};
