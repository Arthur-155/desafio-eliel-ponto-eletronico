"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

type Clock = { h: number; m: number; s: number };
type FormState = {
    nome: string;
    horaEntrada: number;
    minutosEntrada: number;
    segundosEntrada: number;
};

const API_BASE = "http://localhost:8081";
const pad = (n: number) => n.toString().padStart(2, "0");

export default function BaterPonto() {
    const [t, setT] = useState<Clock>(() => {
        const d = new Date();
        return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
    });

    const [form, setForm] = useState<FormState>({
        nome: "",
        horaEntrada: 0,
        minutosEntrada: 0,
        segundosEntrada: 0,
    });

    const [showAlert, setShowAlert] = useState(false);
    const [stamp, setStamp] = useState<Clock | null>(null);
    const [loading, setLoading] = useState(false);
    const timerId = useRef<number | null>(null);

    useEffect(() => {
        timerId.current = window.setInterval(() => {
            const d = new Date();
            setT({ h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() });
        }, 1000);
        return () => {
            if (timerId.current) clearInterval(timerId.current);
        };
    }, []);

    const handleClick = async () => {
        if (!form.nome.trim()) return;

        const d = new Date();
        const snap = { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
        setStamp(snap);

        setForm((prev) => ({
            ...prev,
            horaEntrada: snap.h,
            minutosEntrada: snap.m,
            segundosEntrada: snap.s,
        }));

        setShowAlert(true);

        setLoading(true);
        try {
            await fetch(`${API_BASE}/funcionarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: form.nome.trim(),
                    horaEntrada: snap.h,
                    minutosEntrada: snap.m,
                    segundosEntrada: snap.s,
                }),
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-4">
            {/* Relógio */}
            <div className="flex">
                <h1 className="text-center text-8xl font-extrabold tracking-tight">{pad(t.h)}:</h1>
                <h1 className="text-center text-8xl font-extrabold tracking-tight">{pad(t.m)}:</h1>
                <h1 className="text-center text-8xl font-extrabold tracking-tight">{pad(t.s)}</h1>
            </div>

            {/* Nome do funcionário */}
            <Input
                type="text"
                placeholder="Nome do funcionário"
                className="w-[480px] max-w-full"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            />

            {/* Botão */}
            <Button className="cursor-pointer" onClick={handleClick} disabled={loading || !form.nome.trim()}>
                {loading ? "Enviando..." : "Bater Ponto"}
            </Button>

            {/* Alerta de sucesso */}
            {showAlert && stamp && (
                <Alert className="w-[560px] max-w-full">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Sucesso</AlertTitle>
                    <AlertDescription>
                        Seu ponto foi cadastrado às {pad(stamp.h)}:{pad(stamp.m)}:{pad(stamp.s)}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
