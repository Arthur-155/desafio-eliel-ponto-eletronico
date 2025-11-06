"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

const API_BASE = "http://localhost:8081";

/** Ajuste os campos conforme sua API */
type BloqueadoAPI = {
    id: number;
    nome: string;
    motivo?: string | null;       // ex: "Atraso acima de 15min"
    bloqueado: boolean;           // true
    horaEntrada: number | null;
    minutosEntrada: number | null;
    segundosEntrada: number | null;
};

type Row = {
    id: number;
    nome: string;
    motivo: string;
    hora: string;                 // "HH:MM:SS" ou "-"
    bloqueado: boolean;
};

// 1) Coloque no topo, perto dos helpers:
const HORA_PREVISTA = "08:00:00"; // ajuste
const TOL_MIN = 5;                // ajuste

const parseHHMMSS = (str: string): number | null => {
    if (!str || str === "-") return null;
    const [h, m, s = "0"] = str.split(":");
    const hh = Number(h), mm = Number(m), ss = Number(s);
    if ([hh, mm, ss].some(Number.isNaN)) return null;
    return hh * 3600 + mm * 60 + ss;
};

const isAtrasado = (horaBatida: string): boolean => {
    const previsto = parseHHMMSS(HORA_PREVISTA) ?? 0;
    const limite = previsto + TOL_MIN * 60;
    const batida = parseHHMMSS(horaBatida);

    if (batida != null) return batida > limite;

    const now = new Date();
    const nowSec = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return nowSec > limite; // sem batida e já passou do limite
};


const pad = (n: number) => n.toString().padStart(2, "0");
const toHora = (h?: number | null, m?: number | null, s?: number | null) =>
    h == null || m == null || s == null ? "-" : `${pad(h)}:${pad(m)}:${pad(s)}`;


export default function PaginaBloqueados() {
    const [rows, setRows] = useState<Row[]>([]);
    const [erro, setErro] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // filtros
    const [q, setQ] = useState("");

    // edição inline por linha
    const [editing, setEditing] = useState<Record<number, { nome: string; hora: string }>>({});
    const [savingId, setSavingId] = useState<number | null>(null);
    const [unlockingId, setUnlockingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const carregar = async () => {
        setLoading(true);
        setErro(null);
        try {
            // Endpoint sugerido. Altere se sua API for diferente:
            // GET /funcionarios?bloqueado=true
            // ou GET /funcionarios/bloqueados
            const res = await fetch(`${API_BASE}/funcionarios?bloqueado=true`, { method: "GET", cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: BloqueadoAPI[] = await res.json();

            const mapped: Row[] = data
                .filter(f => f.bloqueado) // redundância segura
                .map(f => ({
                    id: f.id,
                    nome: f.nome,
                    motivo: f.motivo ?? "Atraso",
                    hora: toHora(f.horaEntrada, f.minutosEntrada, f.segundosEntrada),
                    bloqueado: true,
                }));

            setRows(mapped);

            // inicializa buffers de edição
            const init: Record<number, { nome: string; hora: string }> = {};
            mapped.forEach(r => {
                init[r.id] = { nome: r.nome, hora: r.hora === "-" ? "" : r.hora };
            });
            setEditing(init);
        } catch (e: any) {
            setErro(e?.message ?? "Erro ao carregar bloqueados");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregar();
    }, []);

    const filtrados = useMemo(() => {
        const k = q.trim().toLowerCase();
        const base = k
            ? rows.filter(r => r.nome.toLowerCase().includes(k) || r.motivo.toLowerCase().includes(k))
            : rows;

        // Mostrar somente quem está bloqueado OU identificado como atrasado pela regra local
        return base.filter(r => r.bloqueado || isAtrasado(r.hora));
    }, [rows, q]);


    const salvarLinha = async (id: number) => {
        const edit = editing[id];
        if (!edit) return;

        // normaliza hora
        let horaNorm = edit.hora.trim();
        if (horaNorm && horaNorm.length === 5) horaNorm = `${horaNorm}:00`; // HH:MM -> HH:MM:SS
        const sec = horaNorm ? parseHHMMSS(horaNorm) : null;
        let payload: any = { nome: edit.nome };
        if (sec != null) {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = sec % 60;
            payload = { ...payload, horaEntrada: h, minutosEntrada: m, segundosEntrada: s };
        } else {
            // hora vazia: opcionalmente zere a batida
            payload = { ...payload, horaEntrada: null, minutosEntrada: null, segundosEntrada: null };
        }

        try {
            setSavingId(id);
            setErro(null);
            // PUT /funcionarios/:id  ou /funcionarios/:id/ponto
            const res = await fetch(`${API_BASE}/funcionarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await carregar();
        } catch (e: any) {
            setErro(e?.message ?? "Falha ao salvar");
        } finally {
            setSavingId(null);
        }
    };

    const desbloquear = async (id: number) => {
        try {
            setUnlockingId(id);
            setErro(null);
            // POST/PUT para desbloquear. Exemplos:
            // PUT /funcionarios/:id/status { bloqueado:false }
            // ou POST /funcionarios/:id/desbloquear
            const res = await fetch(`${API_BASE}/funcionarios/${id}/desbloquear`, {
                method: "POST",
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await carregar();
        } catch (e: any) {
            setErro(e?.message ?? "Falha ao desbloquear");
        } finally {
            setUnlockingId(null);
        }
    };

    const excluir = async (id: number) => {
        try {
            setDeletingId(id);
            setErro(null);
            // DELETE /funcionarios/:id  ou apenas o ponto: DELETE /funcionarios/:id/ponto
            const res = await fetch(`${API_BASE}/funcionarios/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await carregar();
        } catch (e: any)  {
            setErro(e?.message ?? "Falha ao excluir");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl space-y-4 p-4">
            <h1 className="text-xl font-semibold">Usuários bloqueados por atraso</h1>

            <div className="flex items-center gap-2">
                <Input
                    className="max-w-sm"
                    placeholder="Buscar por nome ou motivo…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <Button variant="outline" onClick={carregar} disabled={loading} className="cursor-pointer">
                    {loading ? "Atualizando..." : "Atualizar"}
                </Button>
            </div>

            {erro && <div className="text-sm text-red-600">{erro}</div>}

            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[26%]">Nome</TableHead>
                            <TableHead className="w-[18%]">Motivo</TableHead>
                            <TableHead className="w-[16%]">Horário atual</TableHead>
                            <TableHead className="w-[20%]">Editar</TableHead>
                            <TableHead className="w-[20%]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtrados.length ? (
                            filtrados.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell>
                                        <Input
                                            value={editing[r.id]?.nome ?? ""}
                                            onChange={(e) =>
                                                setEditing((p) => ({ ...p, [r.id]: { ...p[r.id], nome: e.target.value } }))
                                            }
                                        />
                                    </TableCell>

                                    <TableCell className="align-middle">{r.motivo}</TableCell>

                                    <TableCell className="align-middle">{r.hora}</TableCell>

                                    <TableCell>
                                        <Input
                                            type="time"
                                            step={1}
                                            placeholder="HH:MM:SS"
                                            value={editing[r.id]?.hora ?? ""}
                                            onChange={(e) =>
                                                setEditing((p) => ({ ...p, [r.id]: { ...p[r.id], hora: e.target.value } }))
                                            }
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => salvarLinha(r.id)}
                                                disabled={savingId === r.id}
                                                className="cursor-pointer"
                                            >
                                                {savingId === r.id ? "Salvando..." : "Salvar"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => desbloquear(r.id)}
                                                disabled={unlockingId === r.id}
                                                className="cursor-pointer"
                                            >
                                                {unlockingId === r.id ? "Desbloqueando..." : "Desbloquear"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => excluir(r.id)}
                                                disabled={deletingId === r.id}
                                                className="cursor-pointer"
                                            >
                                                {deletingId === r.id ? "Excluindo..." : "Excluir"}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    {loading ? "Carregando..." : "Nenhum bloqueado."}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>{filtrados.length} registro(s)</div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQ("")}
                    className="cursor-pointer"
                >
                    Limpar busca
                </Button>
            </div>
        </div>
    );
}
