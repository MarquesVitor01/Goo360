import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
function ListaCliente3(props) {
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
    return (
        <table className="table table-hover table-bordered">
            <thead>
                <tr className="table-secondary">
                    <th scope="col">CNPJ/CPF</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Email</th>
                    <th scope="col">UF</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Vencimento</th>
                    <th scope="col">Acordo</th>
                    <th scope="col">Informações do acordo</th>
                    {/* <th scope="col">Pago</th>
                    <th scope="col">Data de Pagamento</th> */}
                </tr>
            </thead>
            <tbody>
                {props.arrayClientes.map((cliente) => {
                    const isPago = pagoStatus[cliente.id] || false;
                    const paymentDate = paymentDates[cliente.id] || null;
                    const isAcordo = acordoStatus[cliente.id] || false;
                    const acordoDate = acordoDates[cliente.id] || null;
                    const additionalInfoData = additionalInfo[cliente.id] || {};
                    if (props.exibirPagos && !isPago) {
                        return null;
                    }
                    return (
                        <tr key={cliente.id} className="table-light" >
                            <th scope="row" className="align-middle">
                                <Link to={`/app/home/fichacliente/${cliente.id}`} className="fa-solid fa-list icone-acao1"></Link>
                                {cliente.cpf}
                            </th>
                            <td className="align-middle">{cliente.nome}</td>
                            <td className="align-middle">{cliente.email}</td>
                            <td className="align-middle">{cliente.uf}</td>
                            <td className="align-middle">{cliente.fone}</td>
                            <td className="align-middle">{cliente.valor}</td>
                            <td className="align-middle">{cliente.venc2}</td>
                            <td className="align-middle">
                                <input
                                    type="checkbox"
                                    checked={isAcordo}
                                    onChange={(e) => handleAcordoChange(cliente.id, e.target.checked)}
                                />
                            </td>
                            <td>
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
    );
}
export default ListaCliente3;