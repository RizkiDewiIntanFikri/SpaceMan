import { useRef, useEffect } from "react";

export default function Header() {
  const inputRef = useRef(null);

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

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 lg:px-6 py-3">
        <button className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-gray-200">
          <span className="sr-only">Toggle sidebar</span>☰
        </button>
        <div className="relative flex-1 max-w-xl">
          <input
            ref={inputRef}
            placeholder="Search or type command…"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-primary-500"
          />
          <span className="absolute left-3 top-2.5 opacity-60"></span>
          <kbd className="absolute right-2 top-2 rounded border px-1.5 text-xs opacity-60">
            ⌘K
          </kbd>
        </div>
        <button className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200">
          🌓
        </button>
        <button className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200">
          🔔
        </button>
        <div className="ml-1 h-10 w-10 overflow-hidden rounded-full border border-gray-200">
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
