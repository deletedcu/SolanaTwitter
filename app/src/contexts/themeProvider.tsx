import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Theme } from "react-toastify";

interface ThemeConfig {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeConfig>(null!);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // @ts-ignore
    setTheme(window.localStorage.getItem("theme") === null ? "dark" : window.localStorage.getItem("theme")!);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeContext);
};
