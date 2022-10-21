import { createContext, ReactNode, useEffect, useState } from "react";
import { Theme } from "react-toastify";

interface ThemeContextState {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextState>(null!);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const originTheme = window.localStorage.getItem("theme");
    if (originTheme) {
      setTheme(originTheme as Theme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      window.localStorage.setItem("theme", newTheme);
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
