import React, { useState, useContext } from "react";
import { Link, Navigate } from 'react-router-dom';
import '../Login/login.css'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../Context/auth.jsx";
import 'firebase/auth';
import firebase from '../Config/firebase';
function Login() {
    const auth = getAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [sucesso, setSucesso] = useState('');
    const { setLogado } = useContext(AuthContext);
    const [redirectToHome, setRedirectToHome] = useState(false);
    const [redirectPath, setRedirectPath] = useState('');
    function LoginUsuario() {
        signInWithEmailAndPassword(auth, email, senha)
            .then(function (firebaseUser) {
                localStorage.setItem("logado", "S");
                setLogado(true);
                setSucesso('S');
                let redirectPath = '/app/home';
                    if(email === 'talita.silva@goo360.online' || email === 'felipe@goo360.online'){
                    } else if (email === 'karoline.alves@grupomapscartaodigital.com.br' || email === 'eryck.vinicius@grupomapscartaodigital.com.br' || email === 'gabriel.pinheiro@grupomapscartaodigital.com.br' || email === 'andressa.anastacia@grupomapscartaodigital.com.br' ) {
                        redirectPath = '/app/marketingmapsempresas';
                    } else if (email === 'jhonatan.ramos@goo360.online' || email === 'ana.clara@goo360.online' || email === 'karolia.salgado@goo360.online' || email === 'adriana.lima@goo360.online' || email === 'allan.bruno@goo360.online' || email === 'bruno.santo@goo360.online' ) {
                        redirectPath = '/app/cobrancagoo';
                    } else if(email === 'jonas.alexandre@goo360.online' || email === 'karoline.alves@goo360.com.br' || email === 'eryck.vinicius@goo360.com.br' || email === 'gabriel.pinheiro@goo360.com.br' || email === 'andressa.anastacia@goo360.com.br') {
                        redirectPath = '/app/marketinggoo';
                    }
                setRedirectToHome(true); 
                setRedirectPath(redirectPath);
            })
            .catch(function (error) {
                localStorage.setItem("logado", "N");
                setLogado(false);
                setSucesso('N');
            });
    }
    function alterarEmail(event) {
        setEmail(event.target.value);
    }
    function alterarSenha(event) {
        setSenha(event.target.value);
    }
    function handleSubmit(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            LoginUsuario();
        }
    }
    return (
        <div className="d-flex align-items-centes text-center form-container">
            <form className="form-signin formulari">
                <img className="mb-4 icon" src="../../../img/logo-street.jpg" alt="" height="" width="75" />
                <h1 className="h3 mb-3 fw-normal">LOGIN</h1>
                <div className="form-floating">
                    <input onChange={alterarEmail} type="email" className="form-control" id="floatingInput" placeholder="E-mail" />
                </div>
                <div className="form-floating formulario1 ">
                    <input
                        onChange={alterarSenha}
                        onKeyPress={handleSubmit}
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Senha"
                    />
                </div>
                <div className="form-check text-start my-3">
                    <input className="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault" />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Lembrar
                    </label>
                </div>
                <button onClick={LoginUsuario} className="btn btn-primary w-100 py-2" type="button">Acessar</button>
                {sucesso === 'N' ? <div className="alert alert-danger mt-2" role="alert">Email ou senha inválida</div> : null}
                {sucesso === 'S' ? redirectToHome && <Navigate to={redirectPath} /> : null}
                <div className="login-links mt-5">
                    <Link to="/app/resetsenha" className="mx-3 text-primary">Esqueci minha senha</Link>
                    {/* <Link to="/app/novaconta" className="mx-3">Criar conta</Link> */}
                </div>
                <p className="mt-5 mb-3 text-body-secondary">&copy; Desenvolvido por Goo 360</p>
            </form>
        </div>
    );
}
export default Login;