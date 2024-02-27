import React, { useState, useEffect, useRef } from "react";
import Navbar2 from "../Componentes/Navbar/navbar2";
import ListaCliente2 from "../Componentes/ListaCliente/listacliente2";
import '../Pagos/pagos.css';
import Dashboard from "../Graficos/graficos";
import { collection, getFirestore, getDocs, query } from 'firebase/firestore';
import 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useReactToPrint } from "react-to-print";
import 'chart.js/auto';
import { Collapse, Card } from 'react-bootstrap';

function Pagos() {
  const [loader, setLoader] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const [exibirPagos, setExibirPagos] = useState(false);
  const [totalValor, setTotalValor] = useState(0);
  const [error, setError] = useState(null);
  const [cobradoresInfo, setCobradoresInfo] = useState({});
  const auth = getAuth();
  const user = auth.currentUser;
  const [pagamentosPorDia, setPagamentosPorDia] = useState({});
  const [pagamentosPorMes, setPagamentosPorMes] = useState({});
  const [pagamentosPorAno, setPagamentosPorAno] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();
        const clientesRef = collection(db, 'clientes');
        const q = query(clientesRef);
        const snapshot = await getDocs(q);
        const listaCli = snapshot.docs.map(doc => ({
          id: doc.id,
          cpf: doc.data().cpf,
          nome: doc.data().nome,
          email: doc.data().email,
          uf: doc.data().uf,
          fone: doc.data().fone,
          valor: doc.data().valor,
          venc2: doc.data().venc2,
          pago: doc.data().pago || false,
          cobrador: doc.data().cobrador || 'Sem cobrança',
          data: doc.data().data,
          parcelas: doc.data().parcelas,
        }));

        // Filtrar apenas os clientes marcados como pagos
        const clientesPagos = listaCli.filter(cliente => cliente.pago);

        // Contar a frequência e calcular o valor total para cada cobrador dos clientes pagos
        const info = {};
        const pagamentosPorDia = {};
        const pagamentosPorMes = {};
        const pagamentosPorAno = {};

        clientesPagos.forEach(cliente => {
          // Contagem por cobrador
          if (!info[cliente.cobrador]) {
            info[cliente.cobrador] = {
              quantidade: 0,
              valorTotal: 0
            };
          }
          info[cliente.cobrador].quantidade++;
          info[cliente.cobrador].valorTotal += parseFloat(cliente.valor); // Converter para número e somar

          // Contagem por dia
          const dataPagamento = new Date(cliente.data);
          const dia = dataPagamento.getDate();
          const chaveDia = `${dia}/${dataPagamento.getMonth() + 1}/${dataPagamento.getFullYear()}`;
          if (!pagamentosPorDia[chaveDia]) {
            pagamentosPorDia[chaveDia] = 0;
          }
          pagamentosPorDia[chaveDia]++;

          // Contagem por mês
          const chaveMes = `${dataPagamento.getMonth() + 1}/${dataPagamento.getFullYear()}`;
          if (!pagamentosPorMes[chaveMes]) {
            pagamentosPorMes[chaveMes] = 0;
          }
          pagamentosPorMes[chaveMes]++;

          // Contagem por ano
          const chaveAno = `${dataPagamento.getFullYear()}`;
          if (!pagamentosPorAno[chaveAno]) {
            pagamentosPorAno[chaveAno] = 0;
          }
          pagamentosPorAno[chaveAno]++;
        });

        // Definir os estados com as informações calculadas
        setCobradoresInfo(info);
        setPagamentosPorDia(pagamentosPorDia);
        setPagamentosPorMes(pagamentosPorMes);
        setPagamentosPorAno(pagamentosPorAno);

        // Calcular o valor total apenas para os clientes marcados como pagos
        const totalValor = clientesPagos.reduce((total, cliente) => total + parseFloat(cliente.valor), 0); // Converter para número e somar
        setTotalValor(totalValor);

        // Definir a lista de clientes
        setClientes(listaCli);

        // Armazenar os clientes no localStorage
        localStorage.setItem('clientes', JSON.stringify(listaCli));
      } catch (error) {
        console.error('Erro ao obter dados:', error);
      }
    };

    fetchData();
  }, [busca]);

  useEffect(() => {
    const storedClientes = localStorage.getItem('clientes');
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setShowDashboard(false);
  }, []);

  const handleExibirPagos = () => {
    setExibirPagos(!exibirPagos);
  };

  const [showDashboard, setShowDashboard] = useState(false);

  const handleShowDashboard = () => {
    setShowDashboard(!showDashboard);
  };

  useEffect(() => {
    const storedClientes = localStorage.getItem('clientes');
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes));
      setLoading(false);
    }

    const fetchData = async () => {
      try {
        const db = getFirestore();
        let q;
        q = query(collection(db, 'clientes'));
        if (q) {
          const querySnapshot = await getDocs(q);
          const listaCli = [];
          querySnapshot.forEach((doc) => {
            if (
              doc.data().nome.indexOf(busca) >= 0 ||
              doc.data().email.indexOf(busca) >= 0 ||
              doc.data().cpf.indexOf(busca) >= 0
            ) {
              listaCli.push({
                id: doc.id,
                cpf: doc.data().cpf,
                nome: doc.data().nome,
                email: doc.data().email,
                uf: doc.data().uf,
                fone: doc.data().fone,
                valor: doc.data().valor,
                data: doc.data().data,
                venc2: doc.data().venc2,
                cobrador: doc.data().cobrador,
                parcelas: doc.data().parcelas
              });
            }
          });

          // Contar a frequência e calcular o valor total para cada cobrador
          const info = {};
          listaCli.forEach(cliente => {
            if (!info[cliente.cobrador]) {
              info[cliente.cobrador] = {
                quantidade: 0,
                valorTotal: 0
              };
            }
            info[cliente.cobrador].quantidade++;
            info[cliente.cobrador].valorTotal += parseFloat(cliente.valor); // Converter para número e somar
          });
          setCobradoresInfo(info);

          // Definir a lista de clientes
          setClientes(listaCli);

          // Armazenar os clientes no localStorage
          localStorage.setItem('clientes', JSON.stringify(listaCli));
        }
      } catch (error) {
        console.error('Erro ao obter dados:', error);
        setError(error);
      }
    };

    if (user) {
      fetchData();
    }
  }, [busca, user]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const contentDocument = useRef();
  const handlePrint = useReactToPrint({
    content: () => contentDocument.current,
  });


  return (
    <div>
      <Navbar2 />
      <div className="background8">
        <div className="container-fluid titulo">
          <h1>Situação Financeira</h1>
          <div className="row">
            <div className="col-4">
              <button onClick={handleExibirPagos} className="btn btn-success btn-cli" type="button" id="button-addon2">
                <i className="fa-solid fa-dollar-sign"></i> {exibirPagos ? 'Ocultar Pagos' : 'Visualizar Pagos'}
              </button>
              <button onClick={handleShowDashboard} className="btn btn-warning btn-cli" type="button" id="button-addon2">
                {showDashboard ? 'Ocultar Dashboard' : 'Exibir Dashboard'}
              </button>
              <button
                onClick={() => setOpen(!open)}
                aria-controls="cobradores-info"
                aria-expanded={open}
                className="btn btn-primary btn-cli"
              >
                {open ? 'Fechar' : 'Cobrança'}
              </button>
              <button
                onClick={() => setOpen2(!open2)}
                aria-controls="cobradores-info"
                aria-expanded={open2}
                className="btn btn-danger btn-cli"
              >
                {open2 ? <i class="fa-solid fa-calendar-days"></i> : <i class="fa-solid fa-calendar-days"></i>}
              </button>
            </div>
            <div className="col-8">
              <div className="input-group mb-3">
                <input onChange={(e) => setTexto(e.target.value)} type="text" className="form-control" placeholder="Perguntar por nome" aria-describedby="button-addon2" />
                <button onClick={() => setBusca(texto)} className="btn btn-primary" type="button" id="button-addon2">
                  <i className="fa-solid fa-magnifying-glass"></i> Pesquisar
                </button>
              </div>
            </div>
          </div>
          <div>
            <Collapse in={open2}>
              <div ref={contentDocument}>
                <button className="btn btn-danger btn-cli" onClick={handlePrint} disabled={loader}>
                  {loader ? <span>Baixando</span> : <span>Baixar PDF</span>}<i className="fa-solid fa-file-pdf"></i>
                </button>

                {Object.entries(pagamentosPorMes).map(([mes, quantidade]) => (
                  <Card key={`mes_${mes}`} style={{ margin: '10px', padding: '10px' }}>
                    <Card.Body>
                      <Card.Title>Pagamentos em {mes}</Card.Title>
                      <Card.Text>
                        Quantidade de pagamentos: {quantidade}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}

                {Object.entries(pagamentosPorAno).map(([ano, quantidade]) => (
                  <Card key={`ano_${ano}`} style={{ margin: '10px', padding: '10px' }}>
                    <Card.Body>
                      <Card.Title>Pagamentos em {ano}</Card.Title>
                      <Card.Text>
                        Quantidade de pagamentos: {quantidade}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Collapse>
          </div>
          <div >
            <Collapse in={open}>
              <div ref={contentDocument}>
                <button className="btn btn-danger btn-cli" onClick={handlePrint} disabled={loader}>
                  {loader ? <span>Baixando</span> : <span>Baixar PDF</span>}<i className="fa-solid fa-file-pdf"></i>
                </button>
                {Object.entries(cobradoresInfo).map(([cobrador, info]) => (
                  <Card key={cobrador} style={{ margin: '10px', padding: '10px' }}>
                    <Card.Body>
                      <Card.Title>{cobrador}</Card.Title>
                      <Card.Text>
                        Vendas pagas: {info.quantidade}
                        <br />
                        Valor total: {info.valorTotal !== undefined ? parseFloat(info.valorTotal).toFixed(2) : 'Sem cobrança'}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Collapse>
          </div>
          {showDashboard ? (
            <>
              <Dashboard clientes={clientes} exibirPagos={exibirPagos} totalValor={totalValor} />
            </>
          ) : (
            <ListaCliente2 arrayClientes={clientes} exibirPagos={exibirPagos} />
          )}
        </div>
      </div>
    </div >
  );
}

export default Pagos;