import React, { useState, useEffect } from "react";
import Navbar4 from "../Componentes/Navbar/navbar4";
import { Link, Navigate } from 'react-router-dom';
import ListaClienteMarketing from "../Componentes/ListaCliente/listaclientemarketing";
import '../HomeMarketing/homemarketing.css'
import { getAuth } from 'firebase/auth';
import SweetAlert from "react-bootstrap-sweetalert";
import { collection, getFirestore, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import 'firebase/firestore';
function HomeMarketing() {
  const [excluido, setExcluido] = useState('');
  const [confirmacao, setConfirmacao] = useState(false);
  const [confirmacaoId, setConfirmacaoId] = useState('');
    const [clientes, setClientes] = useState([]);
    const [busca, setBusca] = useState('');
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantidadeClientes, setQuantidadeClientes] = useState(0);
    const [showConcluidos, setShowConcluidos] = useState(false);
    const auth = getAuth();
    const user = auth.currentUser;
    useEffect(() => {
      const fetchData = async () => {
        try {
          const db = getFirestore();
          let q;
          if (showConcluidos) {
            q = query(collection(db, 'clientes'), where('concluido', '==', true));
          } else {
            q = query(collection(db, 'clientes'));
          }
          const querySnapshot = await getDocs(q);
          const listaCli = [];
          querySnapshot.forEach((doc) => {
            if (doc.data().nome.indexOf(busca) >= 0 || doc.data().email.indexOf(busca) >= 0 || doc.data().cpf.indexOf(busca) >= 0) {
              listaCli.push({
                id: doc.id,
                cpf: doc.data().cpf,
                nome: doc.data().nome,
                email: doc.data().email,
                uf: doc.data().uf,
                fone: doc.data().fone,
                valor: doc.data().valor,
                data: doc.data().data,
                razao: doc.data().razao
              });
            }
          });
          setClientes(listaCli);
          setQuantidadeClientes(listaCli.length);
          setLoading(false);
          localStorage.setItem('clientes', JSON.stringify(listaCli));
        } catch (error) {
          console.error('Erro ao obter dados:', error);
          setError(error);
        }
      };
      if (user) {
        fetchData();
      }
    }, [busca, showConcluidos, user, excluido]);
    useEffect(() => {
        const storedClientes = localStorage.getItem('clientes');

        if (storedClientes) {
            setClientes(JSON.parse(storedClientes));
            setQuantidadeClientes(JSON.parse(storedClientes).length);
            setLoading(false);
        }
    }, []);
    const handleShowConcluidos = () => {
        setShowConcluidos(!showConcluidos);
    };
    const deleteUser = (id) => {
      const db = getFirestore();
      const clienteDocRef = doc(db, 'clientes', id);
      if ((user.uid === 'TnPrBqZTVQdCmyxYVs8PbQqBemg2') || ( user.uid === 'S24vigWuDcT81qAOfAP43AiKU812')) {
          deleteDoc(clienteDocRef)
              .then(() => {
                  console.log('Documento excluído com sucesso:', id);
                  setExcluido(id);
                  setConfirmacao(false);
              })
              .catch((erro) => {
                  console.error('Erro ao excluir documento:', erro);
                  setError(erro);
              });
      } else {
          console.error('Usuário não tem permissão para excluir clientes.');
          setError('Você não tem permissão para excluir clientes.');
          alert('Você não tem permissão para excluir clientes.')
          setConfirmacao(false);
      }
  };
  useEffect(() => {
      if (error) {
          const timeout = setTimeout(() => {
              setError(null);
              <Navigate to='/app/home'></Navigate>
          }, 3000);
          return () => clearTimeout(timeout);
      }
  }, [error]);
  const confirmDeleteUser = (id) => {
      setConfirmacaoId(id);
      setConfirmacao(true);
  };
    return (
        <div>
            <Navbar4 />
            <div className="background6">
                <div className="container-fluid titulo">
                    <h1>Fila do Marketing</h1>
                    <div className="row">
                        <div className="col-4 buttons">
                            <button
                                className="btn btn-success btn-cli"
                                type="button"
                                onClick={handleShowConcluidos}
                            >
                                <i className="fa-solid fa-check"></i> {showConcluidos ? 'Todos' : 'Concluídos'}
                            </button>
                        </div>
                        <div className="col-8 pesquisa">
                            <div className="input-group mb-3 ">
                                <input
                                    onChange={(e) => setTexto(e.target.value)}
                                    type="text"
                                    className="form-control barra"
                                    placeholder="Pesquisar por nome"
                                    aria-describedby="button-addon2"
                                />
                                <button
                                    onClick={(e) => setBusca(texto)}
                                    className="btn btn-primary"
                                    type="button"
                                    id="button-addon2"
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i> Pesquisar
                                </button>
                            </div>
                        </div>
                    </div>
                    <ListaClienteMarketing arrayClientes={clientes} clickDelete={confirmDeleteUser} />
                    {confirmacao ?
                        <SweetAlert
                            warning
                            showCancel
                            showCloseButton
                            confirmBtnText="Sim"
                            confirmBtnBsStyle="danger"
                            cancelBtnText="Não"
                            cancelBtnBsStyle="primary"
                            title="Exclusão"
                            onConfirm={() => deleteUser(confirmacaoId)}
                            onCancel={() => setConfirmacao(false)}
                            reverseButtons={true}
                        >
                            Deseja excluir o cliente selecionado?
                        </SweetAlert> : null}
                </div>
            </div>
        </div>
    );
}
export default HomeMarketing;