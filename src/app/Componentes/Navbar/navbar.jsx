import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, where, query } from 'firebase/firestore';
import { getStorage, ref, listAll } from 'firebase/storage';
import '../Navbar/navbar.css';
import { AuthContext } from '../../Context/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
function Navbar() {
  const [quantidadeClientes, setQuantidadeClientes] = useState(0);
  const [clientesComArquivosCount, setClientesComArquivosCount] = useState(0);
  const [exclusiveUser, setExclusiveUser] = useState(false)
  const { setLogado } = useContext(AuthContext);
  const auth = getAuth();
  const navigate = useNavigate();
  const [isAdmUser, setIsAdmUser] = useState(false);
  const handleQuantidadeClientesComArquivos = async (clientesList) => {
    try {
      const storage = getStorage();
      let clientesComArquivosCount = 0;
      for (const cliente of clientesList) {
        const clientePath = `gs://goo3-c312f.appspot.com/arquivos/${cliente.razao}`;
        const clienteRef = ref(storage, clientePath);
        const filesList = await listAll(clienteRef);
        if (filesList.items.length > 0) {
          clientesComArquivosCount++;
        }
      }
      setClientesComArquivosCount(clientesComArquivosCount);
    } catch (error) {
      console.error('Erro ao obter a quantidade de clientes com arquivos:', error);
    }
  };
  const handleVerificarPagos = useCallback(async () => {
    try {
      const db = getFirestore();
      const userId = auth.currentUser?.uid;
      if (userId === 'TnPrBqZTVQdCmyxYVs8PbQqBemg2') {
        setIsAdmUser(true)
      }
      else if (userId === 'S24vigWuDcT81qAOfAP43AiKU812') {
        setExclusiveUser(true)
      }
      let q;
      if ((userId === 'tRcBpcXnM7Od7gXDHD5p8MSYrhl2') || (userId === 'TnPrBqZTVQdCmyxYVs8PbQqBemg2') || (userId === 'S24vigWuDcT81qAOfAP43AiKU812')) {
        q = collection(db, 'clientes');
      } else {
        q = query(collection(db, 'clientes'), where('userId', '==', userId));
      }
      const querySnapshot = await getDocs(q);
      const listaCli = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        cpf: doc.data().cpf,
        nome: doc.data().nome,
        email: doc.data().email,
        uf: doc.data().uf,
        fone: doc.data().fone,
        operador: doc.data().operador,
        data: doc.data().data,
        razao: doc.data().razao,
      }));
      setQuantidadeClientes(listaCli.length);
      await handleQuantidadeClientesComArquivos(listaCli);
    } catch (error) {
      console.error('Erro ao obter dados:', error);
    }
  }, [auth]);
  const Logout = () => {
    setLogado(false);
    localStorage.removeItem('logado');
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('ID do usuário:', user.uid);
        setLogado(true);
        handleVerificarPagos();
      } else {
        console.log('Nenhum usuário autenticado.');
        setLogado(false);
      }
    });
    return () => unsubscribe();
  }, [auth, setLogado, handleVerificarPagos]);
  const clientesComArquivosCountMemoized = useMemo(() => {
    return clientesComArquivosCount;
  }, [clientesComArquivosCount]); 
  return (
    <nav className="navbar navbar-expand-lg navbar-light ">
      <div className="container-fluid">
        <a className="navbar-brand" href="/app/home">
          <img src="../../../img/logo-atual-street.jpeg" width="85" height="80" alt="" />
        </a>
        <div className="row exibicao">
          <h4 className="qtdClientes">
            <i className="fa-solid fa-user user-icon"></i>Agenciados: {quantidadeClientes}
          </h4>
          <h4 className="qtdClientesAss">
            <i className="fa-solid fa-file user-icon"></i>Assinados: {clientesComArquivosCountMemoized}
          </h4>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Alterna navegação"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse  d-lg-flex justify-content-end"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav active">
            <li className="nav-item ">
              <Link to="https://app2.pontomais.com.br/login" className="nav-link text-success" aria-current="page">
                <b><i className="fa-solid fa-clock icon-hora"></i> Ponto Mais</b>
              </Link>
            </li>
            <li className="nav-item bar"> | </li>
            {exclusiveUser && (
              <>
                <li className='nav-item'>
                  <Link to="/app/marketinggoo" className="nav-link text-primary" aria-current="page">
                    <b><i className="fa-solid fa-rotate-right"></i> Voltar</b>
                  </Link>
                </li>
                <li className="nav-item bar"> | </li>
              </>
            )}
            {isAdmUser && (
              <>
                <li className="nav-item ">
                  <Link to="/app/financeirogoo" className="nav-link text-success" aria-current="page">
                    <b><i className="fa-solid fa-dollar-sign"></i> Financeiro</b>
                  </Link>
                </li>
                <li className="nav-item bar"> | </li>
                <li className="nav-item ">
                  <Link to="/app/marketinggoo" className="nav-link text-primary" aria-current="page">
                    <b><i className="fa-brands fa-google"></i> Marketing</b>
                  </Link>
                </li>
                <li className="nav-item bar"> | </li>
                <li className="nav-item ">
                  <Link to="/app/cobrancagoo" className="nav-link text" aria-current="page">
                    <b><i className="fa-solid fa-tag"></i> Cobrança</b>
                  </Link>
                </li>
                <li className="nav-item bar"> | </li>
              </>
            )}
            <li className="nav-item">
              <Link
                to="/app"
                onClick={Logout}
                className="nav-link text-danger"
                aria-current="page"
              >
                <b><i className="fa-solid fa-right-from-bracket"></i> Sair</b>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;