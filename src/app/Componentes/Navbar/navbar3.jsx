import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';
import '../Navbar/navbar.css';
import { AuthContext } from '../../Context/auth';
function Navbar3() {
    const [clientes, setClientes] = useState([]);
    const [quantidadeClientes, setQuantidadeClientes] = useState(0);
    const [loading, setLoading] = useState(true);
    const { setLogado } = useContext(AuthContext);
    const auth = getAuth();
    const navigate = useNavigate();
    const handleVerificarPagos = async () => {
        try {
            const db = getFirestore();
            const q = query(collection(db, 'clientes'), where('userId', '==', auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            const listaCli = [];
            querySnapshot.forEach((doc) => {
                listaCli.push({
                    id: doc.id,
                    cpf: doc.data().cpf,
                    nome: doc.data().nome,
                    email: doc.data().email,
                    uf: doc.data().uf,
                    fone: doc.data().fone,
                    valor: doc.data().valor,
                    data: doc.data().data,
                });
            });
            setClientes(listaCli);
            setQuantidadeClientes(listaCli.length);
            setLoading(false);
            console.log('Usuário autorizado para verificar pagos.');
            navigate('/app/home/pagos');
        } catch (error) {
            console.error('Erro ao obter dados:', error);
        }
    };
    const Logout = () => {
        setLogado(false);
        localStorage.removeItem("logado");
    };
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('ID do usuário:', user.uid);
                setLogado(true);
            } else {
                console.log('Nenhum usuário autenticado.');
                setLogado(false);
            }
        });
        return () => unsubscribe();
    }, [auth, setLogado]);
    useEffect(() => {
        const storedClientes = localStorage.getItem('clientes');
        if (storedClientes) {
            setClientes(JSON.parse(storedClientes));
            setQuantidadeClientes(JSON.parse(storedClientes).length);
            setLoading(false);
        }
    }, []);
    return <nav className="navbar navbar-expand-lg navbar-light navbar-3">
        <div className="container-fluid">
            <a className="navbar-brand" href="/app/home">
                <img src="../../../img/logo-atual-street.jpeg" width="85" height="80" alt="" />
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Alterna navegação">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse  d-lg-flex justify-content-end" id="navbarNavDropdown">
                <ul className="navbar-nav active">
                    <li className="nav-item ">
                        <button onClick={handleVerificarPagos} style={{ border: 'none', background: 'none', cursor: 'pointer'}}  className="nav-link text-primary" aria-current="page"><b>Verificar Pagos</b></button>
                    </li>
                    <li className="nav-item bar"> | </li>
                    <li className="nav-item">
                        <Link to="/app" onClick={Logout} className="nav-link text-danger" aria-current="page"> <b><i className="fa-solid fa-right-from-bracket"></i> Sair</b></Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
}
export default Navbar3;