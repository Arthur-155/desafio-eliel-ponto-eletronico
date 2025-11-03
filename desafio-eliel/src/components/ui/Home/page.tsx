import { BadgeCheckIcon } from "lucide-react";

export default function Home() {
    return (
        <div>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance mt-15">
                Desafio Ponto Eletrônico
            </h1>
            <h2 className="scroll-m-20 text-center border-b pb-2 text-3xl font-semibold tracking-tight mt-15">
                Objetivos propostos
            </h2>
            <p className="text-center leading-7 [&:not(:first-child)]:mt-6">
                <li>Quando um Funcionátio registar um Ponto o mesmo deverá salvar o horário que ocorreu e comparar com um horário pré-definido e guardar se o mesmo estava ou não atrasado.<BadgeCheckIcon className="flex justify-center text-center w-full" /></li>
                <li>Caso numa mesma semana o Funcionário se atrasar mais de N vezes, bloquear pontos futuros e avisar para o mesmo consultar o RH para desbloquear seu acesso.<BadgeCheckIcon className="flex justify-center text-center w-full">Cumprido</BadgeCheckIcon></li>
                <li> O RH deve poder desbloquear o Ponto de um Funcionário bloqueado.<BadgeCheckIcon className="flex justify-center text-center w-full">Cumprido</BadgeCheckIcon></li>
            </p>

        </div>
    )
}