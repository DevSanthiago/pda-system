import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { SidebarActionProvider, useSidebarAction } from "@/contexts/SidebarActionContext";
import Login from "@/pages/Login";
import Products from "@/pages/Products";
import Users from "@/pages/Users";

function AppLayout() {
  const { triggerAction } = useSidebarAction();

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      <Sidebar onAction={triggerAction} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden relative">
          <div className="absolute top-4 right-4 z-40">
            <UserMenu />
          </div>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SidebarActionProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/products" element={<Products />} />
            <Route path="/users" element={<Users />} />
          </Route>
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </SidebarActionProvider>
    </BrowserRouter>
  );
}