import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import { User } from "@/types";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Loader2, ShieldCheck, Lock } from "lucide-react";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#18181b",
  color: "#fff",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const roleBadge: Record<string, string> = {
  HOKAGE: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  ADMINISTRADOR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  OPERADOR: "bg-zinc-700/50 text-zinc-400 border-zinc-600",
};

export default function Users() {
  const { getUser } = useAuth();
  const currentUser = getUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [tipoAcesso, setTipoAcesso] = useState<User["tipoAcesso"]>("OPERADOR");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<User[]>("/users");
      setUsers(data);
    } catch {
      void toast.fire({ icon: "error", title: "Erro ao carregar usuários" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const openCreate = () => {
    setUsuario("");
    setSenha("");
    setTipoAcesso("OPERADOR");
    setCreateDialogOpen(true);
  };

  const openEditRole = (user: User) => {
    setSelectedUser(user);
    setTipoAcesso(user.tipoAcesso);
    setRoleDialogOpen(true);
  };

  const openChangePassword = (user: User) => {
    setSelectedUser(user);
    setNovaSenha("");
    setPasswordDialogOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/users", { 
        usuario: usuario.toUpperCase(), 
        senha, 
        tipoAcesso 
      });
      void toast.fire({ icon: "success", title: "Usuário criado!" });
      setCreateDialogOpen(false);
      await fetchUsers();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao criar usuário.";
      void toast.fire({ icon: "error", title: message });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);
    try {
      await api.put("/users", { id: selectedUser.id, tipoAcesso });
      void toast.fire({ icon: "success", title: "Role atualizada!" });
      setRoleDialogOpen(false);
      await fetchUsers();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao atualizar role.";
      void toast.fire({ icon: "error", title: message });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);
    try {
      await api.put("/users", { id: selectedUser.id, senha: novaSenha });
      void toast.fire({ icon: "success", title: "Senha atualizada!" });
      setPasswordDialogOpen(false);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao atualizar senha.";
      void toast.fire({ icon: "error", title: message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full bg-zinc-950 text-white overflow-hidden flex flex-col">
      <div className="mx-auto w-full max-w-4xl px-6 py-8 flex flex-col gap-6 h-full">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
            <p className="text-zinc-500 text-sm mt-1">Gerencie os usuários do sistema</p>
          </div>
          <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold gap-2">
            <Plus className="w-4 h-4" />
            Novo Usuário
          </Button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col min-h-0">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-500 uppercase text-xs tracking-widest w-16">#</TableHead>
                <TableHead className="text-zinc-500 uppercase text-xs tracking-widest">Usuário</TableHead>
                <TableHead className="text-zinc-500 uppercase text-xs tracking-widest w-[200px]">Role</TableHead>
                <TableHead className="text-zinc-500 uppercase text-xs tracking-widest text-right w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
          </Table>

          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
            ) : (
              <Table>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell className="text-zinc-600 font-mono text-sm w-16">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <ShieldCheck className="w-3 h-3 text-zinc-400" />
                          </div>
                          <span className="text-white font-medium">{user.usuario}</span>
                          {user.id === currentUser?.id && (
                            <span className="text-xs text-amber-500">(você)</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <span className={`text-xs font-medium px-2 py-1 rounded border uppercase tracking-widest ${roleBadge[user.tipoAcesso]}`}>
                          {user.tipoAcesso}
                        </span>
                      </TableCell>
                      <TableCell className="text-right w-32">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditRole(user)} title="Editar role" className="text-zinc-400 hover:text-white hover:bg-zinc-800 w-8 h-8">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openChangePassword(user)} title="Trocar senha" className="text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 w-8 h-8">
                            <Lock className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Novo Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest">Usuário</Label>
              <Input 
                value={usuario} 
                onChange={(e) => setUsuario(e.target.value.toUpperCase())} 
                required 
                className="bg-zinc-800 border-zinc-700 text-white" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest">Senha</Label>
              <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest">Role</Label>
              <select value={tipoAcesso} onChange={(e) => setTipoAcesso(e.target.value as User["tipoAcesso"])} className="w-full rounded-md bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-amber-500">
                <option value="OPERADOR">OPERADOR</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="HOKAGE">HOKAGE</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-zinc-700 !text-zinc-500 hover:!text-red-400 hover:border-red-800 hover:!bg-red-950/40">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Role — {selectedUser?.usuario}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveRole} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest">Role</Label>
              <select value={tipoAcesso} onChange={(e) => setTipoAcesso(e.target.value as User["tipoAcesso"])} className="w-full rounded-md bg-zinc-800 border border-zinc-700 text-white px-3 py-2 text-sm focus:outline-none focus:border-amber-500">
                <option value="OPERADOR">OPERADOR</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="HOKAGE">HOKAGE</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setRoleDialogOpen(false)} className="border-zinc-700 !text-zinc-500 hover:!text-red-400 hover:border-red-800 hover:!bg-red-950/40">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Trocar Senha — {selectedUser?.usuario}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePassword} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-xs uppercase tracking-widest">Nova Senha</Label>
              <Input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(false)} className="border-zinc-700 !text-zinc-500 hover:!text-red-400 hover:border-red-800 hover:!bg-red-950/40">
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}