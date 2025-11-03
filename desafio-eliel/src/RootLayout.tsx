import Header from "./header/page";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
}