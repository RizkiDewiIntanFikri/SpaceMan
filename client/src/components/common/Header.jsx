import { useRef, useEffect } from "react";
import { useTheme } from "../../context/themeContext"; // Adjust the path as needed
export default function Header() {
  const inputRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const bgColor = theme === "light" ? "white" : "black";
  const borderColor = theme === "light" ? "#e5e7eb" : "#1f1f1f";
  const textColor = theme === "light" ? "black" : "white";

  return (
    <header
      className="sticky top-0 z-20 backdrop-blur"
      style={{
        backgroundColor: bgColor,
        borderBottom: `1px solid ${borderColor}`,
        color: textColor,
      }}
    >
      <div className="flex items-center gap-3 px-4 lg:px-6 py-3">
        <button
          className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-xl"
          style={{ border: `1px solid ${borderColor}`, color: textColor }}
        >
          <span className="sr-only">Toggle sidebar</span>☰
        </button>

        <div className="relative flex-1 max-w-xl">
          <input
            ref={inputRef}
            placeholder="Search or type command…"
            className="w-full rounded-xl px-4 py-2 pl-10 text-sm outline-none"
            style={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              color: textColor,
            }}
          />
          <kbd
            className="absolute right-2 top-2 rounded border px-1.5 text-xs opacity-60"
            style={{ border: `1px solid ${borderColor}`, color: textColor }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Tombol toggle theme */}
        <button
          onClick={toggleTheme}
          className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ border: `1px solid ${borderColor}`, color: textColor }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <div
          className="ml-1 h-10 w-10 overflow-hidden rounded-full"
          style={{ border: `1px solid ${borderColor}` }}
        >
          <img
            alt="avatar"
            src="https://thumbs.dreamstime.com/b/generated-image-372601986.jpg"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
