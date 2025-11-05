"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const API_BASE = "http://localhost:8081";

type FuncionarioAPI = {
  id: number;
  nome: string;
  horaEntrada: number | null;
  minutosEntrada: number | null;
  segundosEntrada: number | null;
};

type Registro = { id: number; nome: string; hora: string };

const pad = (n: number) => n.toString().padStart(2, "0");
const toHora = (h?: number | null, m?: number | null, s?: number | null) =>
  h == null || m == null || s == null ? "-" : `${pad(h)}:${pad(m)}:${pad(s)}`;

export default function ConsultarPonto() {
  const [nome, setNome] = useState("");
  const [filtro, setFiltro] = useState("");
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch(`${API_BASE}/funcionarios`, { method: "GET" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arr: FuncionarioAPI[] = await res.json();

      const mapped: Registro[] = arr.map((f) => ({
        id: f.id,
        nome: f.nome,
        hora: toHora(f.horaEntrada, f.minutosEntrada, f.segundosEntrada),
      }));
      setRegistros(mapped);
    } catch (e: any) {
      setErro(e?.message ?? "Erro ao carregar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const filtrados = useMemo(() => {
    const q = filtro.trim().toLowerCase();
    if (!q) return registros;
    return registros.filter((r) => r.nome.toLowerCase().includes(q));
  }, [registros, filtro]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Nome do funcionário"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Button
            className="cursor-pointer"
            onClick={() => setFiltro(nome)} // “Buscar” aplica filtro local
          >
            Buscar
          </Button>
          <Button
            variant="outline"
            onClick={carregar}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </Button>
        </div>
        <Input
          className="sm:ml-auto sm:w-64"
          placeholder="Filtrar por nome..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {erro && (
        <div className="text-sm text-red-600">{erro}</div>
      )}

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">Funcionário</TableHead>
              <TableHead className="text-right">Horário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length ? (
              filtrados.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.nome}</TableCell>
                  <TableCell className="text-right">{r.hora}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  {loading ? "Carregando..." : "Nenhum registro."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>{filtrados.length} registro(s)</div>
        <Button variant="outline" size="sm" onClick={() => setFiltro("")}>
          Limpar filtro
        </Button>
      </div>
    </div>
  );
}
