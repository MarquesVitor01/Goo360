import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams } from 'react-router-dom';
import '../EditarCliente/editarcliente.css'
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import 'firebase/firestore'
function EditarCliente(props) {
    const [numeroContrato, setNumeroContrato] = useState('');
    const [plano, setPlano] = useState('');
    const [data, setData] = useState('');
    const [bairro, setBairro] = useState('');
    const [obs, setObs] = useState('');
    const [sociais, setSociais] = useState('');
    const [operador, setOperador] = useState('');
    const [link, setLink] = useState('');
    const [site, setSite] = useState('');
    const [funcionamento, setFuncionamento] = useState('');
    const [valor, setValor] = useState('');
    const [cidade, setCidade] = useState('');
    const [cep, setCep] = useState('');
    const [uf, setUf] = useState('');
    const [whats, setWhats] = useState('');
    const [endereco, setEndereco] = useState('');
    const [razao, setRazao] = useState('');
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [renovSim, setRenovSim] = useState('');
    const [renovNao, setRenovNao] = useState('');
    const [parcelas, setParcelas] = useState('')
    const [validade, setValidade] = useState('');
    const [representante, setRepresentante] = useState('');
    const [cargo, setCargo] = useState('');
    const [venc2, setVenc2] = useState('');
    const [fantasia, setFantasia] = useState('');
    const [email, setEmail] = useState('');
    const [fone, setFone] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [sucesso, setSucesso] = useState('');
    const db = getFirestore();
    const { id } = useParams();
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('ID do Cliente:', id);
                const clienteDocRef = doc(db, 'clientes', id);
                console.log('Referência do Documento:', clienteDocRef);
                const docSnapshot = await getDoc(clienteDocRef);
                console.log('Snapshot do Documento:', docSnapshot.data());
                if (docSnapshot.exists()) {
                    const dados = docSnapshot.data();
                    setNumeroContrato(dados.numeroContrato);
                    setRazao(dados.razao);
                    setCpf(dados.cpf);
                    setBairro(dados.bairro);
                    setCep(dados.cep);
                    setCidade(dados.cidade);
                    setEndereco(dados.endereco);
                    setFantasia(dados.fantasia);
                    setObs(dados.obs);
                    setUf(dados.uf);
                    setBairro(dados.bairro);
                    setParcelas(dados.parcelas);
                    setWhats(dados.whats);
                    setFuncionamento(dados.funcionamento);
                    setValor(dados.valor);
                    setNome(dados.nome);
                    setEmail(dados.email);
                    setFone(dados.fone);
                    setData(dados.data);
                    setPlano(dados.plano);
                    setValidade(dados.validade);
                    setRenovSim(dados.renovSim);
                    setRenovNao(dados.renovNao);
                    setVenc2(dados.venc2);
                    setRepresentante(dados.representante);
                    setCargo(dados.cargo);
                    setOperador(dados.operador);
                    setLink(dados.link);
                    setSite(dados.site);
                    setSociais(dados.socias);
                } else {
                    setMensagem('Cliente não encontrado');
                }
            } catch (error) {
                setMensagem('Erro ao obter dados do cliente');
                console.error('Erro ao obter dados do cliente:', error);
            }
        };
        fetchData();
    }, [db, id]);
    const AlterarCliente = async () => {
        try {
            if (nome.length === 0) {
                setMensagem('Informe o nome');
            } else if (email.length === 0) {
                setMensagem('Informe o e-mail');
            } else {
                await updateDoc(doc(db, 'clientes', id), {
                    nome: nome,
                    email: email,
                    fone: fone,
                    numeroContrato: numeroContrato,
                    razao: razao,
                    cpf: cpf,
                    fantasia: fantasia,
                    endereco: endereco,
                    bairro: bairro,
                    uf: uf,
                    cidade: cidade,
                    cep: cep,
                    whats: whats,
                    obs: obs,
                    funcionamento: funcionamento,
                    valor: valor,
                    plano: plano,
                    renovNao: renovNao,
                    renovSim: renovSim,
                    validade: validade,
                    data: data,
                    parcelas: parcelas,
                    venc2: venc2,
                    representante: representante,
                    cargo: cargo,
                    operador: operador,
                    site: site,
                    link: link,
                    sociais: sociais || '',
                });
                setMensagem('');
                setSucesso('S');
            }
        } catch (erro) {
            setMensagem('Erro ao atualizar cliente');
            setSucesso('N');
            console.error('Erro ao atualizar cliente:', erro);
        }
    };

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
            <div className="container-fluid titulo-2">
                <div className="logo-street">
                    <img src="../../../img/logo-atual-street.jpeg" alt="" />
                </div>
                <table>
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
                                <input onChange={(e) => setNumeroContrato(e.target.value)} value={numeroContrato} type="text" className="form-control" id="contrato" placeholder="" required />
                            </td>
                            <td className="baixo">2024/ 2025 /2026</td>
                            <td className="baixo">Site de buscas</td>
                            <td className="baixo">
                                <input onChange={(e) => setOperador(e.target.value)} value={operador} type="text" className="form-control" id="contrato" placeholder="" required />
                            </td>
                            <td className="baixo">
                                <input onChange={(e) => setData(e.target.value)} value={data} id="date" type="date" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="caixa">
                    <div className="linha1">
                        <h3>
                            AUTORIZAÇÃO PARA DIVULGAÇÃO DE FOTOS E VIDEOS E ACESSORIA DE SERVIÇOS
                        </h3>
                    </div>
                    <br /><br />
                    <div className="escrever">
                        <hr className="font-weight-bold" />
                    </div>
                    <div className="assinante">
                        <h3>
                            ASSINATURA DO AUTORIZANTE
                        </h3>
                    </div>
                    <div className="linha2">
                        <h3>
                            AUTORIZAÇÃO PARA DIVULGAÇÃO DE FOTOS E VIDEOS E ACESSORIA DE SERVIÇOS
                        </h3>
                    </div>
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
                                value={razao}
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
                                value={fantasia}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="cpf">CNPJ/CPF:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setCpf(e.target.value)}
                                value={cpf}
                                className="form-control"

                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="endereco">Endereço:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setEndereco(e.target.value)}
                                value={endereco}
                                className="form-control"

                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="cidade">Cidade:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setCidade(e.target.value)}
                                value={cidade}
                                className="form-control"

                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="uf">Bairro:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setBairro(e.target.value)}
                                value={bairro}
                                className="form-control"

                            />
                        </div>
                    </div>
                    <div className="row">


                        <div className="col-md-6">
                            <label htmlFor="uf">Estado:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setUf(e.target.value)}
                                value={uf}
                                className="form-control"

                            />
                        </div>
                        <div className="col-md-6">
                        <label htmlFor="cep">CEP:</label>
                        <input
                            type="text"
                            id="razaoSocial"
                            name="razaoSocial"
                            onChange={(e) => setCep(e.target.value)}
                            value={cep}
                            className="form-control"

                            
                        />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="whats">WhatsApp:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setWhats(e.target.value)}
                                value={whats}
                                className="form-control"

                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="fone">Telefone:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setFone(e.target.value)}
                                value={fone}
                                className="form-control"

                            />
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-md-12">
                            <label htmlFor="funcionamento">Horario de funcionamento:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setFuncionamento(e.target.value)}
                                value={funcionamento}
                                className="form-control"

                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="email">E-mail:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
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
                                value={site}
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
                            <label htmlFor="link">Link da Página:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setLink(e.target.value)}
                                value={link}
                                className="form-control"

                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="autorizante">Autorizante:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setNome(e.target.value)}
                                value={nome}
                                className="form-control"

                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="redes">Cargo:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setCargo(e.target.value)}
                                value={cargo}
                                className="form-control"

                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="redes">Redes Sociais:</label>
                            <input
                                type="text"
                                id="razaoSocial"
                                name="razaoSocial"
                                onChange={(e) => setSociais(e.target.value)}
                                value={sociais}
                                className="form-control"

                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <label htmlFor="Obs">Obsvervações:</label>
                            <input
                                type="text"
                                id="nomeFantasia"
                                name="nomeFantasia"
                                onChange={(e) => setObs(e.target.value)}
                                value={obs}
                                className="form-control"
                            />
                        </div>
                    </div>
                </form>
                <div className="condicoes">
                    <h3>
                      Condições;(12) Doze, parcelas por vigência no valor de 199,90(Cento e noventa e nove reais e noventa centavos) mensal, parcelado no boleto.
                    </h3>
                </div>
                
                <div className="clausulas">
                    <p>
                        <b>1. Alteração / Inclusão do Nome Fantasia - 2. Alteração / Inclusão de Endereço Comercial. - 3. Alteração/ Inclusão do Horario de Funcionamento. - 4. Alteração/ Inclusão do número de Telefone. - 5. Inclusão de Ponto Localizador. - 6. Criação de Site(Dominio Google). - 7.Criação de QrCode direcionador para página. - 8. Inclusão de descrição (ifood, Drive-thru, retirada no local, refeição no local). - 9.Inclusão de link de redes sociais(Facebook, instagram, twiter) - 10.Adição de 5 bairros diferentes para divulgar sua pagina. - 11. Botão direcionador de WhatsApp. - 12. Adição de produtos na página. - 13. Inclusão de 30 fotos e 5 videos mensalmente. - 14. Resgatar dominio de página.</b>
                    </p>
                </div>

                <div className="data-venc2">
                    <label htmlFor="nomeFantasia">Data de vencimento:</label>
                    <input onChange={(e) => setVenc2(e.target.value)} value={venc2} id="date" type="date" />
                </div>
                <hr className="font-weight-bold" />
                <div className="inf2">
                    <h3>
                        GOO 360º MARKETING DIGITAL
                        <br />
                        SAC@GOO360MARKETING.COM.BR
                        <br />
                        Central de Atendimento: (11) 5242-4990
                    </h3>
                </div>
                <br />
                <hr className="font-weight-bold" />
                <div className="regras">
                    <h2>
                        AS PARTES A CIMA NOMEADAS ASSINARAM, QUE SE REGERÁ PELAS CLAUSULAS E CONDIÇÕES
                    </h2>
                </div>
                <div className="texto">
                    <p>
                        1)Declaro ter recebido todas as informações referente a prestação de serviço da empresa estando em total e plena concordância com a adesão dos serviços supracitados; Atualização e divulgação dos dados que constam na plataforma digital do Google Maps, O contratante poderá encaminhar para a contratado mensalmente 20 fotos e 5 vídeos para atualização de sua página, horário de funcionamento, inclusão de site/ páginas de redes sociais / telefones para contato / ajuda para criação de anúncios/ Criação de Cartão Digital Interativo com links Direcionadores. fica acordado que a contratante deve entrar em contato com a contratada para solicitar o devido suporte quando necessário, e por estar devidamente autorizado a responder pela empresa ativa e passivamente assumo as obrigações deste contrato conforme clausulas; 2)como proponente estou de acordo que a empresa. Goo 360 Marketing Digital CNPJ: 28.062.365/0001-60, realize a administração de minha página dentro do site de busca da Google, realizando mudanças e alterações quando solicitado por parte da contratante, a empresa supracitada nas condições gerais estabelecidas pela lei 10.406/02 e lei 8.078/90 e condições particulares definidas em caráter irrevogável e irretratável. A validação deste contrato dar-se de acordo assinatura para o vínculo contratual conforme Código Civil. 107. 3) Este termo/contrato tem sua validade de validade de 3 anos. O vencimento da 1º parcela será no 8º dia após a assinatura do contrato. O prazo para cancelamento desta prestação de serviço sem ônus, são de 7 sete dias corridos conforme Art.49 do CDC, a solicitação de cancelamento deverá ser feita por escrito através do e-mail: sac@goo360marketing.com.br , formalizando o pedido. Após este prazo dá-se 23 dias corridos para o cancelamento com multa de 40% (quarenta porcento) sobre o valor total do contrato. 4) A inadimplência de qualquer das parcelas, implicara no vencimento antecipado no saldo devedor e o envio aos órgãos de proteção ao crédito (spc e protesto em Cartório), acrescido de juros de mora de 2% e taxas de juros de 12% ao ano. 5) O presente contrato considera se sucessivamente renovado para o(S) mesmo(s) serviço(s) com antecedência de 60 dias de antecedência do termino do prazo em curso , se não houver a manifestação expressa em contrário(s) entre contratante (s) e contratada mantendo-se as mesmas prestações devidamente autorizada vencíveis a mesma época. 6) Se somente quitada a primeira edição, está não dará nulidade ao contrato, a saber, a cobrança da(s) outras edições fica(m) a tempo e a critério da contratada. 7) A data inicial da vigência prevista poderá ser alterada conforme necessidade da contratada sem que isso caracterize prejuízo ao proponente/contratante. 8) No período de 24(horas) após a contratação, estará inserida no site www.google.com.br/maps.com.br o cadastro do proponente com todas as suas inclusões e atualizações no cadastro do proponente, importante ressaltar que está empresa não possui vínculos com a Google Brasil e sim presta serviços técnicos para empresas prestando o seguinte suporte; Atualização de dados na plataforma digital do Google Maps, Criação de Qr-Code Direcionador, Recuperação de Domínio, Criação de Cartão Digital Interativo com links Direcionadores. O contratante poderá encaminhar para a contratado mensalmente 20 fotos e 5 videos para atualização de sua página, através do Whatsaap número ( 11) 5990-2412 ou através do e-mail Marketing@goo360marketing.com.br. 9) Na hipótese de atraso no pagamento deste contrato, poderá a contratada a qualquer tempo ao seu exclusivo critério promover ação judicial cabível em face do proponente / contratante para cumprimento da obrigação adquirida. 10) A contratada não respondera por prejuízo resultantes de erros totais ou parciais que venham a ocorrer nos dados ou figurações fornecidas pelo proponente /contratante cujas características e conteúdo são de exclusiva responsabilidade. Caberá a contratada o direito de propor ação regressiva contra o proponente /contratante caso esta seja condenada a reparar danos causados a terceiros por eleito da publicidade ora autorizada. 11)O signatário desta contratação de publicidade declara estar autorizado pelos dados informados neste instrumento e responderá solidariamente pelas obrigações nele contida. 12 - Nossos boletos são registrados junto ao banco central após a assinatura do contrato o boleto é emitido e enviado a empresa contratante através do e-mail cadastrado.13 –Após o vencimento do boleto caso o pagamento não seja realizado empresa da o prazo de 7 dias corridos para que o mesmo venha ser realizado afins de evitar a negativação.14 - No 8º dia em atraso o não pagamento gera automaticamente o envio dos documentos (CPF/CNPJ) do responsavel Titular do CNPJ aos orgão de proteção ao crédito.15 – Caso o pagamento venha ser realizado em uma dessas instituições fica de responsabilidade da Contratante arcar com as taxas e despesas cartórarias e se gerado cobrança judicialmente o contratante se responsabiliza em arcar com os honorarios Advocatícios. 16) As partes elegem o foro da capital do estado de São Paulo para dirimir eventuais questões deste contrato, renunciando a qualquer outro por mais privilegiado que seja. Declaro ter recebido por e-mail e WhatsApp cópia deste documento após ter lido as informações a mim passadas e por estar devidamente habilitado a responder pela empresa ativa e passivamente, assumo as obrigações deste documento.
                    </p>
                </div>
                <div className="escrever2">
                    <br /><br />
                    <hr className="font-weight-bold" />
                    <h3>
                        Declaro ter lido os termos de uso e concordo com suas clausulas e condições.
                    </h3>
                </div>
                <div className="linha3">
                    <h3>
                        AUTORIZAÇÃO PARA DIVULGAÇÃO DE FOTOS E VIDEOS E ACESSORIA DE SERVIÇOS
                    </h3>
                </div>
                <div className="texto">
                    <p>
                        1. Do direito à privacidade
                        A Lei 13709/2018 - Lei Geral de Proteção de Dados (LGPD) estabelece como fundamento o respeito à privacidade. Desse modo, o presente Termo de Privacidade tem o propósito de comunicar de forma simples quais tipos de dados pessoais serão coletados, quando, de que forma e para quais finalidades serão utilizados. A privacidade é um direito conferido a todo indivíduo, está protegida pela lei brasileira e consiste na habilidade que este tem de controlar a exposição de informações sobre sua vida pessoal, sua intimidade, bem como a disponibilidade de dados sobre si mesmo, de retificar, ratificar ou apagar estes e de proteger a confidencialidade de suas comunicações, seu domicílio, sua imagem, honra e reputação perante terceiros.2. Atualização e veracidade dos dados; O titular e/ou seus responsáveis legais são os responsáveis pela atualização, exatidão e veracidade dos dados que informarem à empresa Goo 360 Marketing Digital. Caso sejam identificados erros de informações cadastradas, o Goo 360 Marketing Digital i solicitará ao Titular correções; O Goo 360 Marketing Digital não se responsabiliza por dados desatualizados em suas bases de dados. 3. Do prazo e forma de armazenamento. Os dados do usuário serão obtidos por meio da efetivação de seu vínculo com a Instituição, quando o usuário insere as informações voluntariamente, por meio de ferramentas de coleta de dados de acesso e navegação existentes em alguns sites e/ou aplicativos. Os dados coletados são armazenados em ambiente seguro e em servidor próprio ou de terceiro contratado para este fim. 4. Da Segurança e Proteção dos Dados Pessoais; As informações são protegidas com padrões de segurança e confidencialidade, para fornecer aos usuários um ambiente seguro e confiável através do uso de criptografia, certificações digitais e acessos controlados. Adicionalmente, o próprio titular deve exercer alguns cuidados para auxiliar na proteção de seus dados. a) Cuidados com Golpes: Os criminosos cibernéticos se aproveitam dos assuntos do momento para enviar mensagens fraudulentas com intuito de roubar dados ou instalar vírus e outros softwares maliciosos por meio de links em mensagens falsas. b) Compartilhamento de senhas: Sua senha é pessoal e intransferível e que deve ser mantida sob sigilo e em ambiente seguro. Não compartilhe a sua senha, ceder ou utilizar a senha de outra pessoa é tipificado como crime no art. 308, do Código Penal.
                    </p>
                </div>
                <div className="escrever2">
                    <br /><br />
                    <hr className="font-weight-bold" />
                    <h3>
                        Autorizo a divulgação dos meus dados comerciais.
                    </h3>
                </div>
                <br />
                <div className="inf">
                    <h3>
                        GOO 360º MARKETING DIGITAL
                        <br />
                        SAC@GOO360MARKETING.COM.BR
                        <br />
                        Central de Atendimento: (11) 5242-4990
                    </h3>
                </div>
                {mensagem.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{mensagem}</div> : null}
                {sucesso === 'S' ? <Navigate to='/app/home' /> : null}
            </div>
        </div>
        <div className="row salvar ">
            <Link to="/app/home" className="btn btn-warning btn-acao">Cancelar</Link>
            <button onClick={AlterarCliente} type="button" className="btn btn-primary btn-acao">Salvar</button>
        </div>
    </div>
}
export default EditarCliente;