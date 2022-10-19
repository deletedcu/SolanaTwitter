import { useState } from "react";
import { useTheme } from "../contexts/themeProvider";

export default function ThemeSwitcher() {
  const [hover, setHover] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center">
      <button
        className={`swap swap-rotate text-color-secondary ${
          hover ? "swap-active" : ""
        }`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={toggleTheme}
      >
        {/** dark icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`iconify iconify--heroicons-outline ${
            theme === "dark" ? "swap-on" : "swap-off"
          }`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z"
          />
        </svg>
        {/** light icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`iconify iconify--heroicons-outline ${
            theme === "light" ? "swap-on" : "swap-off"
          }`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 0 1 8.646 3.646A9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646Z"
          />
        </svg>
      </button>
    </div>
  );
}
