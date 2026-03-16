export interface User {
  id: number;
  usuario: string;
  tipoAcesso: "OPERADOR" | "ADMINISTRADOR" | "HOKAGE";
}

export interface AuthPayload {
  id: number;
  usuario: string;
  role: "OPERADOR" | "ADMINISTRADOR" | "HOKAGE";
}

export interface LoginResponse {
  message: string;
  token: string;
  expiresIn: number;
}

export interface Product {
  id: number;
  produto: string;
  pesoMinMenor: string | null;
  pesoMaxMenor: string | null;
  pesoStartMenor: string | null;
  pesoMinMaior: string | null;
  pesoMaxMaior: string | null;
  pesoStartMaior: string | null;
  tamanhoFonte: string | null;
  revisao: number | null;
  dataHora: string | null;
  usuario: string | null;
}

export interface ProductRequest {
  produto: string;
  pesoMinMenor: string;
  pesoMaxMenor: string;
  pesoStartMenor: string;
  pesoMinMaior: string;
  pesoMaxMaior: string;
  pesoStartMaior: string;
  tamanhoFonte: string;
  revisao: number;
}