import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { getStorage, ref, listAll } from 'firebase/storage';
import Swal from 'sweetalert2';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
function ListaCliente3(props) {
      const [filtroDataVenda, setFiltroDataVenda] = useState(""); // Estado para armazenar a data de filtro
    const [pagoStatus, setPagoStatus] = useState(() => {
        const storedStatus = localStorage.getItem('pagoStatus');
        return storedStatus ? JSON.parse(storedStatus) : {};
    });
    const [paymentDates, setPaymentDates] = useState(() => {
        const storedDates = localStorage.getItem('paymentDates');
        return storedDates ? JSON.parse(storedDates) : {};
    });
    const [acordoStatus, setAcordoStatus] = useState(() => {
        const storedStatus = localStorage.getItem('acordoStatus');
        return storedStatus ? JSON.parse(storedStatus) : {};
    });
    const [acordoDates, setAcordoDates] = useState(() => {
        const storedDates = localStorage.getItem('acordoDates');
        return storedDates ? JSON.parse(storedDates) : {};
    });
    useEffect(() => {
        const fetchPagoStatus = async () => {
            const db = getFirestore();
            for (const cliente of props.arrayClientes) {
                const clienteRef = doc(db, 'clientes', cliente.id);
                const clienteDoc = await getDoc(clienteRef);
                if (clienteDoc.exists()) {
                    const data = clienteDoc.data();
                    setPagoStatus((prevStatus) => ({
                        ...prevStatus,
                        [cliente.id]: data.pago || false,
                    }));
                }
            }
        };
        fetchPagoStatus();
    }, [props.arrayClientes]);
    useEffect(() => {
        const fetchAcordoStatus = async () => {
            const db = getFirestore();
            for (const cliente of props.arrayClientes) {
                const clienteRef = doc(db, 'clientes', cliente.id);
                const clienteDoc = await getDoc(clienteRef);
                if (clienteDoc.exists()) {
                    const data = clienteDoc.data();
                    setAcordoStatus((prevStatus) => ({
                        ...prevStatus,
                        [cliente.id]: data.acordo || false,
                    }));
                }
            }
        };
        fetchAcordoStatus();
    }, [props.arrayClientes]);
    const handlePagoChange = async (clienteId, newValue) => {
        const currentDate = new Date().toISOString();
        const newData = newValue ? { pago: true, dataPagamento: currentDate } : { pago: false, dataPagamento: null };
        Swal.fire({
            title: 'Confirmação',
            text: `O valor em aberto ${newValue ? 'está pago' : 'não está pago'}? Clique aqui para ${newValue ? 'marcar' : 'desmarcar'}!`,
            icon: 'question',
            showCancelButton: false,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setPagoStatus((prevStatus) => ({ ...prevStatus, [clienteId]: newValue }));
                setPaymentDates((prevDates) => ({ ...prevDates, [clienteId]: currentDate }));
                const db = getFirestore();
                const clienteRef = doc(db, 'clientes', clienteId);
                await updateDoc(clienteRef, newData);
                localStorage.setItem('paymentDates', JSON.stringify({ ...paymentDates, [clienteId]: currentDate }));
                console.log(`Status pago para o cliente ID ${clienteId} atualizado para ${newValue}`);
            } else {
                setPagoStatus((prevStatus) => ({ ...prevStatus, [clienteId]: false }));
                setPaymentDates((prevDates) => ({ ...prevDates, [clienteId]: null }));
                localStorage.setItem('paymentDates', JSON.stringify({ ...paymentDates, [clienteId]: null }));
                console.log(`Status pago para o cliente ID ${clienteId} atualizado para ${newValue}`);
            }
        });
    };
    const [additionalInfo, setAdditionalInfo] = useState(() => {
        const storedInfo = localStorage.getItem('additionalInfo');
        return storedInfo ? JSON.parse(storedInfo) : {};
    });
    const deleteInfo = (clienteId) => {
        Swal.fire({
            title: 'Tem certeza que deseja excluir informações?',
            html: `
                <input type="password" id="senha-exclusao" class="swal2-input" placeholder="Senha de Exclusão">
            `,
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then((result) => {
            if (result.isConfirmed) {
                const senhaDigitada = document.getElementById('senha-exclusao').value;

                // Adicione aqui a lógica de verificação da senha
                const senhaCorreta = '@1V?$9En9o#1qa'; // Substitua com a sua senha real

                if (senhaDigitada === senhaCorreta) {
                    // Se a senha estiver correta, proceda com a exclusão
                    setAdditionalInfo((prevInfo) => {
                        const updatedInfo = { ...prevInfo };
                        delete updatedInfo[clienteId];
                        return updatedInfo;
                    });
                    localStorage.setItem('additionalInfo', JSON.stringify({ ...additionalInfo, [clienteId]: null }));
                    Swal.fire('Informações excluídas!', '', 'success');
                } else {
                    // Senha incorreta
                    Swal.fire('Senha incorreta!', 'Você não tem permissão para excluir informações.', 'error');
                }
            }
        });
    };
    const addInfoManually = async (clienteId) => {
        const result = await Swal.fire({
            title: 'Adicionar Informações',
            html: `
                <input type="text" id="info-input" class="swal2-input" placeholder="Informações">
                <input type="text" id="name-input" class="swal2-input" placeholder="Seu Nome">
            `,
            showCancelButton: true,
            confirmButtonText: 'Adicionar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const infoInput = document.getElementById('info-input').value;
                const nameInput = document.getElementById('name-input').value;
                return { info: infoInput, name: nameInput };
            },
        });
        if (result.isConfirmed) {
            const { info, name } = result.value;
            if (!info || !name) {
                Swal.fire({
                    icon: 'error',
                    title: 'Preencha todas as informações',
                    text: 'Você precisa fornecer tanto as informações quanto o seu nome.',
                });
                return;
            }
            setAdditionalInfo((prevInfo) => ({ ...prevInfo, [clienteId]: { info, name } }));
            // Update local storage after adding information
            localStorage.setItem('additionalInfo', JSON.stringify({ ...additionalInfo, [clienteId]: { info, name } }));
        }
    };
    useEffect(() => {
        const fetchAcordoStatus = async () => {
            const db = getFirestore();
            const storedAcordoDates = {};
            for (const cliente of props.arrayClientes) {
                const clienteRef = doc(db, 'clientes', cliente.id);
                const clienteDoc = await getDoc(clienteRef);
                if (clienteDoc.exists()) {
                    const data = clienteDoc.data();
                    setAcordoStatus((prevStatus) => ({
                        ...prevStatus,
                        [cliente.id]: data.acordo || false,
                    }));
                    const storedDate = localStorage.getItem(`acordoDates_${cliente.id}`);
                    storedAcordoDates[cliente.id] = storedDate ? JSON.parse(storedDate) : null;
                }
            }
            setAcordoDates(storedAcordoDates);
        };
        fetchAcordoStatus();
    }, [props.arrayClientes]);
    const handleAcordoChange = async (clienteId, newValue) => {
        const currentDate = new Date().toISOString();
        const newData = newValue
            ? { acordo: true, dataAcordo: currentDate }
            : { acordo: false, dataAcordo: null };
        Swal.fire({
            title: 'Confirmação',
            text: `Uma nova data para pagamento ${newValue ? 'foi acordada' : 'não foi acordada'
                }? Clique aqui para ${newValue ? 'marcar' : 'desmarcar'}!`, 
            icon: 'question',
            showCancelButton: false,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setAcordoStatus((prevStatus) => ({ ...prevStatus, [clienteId]: newValue }));
                if (newValue) {
                    localStorage.setItem(`acordoDates_${clienteId}`, JSON.stringify(newData.dataAcordo));
                    console.log(`Saved acordo date for cliente ID ${clienteId}: ${newData.dataAcordo}`);
                } else {
                    localStorage.removeItem(`acordoDates_${clienteId}`);
                }
                const db = getFirestore();
                const clienteRef = doc(db, 'clientes', clienteId);
                await updateDoc(clienteRef, newData);
                console.log(`Status pago para o cliente ID ${clienteId} atualizado para ${newValue}`);
            } else {
                setAcordoStatus((prevStatus) => ({ ...prevStatus, [clienteId]: false }));
                setAcordoDates((prevDates) => ({ ...prevDates, [clienteId]: null }));
                // Remove the agreement date from localStorage if the user clicks 'Não'
                localStorage.removeItem(`acordoDates_${clienteId}`);
                console.log(`Status pago para o cliente ID ${clienteId} atualizado para ${newValue}`);
            }
        });
    };
    async function hasFiles(cliente) {
        const storage = getStorage();
        const filesRef = ref(storage, `gs://goo3-c312f.appspot.com/arquivos/${cliente.razao}`);
    
        try {
          const filesList = await listAll(filesRef);
          return filesList.items.length > 0;
        } catch (error) {
          return false;
        }
      }
    
      const [filteredClientes, setFilteredClientes] = useState([]);
      const auth = getAuth();
      const user = auth.currentUser;
     
      useEffect(() => {
        console.log("Usuário atual:", user && user.uid);
        console.log("Filtrando clientes...");
    
        const filterClientes = async () => {
            try {
                console.log("Iniciando filtro de clientes");
                const filtered = await Promise.all(
                    props.arrayClientes.map(async (cliente) => {
                        try {
                            const hasAssociatedFiles = await hasFiles(cliente);
                            console.log(`Cliente ${cliente.id}: Tem arquivos? ${hasAssociatedFiles}`);
                            // Verifica se o cobrador é "Andressa Oliveira" e se o usuário é o ID específico
                            if (cliente.cobrador === "Jhonatan Ramos" && user && user.uid === "ilzGCRvNkmOB4qSMOGogaE4tibx1") {
                                return hasAssociatedFiles ? cliente : null;
                            } else if(cliente.cobrador === "Ana Clara" && user && user.uid === "y6UeOde6C4URx0LuhNsTUXa20fV2"){
                                return hasAssociatedFiles ? cliente : null;
                            } else if(cliente.cobrador === "Karolina Salgado" && user && user.uid === "DlbtuKXgg6hvZmEdRQeZSuTftyh1"){
                                return hasAssociatedFiles ? cliente : null;
                            } else if(cliente.cobrador === "Adriana Lima" && user && user.uid === "yBQIpUZr3Xeneye2fzBspxSgQp22"){
                                return hasAssociatedFiles ? cliente : null;
                            } else if(cliente.cobrador === "Allan Bruno" && user && user.uid === "wjvQvddKX2exZPD4p6hu8hikDRh1"){
                                return hasAssociatedFiles ? cliente : null;
                            } else if(cliente.cobrador === "Bruno Santos" && user && user.uid === "Qme2QhHrYcMkKJJaCppvBm04dRZ2"){
                                return hasAssociatedFiles ? cliente : null;
                            } else {
                                return null;
                            }
                        } catch (error) {
                            console.error(`Erro ao verificar arquivos do cliente ${cliente}:`, error);
                            return null;
                        }
                    })
                );
                console.log("Clientes filtrados:", filtered);
                setFilteredClientes(filtered.filter(Boolean));
            } catch (error) {
                console.error("Erro geral ao filtrar clientes:", error);
            }
        };
        filterClientes();
    }, [props.arrayClientes, user]);
    return (
        <div>
            <input
                type="date"
                value={filtroDataVenda}
                onChange={(e) => setFiltroDataVenda(e.target.value)}
                className="form-control date"
            />
            <table className="table table-hover table-bordered">
                <thead>
                    <tr className="table-secondary align-middle">
                        <th scope="col" className="text-center">CNPJ/CPF</th>
                        <th scope="col" className="text-center">Cobrador</th>
                        <th scope="col" className="text-center">Nome</th>
                        <th scope="col" className="text-center">Email</th>
                        <th scope="col" className="text-center">UF</th>
                        <th scope="col" className="text-center">Telefone</th>
                        {/* <th scope="col" className="text-center">Valor</th> */}
                        <th scope="col" className="text-center">Vencimento</th>
                        <th scope="col" className="text-center">Acordo</th>
                        <th scope="col" className="text-center">Informações do acordo</th>
                        {/* <th scope="col">Pago</th>
                    <th scope="col">Data de Pagamento</th> */}
                    </tr>
                </thead>
                <tbody>
                    {filteredClientes.filter((cliente) => !filtroDataVenda || cliente.data >= filtroDataVenda).
                        map((cliente) => {
                            const isPago = pagoStatus[cliente.id] || false;
                            const paymentDate = paymentDates[cliente.id] || null;
                            const isAcordo = acordoStatus[cliente.id] || false;
                            const acordoDate = acordoDates[cliente.id] || null;
                            const additionalInfoData = additionalInfo[cliente.id] || {};
                            if (props.exibirPagos && !isPago) {
                                return null;
                            }
                            return (
                                <tr key={cliente.id} className="table-light text-center" >
                                    <th scope="row" className="align-middle">
                                        <Link to={`/app/home/fichacliente/${cliente.id}`} className="fa-solid fa-list icone-acao1"></Link>
                                        {cliente.cpf}
                                    </th>
                                    <td className="align-middle">{cliente.cobrador}</td>
                                    <td className="align-middle">{cliente.nome}</td>
                                    <td className="align-middle">{cliente.email}</td>
                                    <td className="align-middle">{cliente.uf}</td>
                                    <td className="align-middle">{cliente.fone}</td>
                                    {/* <td className="align-middle">{cliente.valor}</td> */}
                                    <td className="align-middle">{cliente.venc2}</td>
                                    <td className="align-middle">
                                        <input
                                            type="checkbox"
                                            checked={isAcordo}
                                            onChange={(e) => handleAcordoChange(cliente.id, e.target.checked)}
                                        />
                                    </td>
                                    <td>
                                    <Link to={`/app/home/fichacobrancagoo/${cliente.id}`}><i className="fa-solid fa-money-check-dollar green"></i></Link>
                                        <button onClick={() => addInfoManually(cliente.id)}>
                                            Adicionar Informações
                                        </button>
                                        {additionalInfoData.info && (
                                            <div>
                                                <strong>Informações:</strong> {additionalInfoData.info}
                                                <br />
                                                <strong>Adicionado por:</strong> {additionalInfoData.name}
                                                <br />
                                                <button onClick={() => deleteInfo(cliente.id)}>
                                                    Excluir Informações
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    {/* <td className="align-middle">
                                <input
                                    type="checkbox"
                                    checked={isPago}
                                    onChange={(e) => handlePagoChange(cliente.id, e.target.checked)}
                                />
                            </td>
                            <td className="align-middle">
                                {isPago ? (
                                    <DatePicker
                                        selected={paymentDate ? new Date(paymentDate) : null}
                                        dateFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                        }}
                                        readOnly
                                    />
                                ) : null}
                            </td> */}
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}
export default ListaCliente3;