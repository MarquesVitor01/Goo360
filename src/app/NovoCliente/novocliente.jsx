import React, { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import '../NovoCliente/novocliente.css'
import { getAuth } from 'firebase/auth';
import { useReactToPrint } from "react-to-print";
import { isEmpty } from 'lodash';
function NovoCliente() {
    const [clientes, setClientes] = useState([]);
    const [loader, setLoader] = useState(false);
    const [formState, setFormState] = useState({
        nome: '',
        email: '',
        fone: '',
        numeroContrato: '',
        razao: '',
        cpf: '',
        fantasia: '',
        endereco: '',
        bairro: '',
        uf: '',
        cidade: '',
        cep: '',
        whats: '',
        obs: '',
        funcionamento: '',
        valor: '',
        plano: '',
        renovNao: '',
        renovSim: '',
        validade: '',
        data: '',
        cargo: '',
        venc2: '',
        representante: '',
        operador: '',
        site: '',
        link: '',
        sociais: ''
    });
    const handleInputChange = (field, value) => {
        setFormState((prevState) => ({ ...prevState, [field]: value }));
    };
    const [plano, setPlano] = useState('');
    const [data, setData] = useState('');
    const [numeroContrato, setNumeroContrato] = useState('');
    const [bairro, setBairro] = useState('');
    const [obs, setObs] = useState('');
    const [funcionamento, setFuncionamento] = useState('');
    const [venc2, setVenc2] = useState('');
    const [valor, setValor] = useState('199.90');
    const [cidade, setCidade] = useState('');
    const [cep, setCep] = useState('');
    const [uf, setUf] = useState('');
    const [site, setSite] = useState('');
    const [whats, setWhats] = useState('');
    const [endereco, setEndereco] = useState('');
    const [razao, setRazao] = useState('');
    const [cpf, setCpf] = useState('');
    const [link, setLink] = useState('');
    const [nome, setNome] = useState('');
    const [sociais, setSociais] = useState('');
    const [fantasia, setFantasia] = useState('');
    const [email, setEmail] = useState('');
    const [fone, setFone] = useState('');
    const [representante, setRepresentante] = useState('');
    const [renovSim, setRenovSim] = useState(false);
    const [renovNao, setRenovNao] = useState(false);
    const [validade, setValidade] = useState('');
    const [operador, setOperador] = useState('');
    const [cobrador, setCobrador] = useState('');
    const [vencimentoCobranca, setVencimentoCobranca] = useState('');
    const [dataCobranca, setDataCobranca] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [cargo, setCargo] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [parcelas, setParcelas] = useState(12)
    const navigate = useNavigate();
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            navigate('/app/home/novocliente');
            return;
        }
        const db = getFirestore();
        const q = query(collection(db, 'clientes'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const clientesData = [];
            snapshot.forEach((doc) => {
                clientesData.push({ id: doc.id, ...doc.data() });
            });
            setClientes(clientesData);
        });
        return () => {
            unsubscribe();
        };
    }, [navigate]);
    const db = getFirestore();
    const clienteJaExiste = async (cpf) => {
        const querySnapshot = await getDocs(query(collection(db, 'clientes'), where('cpf', '==', cpf)));
        return !isEmpty(querySnapshot.docs);
    };
    async function cadastrarCliente() {
        try {
            if (nome.length === 0) {
                setMensagem('Informe o seu nome');
                return;
            } else if (email.length === 0) {
                setMensagem('Informe o email');
                return;
            }
            const clienteData = {
                nome,
                email,
                fone,
                numeroContrato,
                razao,
                cpf,
                fantasia,
                endereco,
                bairro,
                uf,
                cidade,
                cep,
                whats,
                obs,
                funcionamento,
                valor,
                plano,
                renovNao,
                renovSim,
                validade,
                data,
                representante,
                venc2,
                cargo,
                operador,
                site,
                link,
                sociais,
                parcelas,
                cobrador,
                vencimentoCobranca,
                dataCobranca
            };
            const auth = getAuth();
            const userId = auth.currentUser.uid;
            clienteData.userId = userId;
            const clienteExistente = await clienteJaExiste(cpf);
            if (clienteExistente) {
                setMensagem('Cliente já cadastrado.');
                return;
            }
            const novoClienteRef = await addDoc(collection(db, 'clientes'), clienteData);
            setFormState({
                nome: '',
                email: '',
                fone: '',
                numeroContrato: '',
                razao: '',
                cpf: '',
                fantasia: '',
                endereco: '',
                bairro: '',
                uf: '',
                cidade: '',
                cep: '',
                whats: '',
                obs: '',
                funcionamento: '',
                valor: '',
                plano: '',
                renovNao: '',
                renovSim: '',
                validade: '',
                data: '',
                representante: '',
                venc2: '',
                cargo: '',
                operador: '',
                site: '',
                link: '',
                sociais: '',
                parcelas: '',
                cobrador: '',
                vencimentoCobranca: '',
                dataCobranca: '',
            });
            setMensagem('');
            setSucesso('S');
            console.log('Novo cliente criado com ID:', novoClienteRef.id);
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            setMensagem('Ocorreu um erro ao cadastrar o cliente. Por favor, tente novamente.');
            setSucesso('N');
        }
    }
    const contentDocument = useRef();
    const handlePrint = useReactToPrint({
        content: () => contentDocument.current,
    });

    const [checkboxes, setCheckboxes] = useState({
        atualizacao: true,
        criacao: false,
        anuncio: false,
        cartaoDigital: false,
        logotipo: false,
    });

    const handleCheckboxChange = (checkboxId) => {
        setCheckboxes((prevCheckboxes) => ({
            ...prevCheckboxes,
            [checkboxId]: !prevCheckboxes[checkboxId],
        }));
    };


    return <div>
        <div className="background">
            <div ref={contentDocument} className="contrato container-fluid titulo-2" id="formId">
                <div className="logo-street">
                    <img src="../../../img/logo-atual-street.jpeg" alt="" />
                </div>
                <table className="cc">
                    <thead>
                        <tr>
                            <th className="cima">Ficha/ Nº do contrato:</th>
                            <th className="cima">Vigência</th>
                            <th className="cima">Veiculo de divulgação</th>
                            <th className="cima">Operador</th>
                            <th className="cima">Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="baixo">
                                <input onChange={(e) => setNumeroContrato(e.target.value)} type="text" className="form-control" id="contrato" placeholder="" required />
                            </td>
                            <td className="baixo">2024/ 2025 /2026</td>
                            <td className="baixo">Site de buscas</td>
                            <td className="baixo">
                                <input onChange={(e) => setOperador(e.target.value)} type="text" className="form-control" id="contrato" placeholder="" required />
                            </td>
                            <td className="baixo">
                                <input onChange={(e) => setData(e.target.value)} id="date" type="date" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="linha1">
                    <h3>
                        AUTORIZAÇÃO PARA DIVULGAÇÃO DE FOTOS E VIDEOS E ACESSORIA DE SERVIÇOS EM MARKETING DIGITAL
                    </h3>
                </div>
                <form className="caixa2">
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">Razão Social:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setRazao(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Nome Fantasia:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setFantasia(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">CNPJ/CPF:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setCpf(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Endereço:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setEndereco(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">Cidade:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setCidade(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Bairro:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setBairro(e.target.value)}
                                className="form-control"
                            />
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Estado:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setUf(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">CEP:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setCep(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">WhatsApp:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setWhats(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Telefone:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setFone(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="horario">Horario de funcionamento:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setFuncionamento(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">E-mail:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="site">Site:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setSite(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row atualizacao">
                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="atualizacao"
                                checked={checkboxes.atualizacao}
                                onChange={() => handleCheckboxChange("atualizacao")}
                            />
                            <label className="custom-control-label" htmlFor="atualizacao">
                                Atualização
                            </label>
                        </div>
                        <p className=" mb-3 font-weight-bold"> - </p>

                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="criacao"
                                checked={checkboxes.criacao}
                                onChange={() => handleCheckboxChange("criacao")}
                            />
                            <label className="custom-control-label" htmlFor="criacao">
                                Criação
                            </label>
                        </div>
                        <p className=" mb-3 font-weight-bold">-</p>

                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="anuncio"
                                checked={checkboxes.anuncio}
                                onChange={() => handleCheckboxChange("anuncio")}
                            />
                            <label className="custom-control-label" htmlFor="anuncio">
                                Anúncio
                            </label>
                        </div>
                        <p className=" mb-3 font-weight-bold">-</p>

                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="cartaoDigital"
                                checked={checkboxes.cartaoDigital}
                                onChange={() => handleCheckboxChange("cartaoDigital")}
                            />
                            <label className="custom-control-label" htmlFor="cartaoDigital">
                                Cartão Digital
                            </label>
                        </div>
                        <p className=" mb-3 font-weight-bold">-</p>

                        <div className="custom-control custom-checkbox col-md-1.7 mb-3">
                            <input
                                type="checkbox"
                                className="custom-control-input"
                                id="logotipo"
                                checked={checkboxes.logotipo}
                                onChange={() => handleCheckboxChange("logotipo")}
                            />
                            <label className="custom-control-label" htmlFor="logotipo">
                                Logotipo
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">Link da Página:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setLink(e.target.value)}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Autorizante:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setNome(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="nomeFantasia">Cargo:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setCargo(e.target.value)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="razaoSocial">Redes Sociais:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setSociais(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="nomeFantasia">Obsvervações:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setObs(e.target.value)}
                                className="form-control"
                            />
                        </div>
                    </div>
                </form>
                <div className="condicoes">
                    <h3>
                        Condições;(12) Doze, parcelas por vigência no valor de 399,90(Trezentos e noventa e nove reais e noventa centavos) mensal, parcelado no boleto bancário.
                    </h3>
                </div>
                <div className="regras">
                    <h2>
                        AS PARTES A CIMA NOMEADAS ASSINARAM, QUE SE REGERÁ PELAS CLAUSULAS E CONDIÇÕES
                    </h2>
                </div>
                <div className="texto">
                    <p>1)Declaro recebido todas as informações referente a prestação de serviço da empresa estando em total e plena concordância com a adesão dos serviços supracitados; Atualização e divulgação dos dados que constam na plataforma digital do Google Maps, O contratante poderá encaminhar para a contratado mensalmente 30 fotos e 5 vídeos para atualização de sua página, horário de funcionamento, inclusão de site/ páginas de redes sociais / telefones para contato / ajuda para criação de anúncios/ Criação de Cartão Digital Interativo com links Direcionadores. fica acordado que a contratante deve entrar em contato com a contratada para solicitar o devido suporte quando necessário, e por estar devidamente autorizado a responder pela empresa ativa e passivamente assumo as obrigações deste contrato conforme clausulas; 2)como proponente estou de acordo que a empresa. Goo 360 Marketing Digital CNPJ: 28.062.365/0001-60, realize a administração de minha página dentro do site de busca da Google, realizando mudanças e alterações quando solicitado por parte da contratante, a empresa supracitada nas condições gerais estabelecidas pela lei 10.406/02 e lei 8.078/90 e condições particulares definidas em caráter irrevogável e irretratável. A validação deste contrato dar-se de acordo assinatura para o vínculo contratual conforme Código Civil. 107. 3) Este termo/contrato tem sua validade de validade de 3 anos. O vencimento da 1º parcela será no 8º dia após a assinatura do contrato. O prazo para cancelamento desta prestação de serviço sem ônus, são de 7 sete dias corridos conforme Art.49 do CDC, a solicitação de cancelamento deverá ser feita por escrito através do e-mail: sac@goo360marketing.com.br , formalizando o pedido. Após este prazo dá-se 23 dias corridos para o cancelamento com multa de 40% (quarenta porcento) sobre o valor total do contrato. 4) A inadimplência de qualquer das parcelas, implicara no vencimento antecipado no saldo devedor e o envio aos órgãos de proteção ao crédito (spc e protesto em Cartório), acrescido de juros de mora de 2% e taxas de juros de 12% ao ano. 5) O presente contrato considera se sucessivamente renovado para o(S) mesmo(s) serviço(s) com antecedência de 60 dias de antecedência do termino do prazo em curso , se não houver a manifestação expressa em contrário(s) entre contratante (s) e contratada mantendo-se as mesmas prestações devidamente autorizada vencíveis a mesma época. 6) Se somente quitada a primeira edição, está não dará nulidade ao contrato, a saber, a cobrança da(s) outras edições fica(m) a tempo e a critério da contratada. 7) A data inicial da vigência prevista poderá ser alterada conforme necessidade da contratada sem que isso caracterize prejuízo ao proponente/contratante. 8) No período de 24(horas) após a contratação, estará inserida no site www.google.com.br/maps.com.br o cadastro do proponente com todas as suas inclusões e atualizações no cadastro do proponente, importante ressaltar que está empresa não possui vínculos com a Google Brasil e sim presta serviços técnicos para empresas prestando o seguinte suporte; Atualização de dados na plataforma digital do Google Maps, Criação de Qr-Code Direcionador, Recuperação de Domínio, Criação de Cartão Digital Interativo com links Direcionadores. O contratante poderá encaminhar para a contratado mensalmente 20 fotos e 10 videos para atualização de sua página, através do e-mail Marketing@goo360marketing.com.br 9) Na hipótese de atraso no pagamento deste contrato, poderá a contratada a qualquer tempo ao seu exclusivo critério promover ação judicial cabível em face do proponente / contratante para cumprimento da obrigação adquirida. 10) A contratada não respondera por prejuízo resultantes de erros totais ou parciais que venham a ocorrer nos dados ou figurações fornecidas pelo proponente /contratante cujas características e conteúdo são de exclusiva responsabilidade. Caberá a contratada o direito de propor ação regressiva contra o proponente /contratante caso esta seja condenada a reparar danos causados a terceiros por eleito da publicidade ora autorizada. 11)O signatário desta contratação de publicidade declara estar autorizado pelos dados informados neste instrumento e responderá solidariamente pelas obrigações nele contida. 12) As partes elegem o foro da capital do estado de São Paulo para dirimir eventuais questões deste contrato, renunciando a qualquer outro por mais privilegiado que seja. Declaro ter recebido por e-mail e WhatsApp cópia deste documento após ter lido as informações a mim passadas e por estar devidamente habilitado a responder pela empresa ativa e passivamente, assumo as obrigações deste documento.</p>
                </div>
                <table className="cc">
                    <thead>
                        <tr className="">
                            <th className="bb">
                                <div className="inf">
                                    <h3>
                                        GOO 360º MARKETING DIGITAL
                                        <br />
                                        SAC@GOO360MARKETING.COM.BR
                                        <br />
                                        Central de Atendimento: (11) 5242-4990
                                    </h3>
                                </div>
                            </th>
                            <th className="aa">
                                <br /><br />
                                <div className="escrever">
                                    <hr className="font-weight-bold" />
                                </div>
                                <div className="assinante">
                                    <h3>
                                        ASSINATURA DO AUTORIZANTE
                                    </h3>
                                </div>
                            </th>
                        </tr>
                    </thead>
                </table>
                {mensagem.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{mensagem}</div> : null}
                {sucesso === 'S' ? <Navigate to='/app/home' /> : null}
            </div>
        </div>
        <div className="row salvar">
            <Link to="/app/home" className="btn btn-warning btn-acao">Cancelar</Link>
            <button onClick={cadastrarCliente} type="button" className="btn btn-primary btn-acao">Salvar</button>
            <button className="btn btn-danger btn-cli" onClick={handlePrint} disabled={loader}>
                {loader ? <span>Baixando</span> : <span>Baixar PDF</span>}<i className="fa-solid fa-file-pdf"></i>
            </button>
        </div>
    </div >
}
export default NovoCliente;