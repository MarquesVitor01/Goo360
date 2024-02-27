import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Navbar/navbar.css';
import { AuthContext } from '../../Context/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore} from 'firebase/firestore';
function Navbar2() {
  const { setLogado } = useContext(AuthContext);
  const [isAdmUser, setIsAdmUser] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const db = getFirestore();
          const userId = user.uid;
          let q;
          if ((userId === 'tRcBpcXnM7Od7gXDHD5p8MSYrhl2') || (userId === 'TnPrBqZTVQdCmyxYVs8PbQqBemg2')) {
            setIsAdmUser(true);
          } else {
            setIsAdmUser(false);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
    return () => unsubscribe();
  }, [auth]);
  function Logout() {
    setLogado(false);
    localStorage.removeItem('logado');
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/app/financeiromapsempresas">
          <img src="../../../img/logo-atual-street.jpeg" width="85" height="80" alt="" />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Alterna navegação">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse  d-lg-flex justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav active">
            <li className="nav-item ">
              <Link to="https://app2.pontomais.com.br/login" className="nav-link text-success" aria-current="page">
                <b><i className="fa-solid fa-clock icon-hora"></i> Ponto Mais</b>
              </Link>
            </li>
            <li className="nav-item bar"> | </li>
            {isAdmUser && (
              <>
                <li className="nav-item ">
                  <Link to="/app/home" className="nav-link text-primary" aria-current="page">
                    <b><i class="fa-solid fa-rotate-right"></i> Voltar</b>
                  </Link>
                </li>
                <li className="nav-item bar"> | </li>
              </>
            )}
            <li className="nav-item">
              <Link to="/app" onClick={Logout} className="nav-link text-danger" aria-current="page"> <b><i className="fa-solid fa-right-from-bracket"></i> Sair</b></Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar2;