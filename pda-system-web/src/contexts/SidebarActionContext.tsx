import { createContext, useContext, useState } from "react";

type SidebarAction = "create" | "edit" | "delete" | null;

interface SidebarActionContextType {
  action: SidebarAction;
  triggerAction: (action: SidebarAction) => void;
  clearAction: () => void;
}

const SidebarActionContext = createContext<SidebarActionContextType | null>(null);

export function SidebarActionProvider({ children }: { children: React.ReactNode }) {
  const [action, setAction] = useState<SidebarAction>(null);

  const triggerAction = (a: SidebarAction) => setAction(a);
  const clearAction = () => setAction(null);

  return (
    <SidebarActionContext.Provider value={{ action, triggerAction, clearAction }}>
      {children}
    </SidebarActionContext.Provider>
  );
}

export function useSidebarAction() {
  const ctx = useContext(SidebarActionContext);
  if (!ctx) throw new Error("useSidebarAction must be used within SidebarActionProvider");
  return ctx;
}