import { Routes, Route } from "react-router-dom";
import Header from "./header/page";
import BaterPonto from "./components/ui/baterPonto/page"
import RootLayout from "./RootLayout";
import Home from "./components/ui/Home/page"
import ConsultarPonto from "../src/components/consultarPonto/page";

export function App() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/baterPonto" element={<BaterPonto />} />
          <Route path="/consultarPonto" element={<ConsultarPonto />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}


