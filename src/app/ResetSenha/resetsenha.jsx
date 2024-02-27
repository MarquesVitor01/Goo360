import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './resetsenha.css';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
function ResetSenha() {
    const auth = getAuth();
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [sucesso, setSucesso] = useState('');
    function RecuperarSenha()  {
        sendPasswordResetEmail(auth, email)
            .then(resultado => {
                setMensagem('');
                setSucesso('Email enviado com sucesso!');
            }).catch(error => {
                setSucesso('')
                if(error.message === 'Firebase: Error (auth/invalid-email).'){
                    setMensagem('Error ao enviar: Email invalido')
                } else {
                    setMensagem(error.message)
                }
            })
    }
    return <div className="d-flex align-items-centes text-center form-container">
        <form className="form-signin">
            <img className="mb-4 icon" src="https://pps.whatsapp.net/v/t61.24694-24/393984921_966894648142334_7763156479348690755_n.jpg?ccb=11-4&oh=01_AdT8NQL8xI8Ob_CdyEEN3P4-7xaAkMxTWxz0jLZuOPMKqw&oe=6582DEC2&_nc_sid=e6ed6c&_nc_cat=110" alt="" height="" width="75" />
            <h1 className="h3 mb-3 fw-normal">Recuperar senha</h1>
            <div className="form-floating">
                <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="floatingInput" placeholder="E-mail" />
            </div>
            <button onClick={RecuperarSenha} className="btn btn-primary w-100 mt-3" type="button">Enviar</button>
            {mensagem.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{mensagem}</div> : null}
            {sucesso.length > 0 ? <div className="alert alert-success mt-2" role="alert">{sucesso}</div> : null}
            <div className="login-links mt-5">
                <Link to="/app/novaconta" className="mx-3">Criar uma conta</Link>
            </div>
            <p className="mt-5 mb-3 text-body-secondary">&copy; Desenvolvido por Grupo Maps</p>
        </form>
    </div>
}
export default ResetSenha;