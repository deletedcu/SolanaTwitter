import { useState } from "react";
import { darkIcon, lightIcon } from "../assets/icons";
import { useTheme } from "../contexts/themeProvider";

export default function ThemeSwitcher() {
  const [hover, setHover] = useState(false);
  const { theme, toggleTheme } = useTheme();
  console.log('theme', theme)
  return (
    <div className="flex items-center">
      <button
        className="text-skin-secondary"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={toggleTheme}
      >
        {hover
          ? theme === "light"
            ? darkIcon
            : lightIcon
          : theme === "light"
          ? lightIcon
          : darkIcon}
      </button>
    </div>
  );
}
