
import { Link } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { InfoIcon, BadgeCheckIcon } from "lucide-react";
import React from "react";


function ListItem({ href, title, children }: { href: string; title?: string; children?: React.ReactNode }) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    to={href}
                    className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    {title && <div className="text-sm font-medium">{title}</div>}
                    {children && <p className="text-sm text-muted-foreground">{children}</p>}
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

export default function Header() {
    return (
        <div className="w-full flex-col justify-center mx-auto">
            <NavigationMenu className="mx-auto mt-5">
                <NavigationMenuList className="">
                    <NavigationMenuItem >
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/Home">Home</Link>
                        </NavigationMenuLink>
                        <NavigationMenuTrigger>Funcionalidades</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            to="/baterPonto"
                                            className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none transition-all md:p-6"
                                        >
                                            <div className="mb-2 text-lg font-medium sm:mt-4">Bater Ponto</div>
                                            <p className="text-sm text-muted-foreground">Ferramenta por onde funcionario bate o ponto</p>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/docs" title="Desbloquear funcionario">Por onde o RH desbloqueia o funcionário</ListItem>
                                <ListItem href="/docs/installation" title="Consultar pontos de funcionário">Por onde o RH pode consultar o ponto de todos os funcionários</ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/docs">Documentação</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem className="hidden md:block">
                        <NavigationMenuTrigger>Redes sociais</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[220px] gap-2">
                                <ListItem href="#" title="Linkedin">
                                    <span className="inline-flex items-center gap-2"><InfoIcon size={16} />Linkedin</span>
                                </ListItem>
                                <ListItem href="#" title="Git Hub">
                                    <span className="inline-flex items-center gap-2"><InfoIcon size={16} />GitHub</span>
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
