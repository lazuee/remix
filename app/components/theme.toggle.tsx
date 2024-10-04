import { Theme, useTheme } from "remix-themes";

export function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)}
      className={`w-full rounded-md border border-zinc-400 bg-zinc-200 p-2 px-4 text-xs font-medium text-zinc-800 transition-colors duration-200 ease-in-out hover:bg-zinc-300 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600 sm:w-fit`}>
      {theme === Theme.LIGHT ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
