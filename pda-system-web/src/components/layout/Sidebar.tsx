import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Package, Users,
  ChevronDown, ChevronUp, Plus, Trash2,
} from "lucide-react";

interface SidebarProps {
  onAction?: (action: "create" | "delete") => void;
}

export function Sidebar({ onAction }: SidebarProps) {
  const { isAdmin, isHokage } = useAuth();
  const location = useLocation();
  const [pdaOpen, setPdaOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{ width: expanded ? "220px" : "56px", transition: "width 300ms ease" }}
      className="min-h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0 overflow-hidden"
    >
      <div className="h-14 flex items-center border-b border-zinc-800 shrink-0 overflow-hidden">
        <div className="flex items-center justify-center shrink-0" style={{ width: "56px" }}>
          <div className="flex items-center justify-center w-8 h-8 rounded bg-amber-500">
            <span className="material-symbols-outlined text-zinc-950" style={{ fontSize: "18px" }}>usb</span>
          </div>
        </div>
        <span
          style={{ opacity: expanded ? 1 : 0, transition: "opacity 200ms ease" }}
          className="text-white font-bold tracking-widest uppercase text-sm whitespace-nowrap"
        >
          PDA System
        </span>
      </div>

      <nav className="flex-1 py-3 space-y-1 overflow-y-auto overflow-x-hidden">

        <button
          onClick={() => expanded && setPdaOpen((v) => !v)}
          title="PDA"
          className="w-full flex items-center text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors overflow-hidden"
          style={{ height: "40px" }}
        >
          <div className="flex items-center justify-center shrink-0" style={{ width: "56px" }}>
            <Package className="w-4 h-4" />
          </div>
          <span
            style={{ opacity: expanded ? 1 : 0, transition: "opacity 150ms ease", flex: 1 }}
            className="whitespace-nowrap text-left"
          >
            PDA
          </span>
          {expanded && (
            <div className="pr-3">
              {pdaOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </div>
          )}
        </button>

        {expanded && pdaOpen && (
          <div className="ml-3 border-l border-zinc-800 pl-2 space-y-1">
            <Link
              to="/products"
              className={`flex items-center gap-2 pl-3 pr-3 py-2 rounded-lg text-sm transition-colors ${
                isActive("/products") ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Package className="w-3 h-3 shrink-0" />
              <span className="whitespace-nowrap">Buscar Produto</span>
            </Link>

            {isAdmin() && (
              <>
                <button
                  onClick={() => onAction?.("create")}
                  className="w-full flex items-center gap-2 pl-3 pr-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <Plus className="w-3 h-3 shrink-0" />
                  <span className="whitespace-nowrap">Cadastrar Produto</span>
                </button>
                <button
                  onClick={() => onAction?.("delete")}
                  className="w-full flex items-center gap-2 pl-3 pr-3 py-2 rounded-lg text-sm text-red-500/70 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="w-3 h-3 shrink-0" />
                  <span className="whitespace-nowrap">Excluir Produto</span>
                </button>
              </>
            )}
          </div>
        )}

        {isHokage() && (
          <Link
            to="/users"
            title="Usuários"
            className={`flex items-center text-sm transition-colors overflow-hidden ${
              isActive("/users") ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
            style={{ height: "40px" }}
          >
            <div className="flex items-center justify-center shrink-0" style={{ width: "56px" }}>
              <Users className="w-4 h-4" />
            </div>
            <span
              style={{ opacity: expanded ? 1 : 0, transition: "opacity 150ms ease" }}
              className="whitespace-nowrap"
            >
              Gerenciar Usuários
            </span>
          </Link>
        )}
      </nav>
    </aside>
  );
}