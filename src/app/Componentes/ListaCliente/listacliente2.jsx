  import React, { useState, useEffect } from "react";
  import { Link } from "react-router-dom";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  import { getStorage, ref, listAll } from 'firebase/storage';
  import Swal from 'sweetalert2';
  import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
  function ListaCliente2(props) {  
    const [pagoStatus, setPagoStatus] = useState(() => {
      const storedStatus = localStorage.getItem('pagoStatus');
      return storedStatus ? JSON.parse(storedStatus) : {};
    });
    const [paymentDates, setPaymentDates] = useState(() => {
      const storedDates = localStorage.getItem('paymentDates');
      return storedDates ? JSON.parse(storedDates) : {};
    })

    useEffect(() => {
      localStorage.setItem('pagoStatus', JSON.stringify(pagoStatus));
      localStorage.setItem('paymentDates', JSON.stringify(paymentDates));
    }, [pagoStatus, paymentDates]);

    const fetchPagoStatus = async () => {
      const db = getFirestore();
      for (const cliente of props.arrayClientes) {
        const clienteRef = doc(db, 'clientes', cliente.id);
        const clienteDoc = await getDoc(clienteRef);
        if (clienteDoc.exists()) {
          const data = clienteDoc.data();
          setPagoStatus((prevStatus) => ({
            ...prevStatus,
            [cliente.id]: data.pago || [],
          }));
          setPaymentDates((prevDates) => ({
            ...prevDates,
            [cliente.id]: data.paymentDates || [],
          }));
        }
      }
    };

    const handlePagoChange = async (clienteId, parcelaIndex, newValue) => {
      const currentDate = new Date().toISOString();
      const newData = newValue
        ? { pago: true, dataPagamento: (paymentDates[clienteId] && paymentDates[clienteId][parcelaIndex]) || currentDate }
        : { pago: false, dataPagamento: null };

      const { value: selectedDate } = await Swal.fire({
        title: 'Selecione a Data de Pagamento',
        html: '<input type="text" id="datepicker" class="swal2-input">',
        preConfirm: () => {
          const selectedDate = document.getElementById('datepicker').value;
          return selectedDate;
        }
      });

      if (selectedDate) {
        newData.dataPagamento = new Date(selectedDate).toISOString();
      }

      Swal.fire({
        title: 'Confirmação',
        text: `O valor em aberto ${newValue ? 'está pago' : 'não está pago'}? Clique aqui para ${newValue ? 'marcar' : 'desmarcar'}!`,
        icon: 'question',
        showCancelButton: false,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
      }).then(async (result) => {
        if (result.isConfirmed) {
          setPagoStatus((prevStatus) => ({
            ...prevStatus,
            [clienteId]: {
              ...prevStatus[clienteId],
              [parcelaIndex]: newValue,
            }
          }));
          setPaymentDates((prevDates) => ({
            ...prevDates,
            [clienteId]: {
              ...prevDates[clienteId],
              [parcelaIndex]: newData.dataPagamento,
            }
          }));
          const db = getFirestore();
          const clienteRef = doc(db, 'clientes', clienteId);
          await updateDoc(clienteRef, newData);
          console.log(`Status pago para o cliente ID ${clienteId}, parcela ${parcelaIndex} atualizado para ${newValue}`);
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

  
    useEffect(() => {
      const filterClientes = async () => {
          try {
            console.log("Iniciando filtro de clientes");
            const filtered = await Promise.all(
              props.arrayClientes.map(async (cliente) => {
                try {
                  const hasAssociatedFiles = await hasFiles(cliente);
                  console.log(`Cliente ${cliente.id}: Tem arquivos? ${hasAssociatedFiles}`);
                  return hasAssociatedFiles ? cliente : null;
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
    }, [props.arrayClientes]);
    return (
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="table-secondary">
            <th scope="col" className="text-center" >CNPJ/CPF</th>
            <th scope="col" className="text-center">Nome</th>
            <th scope="col" className="text-center">Email</th>
            <th scope="col" className="text-center">UF</th>
            <th scope="col" className="text-center">Telefone</th>
            <th scope="col" className="text-center">Valor</th>
            <th scope="col" className="text-center">Vencimento</th>
            <th scope="col" className="text-center">Parcelas</th>
            <th scope="col" className="text-center">Ação</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.map((cliente) => {
            const isPago = pagoStatus[cliente.id] || false;
            const paymentDate = paymentDates[cliente.id] || null;
            const parcelas = parseInt(cliente.parcelas) || 0;
            if (props.exibirPagos && parcelas === 0) {
              return null;
            }
            if (props.exibirPagos && !isPago) {
              return null;
            }
            return (
              <tr key={cliente.id} className="table-light text-center">
                <th scope="row" >
                  <Link to={`/app/home/fichacliente/${cliente.id}`} className="fa-solid fa-list icone-acao1"></Link>
                  {cliente.cpf}
                </th>
                <td>{cliente.nome}</td>
                <td>{cliente.email}</td>
                <td>{cliente.uf}</td>
                <td>{cliente.fone}</td>
                <td>{cliente.valor}</td>
                <td>{cliente.venc2}</td>
                <td className="align-middle">{cliente.parcelas}</td>
                  <td>
                  {[...Array(parcelas)].map((_, index) => (
                      <div key={index}>
                      <input
                        type="checkbox"
                        checked={(pagoStatus[cliente.id] && pagoStatus[cliente.id][index]) || false}
                        onChange={(e) => handlePagoChange(cliente.id, index, e.target.checked)}
                      />
                        <DatePicker
                          selected={(paymentDates[cliente.id] && paymentDates[cliente.id][index]) ? new Date(paymentDates[cliente.id][index]) : null}
                          dateFormat="dd/MM/yyyy"
                          onChange={(date) => {
                            // Nada a fazer aqui, apenas para exibição da data
                          }}
                        />
                      </div>
                    ))}
                  </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  export default ListaCliente2;