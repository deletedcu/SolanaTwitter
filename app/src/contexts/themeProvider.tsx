import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeConfig {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeConfig>(null!);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    setTheme(
      window.localStorage.getItem("theme") === null
        ? "light"
        : window.localStorage.getItem("theme")!
    );
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
