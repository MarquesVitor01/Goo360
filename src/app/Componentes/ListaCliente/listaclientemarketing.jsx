import React, { useState, useEffect } from "react";
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { Link } from "react-router-dom";
import { getStorage, ref, listAll } from 'firebase/storage';

import "./listaclientemarketing.css";

function ListaClienteMarketing(props) {
  const ScriptModal = ({ onClose, clientId, onCheckAll }) => {
    const [checkboxes, setCheckboxes] = useState(() => {
      const savedCheckboxes = localStorage.getItem(
        `savedCheckboxes_${clientId}`
      );
      return savedCheckboxes
        ? JSON.parse(savedCheckboxes)
        : {
            checkbox1: false,
            checkbox2: false,
            checkbox3: false,
            checkbox4: false,
          };
    });

    const handleCheckboxChange = (checkboxName) => {
      setCheckboxes((prevCheckboxes) => {
        const newCheckboxes = {
          ...prevCheckboxes,
          [checkboxName]: !prevCheckboxes[checkboxName],
        };
        localStorage.setItem(
          `savedCheckboxes_${clientId}`,
          JSON.stringify(newCheckboxes)
        );
        return newCheckboxes;
      });
    };

    const updateFirestoreDocument = (clientId, data) => {
      const db = getFirestore();
      const docRef = doc(db, 'clientes', clientId);
      return updateDoc(docRef, data);
    };

    const handleSalvar = () => {
      localStorage.setItem(
        `savedCheckboxes_${clientId}`,
        JSON.stringify(checkboxes)
      );
      const concluido = areAllCheckboxesChecked();
      updateFirestoreDocument(clientId, { concluido });
      onCheckAll(clientId, concluido);
      onClose();
    };

    const areAllCheckboxesChecked = () =>
      Object.values(checkboxes).every(Boolean);

    return (
      <div className="script-modal over">
        <div className="script-modal-content">
          <span className="close" onClick={onClose}>
            &times;
          </span>
          <br />
          <div>
            <label>
              <input
                type="checkbox"
                checked={checkboxes.checkbox1}
                onChange={() => handleCheckboxChange("checkbox1")}
              />
              Logomarca
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={checkboxes.checkbox2}
                onChange={() => handleCheckboxChange("checkbox2")}
              />
              Cartão Digital
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={checkboxes.checkbox3}
                onChange={() => handleCheckboxChange("checkbox3")}
              />
              Página da Google
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={checkboxes.checkbox4}
                onChange={() => handleCheckboxChange("checkbox4")}
              />
              QrCode
            </label>
          </div>
          <button onClick={handleSalvar}>Salvar</button>
          {areAllCheckboxesChecked() && <div className="checkmark-icon">✓</div>}
        </div>
      </div>
    );
  };

  const [isScriptModalVisible, setScriptModalVisible] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [allCheckboxesChecked, setAllCheckboxesChecked] = useState(() => {
    const savedStates = localStorage.getItem("allCheckboxesChecked");
    return savedStates ? JSON.parse(savedStates) : {};
  });

  const handleMostrarScript = (clientId) => {
    setSelectedClientId(clientId);
    setScriptModalVisible(true);
  };

  const handleFecharScriptModal = () => {
    setSelectedClientId(null);
    setScriptModalVisible(false);
  };

  const handleCheckAll = (clientId, checked) => {
    setAllCheckboxesChecked((prev) => ({ ...prev, [clientId]: checked }));
  };

  useEffect(() => {
    localStorage.setItem("allCheckboxesChecked", JSON.stringify(allCheckboxesChecked));
  }, [allCheckboxesChecked]);

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
  }, [props.arrayClientes, allCheckboxesChecked]);

  return (
    <table className="table table-hover table-bordered">
      <thead>
        <tr className="table-secondary">
          <th scope="col" className="text-center">CNPJ/CPF</th>
          <th scope="col" className="text-center">Nome</th>
          <th scope="col" className="text-center">Email</th>
          <th scope="col" className="text-center">UF</th>
          <th scope="col" className="text-center">Telefone</th>
          <th scope="col" className="text-center">Data de venda</th>
          <th scope="col" className="col-acao text-center"></th>
        </tr>
      </thead>
      <tbody>
        {filteredClientes.map((cliente) => (
          <tr key={cliente.id} className="table-light text-center">
            <th scope="row " className="align-middle">
              <Link
                to={`/app/home/fichacliente/${cliente.id}`}
                className="fa-solid fa-list icone-acao1 align-middle"
              ></Link>
              {cliente.cpf || "N/A"}
            </th>
            <td className="align-middle">{cliente.nome || 'N/A'}</td>
            <td className="align-middle">{cliente.email || 'N/A'}</td>
            <td className="align-middle">{cliente.uf || 'N/A'}</td>
            <td className="align-middle">{cliente.fone || 'N/A'}</td>
            <td className="align-middle">{cliente.data || 'N/A'}</td>
            <td>
              <button onClick={() => handleMostrarScript(cliente.id)}>
                <i
                  className={`fa-solid ${
                    allCheckboxesChecked[cliente.id]
                      ? "fa-check icone-verde"
                      : "fa-paperclip"
                  }`}
                ></i>
              </button>
              <Link to="#" onClick={() => props.clickDelete(cliente.id)}>
                    <i className="fa-solid fa-trash icone-acao red"></i>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
      {isScriptModalVisible && selectedClientId && (
        <ScriptModal
          onClose={handleFecharScriptModal}
          clientId={selectedClientId}
          onCheckAll={handleCheckAll}
        />
      )}
    </table>
  );
}

export default ListaClienteMarketing;