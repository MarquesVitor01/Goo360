import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from './app/Context/auth.jsx';

// Importar páginas
import Site from "./Site/site1";
import Login from "./app/Login/login1.jsx";
import ResetSenha from "./app/ResetSenha/resetsenha.jsx";
import Home from "./app/Home/home.jsx";
import NovoCliente from "./app/NovoCliente/novocliente.jsx";
import EditarCliente from "./app/EditarCliente/editarcliente.jsx";
import FichaCliente from "./app/FichaCliente/fichacliente.jsx";
import Pagos from "./app/Pagos/pagos.jsx";
import HomeMarketing from "./app/HomeMarketing/homemarketing.jsx";
import Cobranca from "./app/Cobranca/cobranca.jsx";
import FichaCobranca from "./app/fichaCobranca/fichaCobranca.jsx";
import GestaoCobranca from "./app/GestaoCobranca/gestaocobranca.jsx";
import FichaGestao from "./app/FichaGestao/fichaGestao.jsx";

function App() {
  const { logado } = useContext(AuthContext);
  console.log(logado);
  const PrivateRoutes = () => {
    return (
      logado ? <Outlet /> : <Navigate to="/app" />
    );
  }
  console.log(logado)
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Site />} />
        <Route path='/app' element={<Login />} />
        <Route path='/app/resetsenha' element={<ResetSenha />} />
        <Route element={<PrivateRoutes />}>
          <Route element={<Home />} path='/app/home' exact />
          <Route element={<NovoCliente />} path='/app/home/novocliente' exact />
          <Route element={<EditarCliente />} path='/app/home/editarcliente/:id' exact />
          <Route element={<FichaCliente />} path='/app/home/fichacliente/:id' exact />
          <Route element={<Pagos />} path='/app/financeirogoo' exact />
          <Route element={<HomeMarketing />} path='/app/marketinggoo' exact />
          <Route element={<Cobranca />} path='/app/cobrancagoo' exact />
          <Route element={<FichaCobranca />} path='/app/home/fichacobrancagoo/:id' exact />
          <Route element={<GestaoCobranca />} path='/app/gestaocobrancagoo' exact />
          <Route element={<FichaGestao />} path='/app/fichagestaogoo/:id' exact />

        </Route>
      </Routes>
    </BrowserRouter>
  );

}


export default App;