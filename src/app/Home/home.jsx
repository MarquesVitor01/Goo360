import React, { useState, useEffect } from "react";
import { Link, Navigate } from 'react-router-dom';
import Navbar from "../Componentes/Navbar/navbar";
import ListaCliente from "../Componentes/ListaCliente/listacliente";
import '../Home/home.css'
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import 'firebase/firestore';
import SweetAlert from "react-bootstrap-sweetalert";
import clientesPDF from "../Reports/Clientes/clientes";
const ScriptModal = ({ onClose }) => {
    return (
        <div className="script-modal over">
            <div className="script-modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <br />
                <p>Olá bom dia
                    Meu nome é _____, falou da central de telefonia . <br />
                    Gostaria de falar com gerente ou proprietário do estabelecimento. <br />
                    Estou entrando em contato para fazer a atualização da página ativa da unidade nas plataforma do Google Maps. 
                    A empresa ainda está localizada no endereço ________?
                    Número para contato é apenas esse fixo ou teria algum Whatszap comercial?
                    Horário de funcionamento seria qual?
                    Perfeito, a atualização foi feita com sucesso e não gera ou acarretará nenhum tipo de custos ou ônus adicionais nas contas da linha telefônica da unidade. Por se tratar apenas de atualização básica.
                    Informa por gentileza, um email de fácil acesso para que eu possa te encaminhar o numero de protocolo e identificação da unidade para futuras alterações?
                    Eu vou encaminha o link da atualização através do watszap junto ao termo de autorização.
                    O Sr. vai acessar o link, tirar uma self simples e dar um visto de conferencia apenas para confirmar que entramos em contato e foi feita a atualização, ok?
                    Dentro de 5 a 10 minutos, minha central de qualidade entra em contato para confirmar o recebimento do protocolo e finalizar o atendimento.
                    Muito Obrigado central agradece.
                    ---------------------------------
                    Bom dia
                    Me chamo _______, falo do setor de qualidade da central de telefonia.
                    Tô entrando em contato e gostaria de falar com ______ (nome de quem vc agênciou na primeira ligação)
                    Tô entrando em contato para finalizar o atendimento referente à atualizacao nas plataformas do google maps
                    O senhor conseguiu receber o numero de identificação? Foi encaminhado através do WhatsApp
                    Vou pedir para o Sr. salvar o contato para futuras alterações. <br />
                    O link está em azul ?
                    Acessa o link, vai pedir pro Sr. confirmar o email e o endereço. Está correto?
                    Clica em continuar e permitir acesso vai pedir uma self simples, e em seguida clique em continuar, vai aparecer uma tela em branca onde o Sr. vai dar um visto ou escrever seu nome e em seguida só finalizar.
                    Quando der concluído com sucesso o sr me avisa.
                    Agora eu vou pedir para o Sr. voltar para a nossa conversa no WhatsApp vai chegar uma enquete onde Sr. só vai selecionar o seu cargo.
                    Qualquer dúvida entrar em contato com a central.
                    Muito Obrigado e tenha um ótimo dia.</p>
            </div>
        </div>
    );
};
function Home() {
    const [clientes, setClientes] = useState([]);
    const [busca, setBusca] = useState('');
    const [texto, setTexto] = useState('');
    const [excluido, setExcluido] = useState('');
    const [confirmacao, setConfirmacao] = useState(false);
    const [confirmacaoId, setConfirmacaoId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantidadeClientes, setQuantidadeClientes] = useState(0);
    const [arquivosSelecionados, setArquivosSelecionados] = useState({})
    const auth = getAuth();
    const user = auth.currentUser;
    const deleteUser = (id) => {
        const db = getFirestore();
        const clienteDocRef = doc(db, 'clientes', id);
        if (user.uid === 'TnPrBqZTVQdCmyxYVs8PbQqBemg2' || user.uid === 'NdY7RuSe2EaXAMGNJECIMUEphZ03'  ||  user.uid === 'XvNPJ9hSGPTq8uXECNGUrxZHEjM2' || user.uid === 'daVCg3nADHaULLRXksRATNTP1Yu2' ||  user.uid === 'VmEp51uZPrU33HxZTZcnmsNHoLj1' || user.uid === 'mO99M5NSBvY4bSwCvHP6kuE9Tos2' || user.uid === 'Po21oAfps9Z5GRZhOZ9C5eVVUpj2' || user.uid === 'gZvV2DySGhdKvQt2FPx142DTaAo2') {
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
    useEffect(() => {
        const storedClientes = localStorage.getItem('clientes');
        if (storedClientes) {
            setClientes(JSON.parse(storedClientes));
            setQuantidadeClientes(JSON.parse(storedClientes).length);
            setLoading(false);
        }
        const fetchData = async () => {
            try {
                const db = getFirestore();
                let q;
                if ((user && user.uid === 'tRcBpcXnM7Od7gXDHD5p8MSYrhl2') || (user && user.uid === 'TnPrBqZTVQdCmyxYVs8PbQqBemg2') || (user.uid === 'S24vigWuDcT81qAOfAP43AiKU812')) {
                    q = query(collection(db, 'clientes'));
                } else if (user) {
                    q = query(collection(db, 'clientes'), where('userId', '==', user.uid));
                }
                if (q) {
                    const querySnapshot = await getDocs(q);
                    const listaCli = [];
                    querySnapshot.forEach((doc) => {
                        if (
                            doc.data().nome.indexOf(busca) >= 0 ||
                            doc.data().email.indexOf(busca) >= 0 ||
                            doc.data().cpf.indexOf(busca) >= 0 || 
                            doc.data().operador.indexOf(busca) >= 0 
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
                                operador: doc.data().operador,
                                razao: doc.data().razao,
                                venc2: doc.data().venc2,
                                parcelas: doc.data().parcelas,
                            });
                        }
                    });
                    setClientes(listaCli);
                    setQuantidadeClientes(listaCli.length);
                    setLoading(false);
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
    }, [busca, excluido, user]);
    useEffect(() => {
        const storedClientes = localStorage.getItem('clientes');
        if (storedClientes) {
            setClientes(JSON.parse(storedClientes));
            setQuantidadeClientes(JSON.parse(storedClientes).length);
            setLoading(false);
        }
    }, []);
    const [isScriptModalVisible, setScriptModalVisible] = useState(false);
    const handleMostrarScript = () => {
        setScriptModalVisible(true);
    };
    const handleFecharScriptModal = () => {
        setScriptModalVisible(false);
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setBusca(texto);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="background7">
                <div className="container-fluid titulo">
                    <h1>Lista de Clientes</h1>
                    <div className="row">
                        <div className="col-4 buttons">
                            <Link to='/app/home/novocliente' className="btn btn-primary btn-cli" type="button">
                                <i className="fa-solid fa-plus"></i> Clientes
                            </Link>
                            <button onClick={(e) => clientesPDF(clientes)} className="btn btn-danger btn-cli" type="button" id="button-addon2">
                                <i className="fa-solid fa-file-pdf"></i> Relatório de vendas
                            </button>
                            <button onClick={handleMostrarScript} className="btn btn-cli" type="button" id="button-addon2">
                                <i className="fa-solid fa-scroll"></i> Script
                            </button>
                            {isScriptModalVisible && (
                                <ScriptModal onClose={handleFecharScriptModal} />
                            )}
                        </div>
                        <div className="col-8 pesquisa">
                            <div className="input-group mb-3 ">
                            <input
                        onChange={(e) => setTexto(e.target.value)}
                        onKeyPress={handleKeyPress} // Add this line
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
                    <ListaCliente arrayClientes={clientes} clickDelete={confirmDeleteUser} />
                    {confirmacao ?
                        <SweetAlert
                            warning
                            showCancel
                            showCloseButton
                            confirmBtnText="Sim"
                            confirmBtnBsStyle="danger"
                            cancelBtnText="Não"
                            cancelBtnBsStyle="ligth"
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
export default Home;