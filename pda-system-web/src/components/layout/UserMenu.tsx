import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";

export function UserMenu() {
  const { getUser, logout } = useAuth();
  const user = getUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
      >
        <User className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.usuario}</p>
                <p className="text-amber-500 text-xs uppercase tracking-widest mt-0.5">{user?.role}</p>
              </div>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}