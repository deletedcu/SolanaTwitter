import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Theme } from "react-toastify";

const ThemeContext = createContext<any>({});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // @ts-ignore
    setTheme(window.localStorage.getItem("theme") === null ? "dark" : window.localStorage.getItem("theme"));
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

export default ThemeContext;
