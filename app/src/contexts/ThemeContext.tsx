import { createContext, ReactNode, useEffect, useState } from "react";
import windowExist from "../utils/windowExist";

export type ThemeMode = "dark" | "light"
interface ThemeContextState {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextState>(null!);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const savePreference = (m: string) => localStorage.setItem("theme", m);

  useEffect(() => {
    const originTheme = window.localStorage.getItem("theme");
    if (originTheme) {
      setTheme(originTheme as ThemeMode);
    }
  }, []);

  const toggleTheme = () => {
    if (windowExist()) {
      document.documentElement.classList.toggle("dark");
    }

    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      savePreference(newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
