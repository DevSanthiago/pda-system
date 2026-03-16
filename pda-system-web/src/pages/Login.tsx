import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import api from "@/services/api";
import { AuthPayload, LoginResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/auth/login", { usuario, senha });
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode<AuthPayload>(data.token);
      localStorage.setItem("user", JSON.stringify(decoded));
      navigate("/products");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Erro ao conectar com o servidor.";
      await Swal.fire({
        icon: "error",
        title: "Falha no login",
        text: message,
        background: "#18181b",
        color: "#fff",
        confirmButtonColor: "#f59e0b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500 mb-4">
            <span className="material-symbols-outlined text-zinc-950" style={{ fontSize: "28px" }}>usb</span>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-widest uppercase">PDA System</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerenciamento de Pesos</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="usuario" className="text-zinc-300 text-xs uppercase tracking-widest">
              Usuário
            </Label>
            <Input
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ex: ISADORA FIGUEIRA"
              required
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha" className="text-zinc-300 text-xs uppercase tracking-widest">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="senha"
                type={showPassword ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-500 focus:ring-amber-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase tracking-widest mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}