import { useEffect, useState } from "react";
import { Button } from "../button"

type Clock = { h: number; m: number; s: number };
const pad = (n: number) => n.toString().padStart(2, "0");

export default function BaterPonto() {
    const [t, setT] = useState<Clock>(() => {
        const date = new Date();
        return { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds() }
    });

    useEffect(() => {
        const id = setInterval(() => {
            const d = new Date();
            setT({ h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() });
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6">
            <div className="flex">
                <h1 className="text-center text-8xl font-extrabold tracking-tight">
                    {pad(t.h)}:
                </h1>
                <h1 className="text-center text-8xl font-extrabold tracking-tight">
                    {pad(t.m)}:
                </h1>
                <h1 className="text-center text-8xl font-extrabold tracking-tight">
                    {pad(t.s)}
                </h1>
            </div>
            <Button className="cursor-pointer">Bater Ponto</Button>
        </div>
    );
}


