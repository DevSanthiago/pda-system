import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSidebarAction } from "@/contexts/SidebarActionContext";
import api from "@/services/api";
import { Product, ProductRequest } from "@/types";
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
import { Search, Loader2, Package, Pencil } from "lucide-react";

const emptyForm: ProductRequest = {
  produto: "",
  pesoMinMenor: "",
  pesoMaxMenor: "",
  pesoStartMenor: "",
  pesoMinMaior: "",
  pesoMaxMaior: "",
  pesoStartMaior: "",
  tamanhoFonte: "",
  revisao: 0,
};

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

const swalDark = {
  background: "#18181b",
  color: "#fff",
  confirmButtonColor: "#f59e0b",
};

export default function Products() {
  const { isAdmin } = useAuth();
  const { action, clearAction } = useSidebarAction();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "delete">("create");
  const [form, setForm] = useState<ProductRequest>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!action) return;

    void navigate("/products");

    if (action === "create") {
      setDialogMode("create");
      setForm(emptyForm);
      setDialogOpen(true);
    } else if (action === "edit") {
      if (!product) {
        void toast.fire({ icon: "info", title: "Busque um produto primeiro" });
      } else {
        setDialogMode("edit");
        setForm({
          produto: product.produto,
          pesoMinMenor: product.pesoMinMenor ?? "",
          pesoMaxMenor: product.pesoMaxMenor ?? "",
          pesoStartMenor: product.pesoStartMenor ?? "",
          pesoMinMaior: product.pesoMinMaior ?? "",
          pesoMaxMaior: product.pesoMaxMaior ?? "",
          pesoStartMaior: product.pesoStartMaior ?? "",
          tamanhoFonte: product.tamanhoFonte ?? "",
          revisao: product.revisao ?? 0,
        });
        setDialogOpen(true);
      }
    } else if (action === "delete") {
      if (!product) {
        void toast.fire({ icon: "info", title: "Busque um produto primeiro" });
      } else {
        void handleDelete();
      }
    }

    clearAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setProduct(null);
    try {
      const { data } = await api.get<Product>("/products", { params: { produto: search } });
      setProduct(data);
    } catch {
      void toast.fire({ icon: "warning", title: "Produto não encontrado" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (dialogMode === "edit") {
        await api.put("/products", form);
        void toast.fire({ icon: "success", title: "Produto atualizado!" });
      } else {
        await api.post("/products", form);
        void toast.fire({ icon: "success", title: "Produto cadastrado!" });
      }
      setDialogOpen(false);
      setSearch(form.produto);
      const { data } = await api.get<Product>("/products", { params: { produto: form.produto } });
      setProduct(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao salvar produto.";
      void toast.fire({ icon: "error", title: message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    const result = await Swal.fire({
      icon: "warning",
      title: "Excluir produto?",
      text: `"${product.produto}" será removido permanentemente.`,
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      ...swalDark,
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete("/products", { data: { produto: product.produto } });
      void toast.fire({ icon: "success", title: "Produto excluído!" });
      setProduct(null);
      setSearch("");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao excluir produto.";
      void toast.fire({ icon: "error", title: message });
    }
  };

  const setField = (key: keyof ProductRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="flex flex-col bg-zinc-950 text-white"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-zinc-500 text-sm mt-1">Consulte e gerencie os pesos dos produtos</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
            placeholder="Digite o código do produto..."
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-amber-500"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Buscar
          </Button>
        </form>

        {product && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Package className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="font-bold text-lg">{product.produto}</p>
                <p className="text-zinc-500 text-xs">
                  Rev. {product.revisao ?? "—"} · Atualizado por {product.usuario ?? "—"}
                </p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: "Peso Mín. Menor", value: product.pesoMinMenor },
                { label: "Peso Máx. Menor", value: product.pesoMaxMenor },
                { label: "Peso Start Menor", value: product.pesoStartMenor },
                { label: "Peso Mín. Maior", value: product.pesoMinMaior },
                { label: "Peso Máx. Maior", value: product.pesoMaxMaior },
                { label: "Peso Start Maior", value: product.pesoStartMaior },
                { label: "Tamanho Fonte", value: product.tamanhoFonte },
                {
                  label: "Última atualização",
                  value: product.dataHora
                    ? new Date(product.dataHora).toLocaleString("pt-BR")
                    : "—",
                },
              ].map(({ label, value }) => (
                <div key={label} className="bg-zinc-800/50 rounded-lg px-4 py-3">
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-white font-mono font-medium">{value ?? "—"}</p>
                </div>
              ))}
            </div>

            {isAdmin() && (
              <div className="px-6 pb-5 flex justify-start">
                <Button
                  onClick={() => {
                    setDialogMode("edit");
                    setForm({
                      produto: product.produto,
                      pesoMinMenor: product.pesoMinMenor ?? "",
                      pesoMaxMenor: product.pesoMaxMenor ?? "",
                      pesoStartMenor: product.pesoStartMenor ?? "",
                      pesoMinMaior: product.pesoMinMaior ?? "",
                      pesoMaxMaior: product.pesoMaxMaior ?? "",
                      pesoStartMaior: product.pesoStartMaior ?? "",
                      tamanhoFonte: product.tamanhoFonte ?? "",
                      revisao: product.revisao ?? 0,
                    });
                    setDialogOpen(true);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold gap-2"
                >
                  <Pencil className="w-3 h-3" />
                  Editar Produto
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {isAdmin() && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">
                {dialogMode === "edit" ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label className="text-zinc-400 text-xs uppercase tracking-widest">
                  Código do Produto
                </Label>
                <Input
                  value={form.produto}
                  onChange={(e) => setField("produto", e.target.value.toUpperCase())}
                  disabled={dialogMode === "edit"}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["pesoMinMenor", "Peso Mín. Menor"],
                    ["pesoMaxMenor", "Peso Máx. Menor"],
                    ["pesoStartMenor", "Peso Start Menor"],
                    ["pesoMinMaior", "Peso Mín. Maior"],
                    ["pesoMaxMaior", "Peso Máx. Maior"],
                    ["pesoStartMaior", "Peso Start Maior"],
                    ["tamanhoFonte", "Tamanho Fonte"],
                    ["revisao", "Revisão"],
                  ] as [keyof ProductRequest, string][]
                ).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-zinc-400 text-xs uppercase tracking-widest">{label}</Label>
                    <Input
                      value={form[key]}
                      onChange={(e) =>
                        setField(key, key === "revisao" ? Number(e.target.value) : e.target.value)
                      }
                      type={key === "revisao" ? "number" : "text"}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="border-zinc-700 !text-zinc-500 hover:!text-red-400 hover:border-red-800 hover:!bg-red-950/40"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}