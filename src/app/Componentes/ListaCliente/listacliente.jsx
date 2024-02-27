import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Arquivos from "../../Arquivos/arquivos";
import './listacliente.css';
import Swal from 'sweetalert2';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

function ListaCliente(props) {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [filesInfo, setFilesInfo] = useState({});
  const [filtroDataVenda, setFiltroDataVenda] = useState(""); // Estado para armazenar a data de filtro
  const [forceRender, setForceRender] = useState(false); // Estado para forçar re-renderização

  const handleFileSelect = (clientId, event) => {
    const files = event.target.files;
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [clientId]: files,
    }));
  };

  const renderFileIndicator = (clientId) => {
    const fileInfo = filesInfo[clientId];
    if (fileInfo && fileInfo.length > 0) {
      // Filtrar apenas os arquivos da pasta "arquivos"
      const arquivosFiles = fileInfo.filter(file => file.url.startsWith(`arquivos/${clientId}/`));

      if (arquivosFiles.length > 0) {
        return (
          <span key={forceRender} className="text-success">
            Arquivos Armazenados: {arquivosFiles.length}
          </span>
        );
      } else {
        return <span key={forceRender} className="text-muted">Sem Arquivos Armazenados</span>;
      }
    } else {
      return <span key={forceRender} className="text-muted">Sem Arquivos Armazenados</span>;
    }
  };

  useEffect(() => {
    const storedFilesInfo = localStorage.getItem('filesInfo');
    if (storedFilesInfo) {
      setFilesInfo(JSON.parse(storedFilesInfo));
    }
  }, [forceRender]);

  const handleArmazenarArquivos = async (cliente) => {
    try {
      console.log('Iniciando o armazenamento de arquivos...');
      const storage = getStorage();
      const files = selectedFiles[cliente.id];

      if (files && files.length > 0) {
        const storageRef = ref(storage, `gs://goo3-c312f.appspot.com/arquivos/${cliente.razao}/${files[0].name}`); // Criar a pasta com o nome da razão social
        await uploadBytes(storageRef, files[0]);

        const downloadURL = await getDownloadURL(storageRef);
        const newFilesInfo = { ...filesInfo, [cliente.id]: [{ name: files[0].name, url: downloadURL }] };

        setFilesInfo(newFilesInfo);
        localStorage.setItem('filesInfo', JSON.stringify(newFilesInfo));
        setSelectedFiles({});
      } else {
        console.error('Nenhum arquivo selecionado para upload.');
      }

      setForceRender(!forceRender); // Força re-renderização

      console.log('Arquivos armazenados com sucesso.');
    } catch (error) {
      console.error('Erro ao armazenar o arquivo:', error);
    }
  };

  const handleExcluirArquivo = async (cliente) => {
    try {
      console.log('Iniciando a exclusão de arquivos...');
      const storage = getStorage();
      const clienteFiles = filesInfo[cliente.id];

      if (clienteFiles && clienteFiles.length > 0) {
        // Exclui cada arquivo associado ao cliente
        await Promise.all(clienteFiles.map(async (file) => {
          const storageRef = ref(storage, `gs://goo3-c312f.appspot.com/arquivos/${cliente.razao}/${file.name}`);
          await deleteObject(storageRef);
        }));

        // Atualiza o estado e o armazenamento local
        const updatedFilesInfo = { ...filesInfo, [cliente.id]: [] };
        setFilesInfo(updatedFilesInfo);
        localStorage.setItem('filesInfo', JSON.stringify(updatedFilesInfo));

        setForceRender(!forceRender); // Força re-renderização

        console.log('Arquivos excluídos com sucesso.');
      } else {
        console.log('Nenhum arquivo associado ao cliente.');
      }
    } catch (error) {
      console.error('Erro ao excluir os arquivos:', error);
    }
  };
  const handleClick = (cliente) => {
    
    handleArmazenarArquivos(cliente);
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
          <tr className="table-secondary">
            <th scope="col" className="text-center">CNPJ/CPF</th>
            <th scope="col" className="col-acao text-center"><i className="fa-solid fa-signature icon-u"></i></th>
            <th scope="col" className="col-acao text-center"><i className="fa-solid fa-envelope icon-u"></i></th>
            <th scope="col" className="col-acao text-center"><i className="fa-solid fa-earth-americas icon-u"></i></th>
            <th scope="col" className="col-acao text-center"><i className="fa-solid fa-phone icon-pho"></i></th>
            <th scope="col" className="col-acao text-center"><i className="fa-solid fa-user icon-u"></i></th>
            <th scope="col" className="col-acao text-center"><i className="fa-solid fa-calendar-days icon-calendar"></i></th>
            <th scope="col" className="col-acao text-center"><i className="fa-solid fa-circle-info icon-info"></i></th>
            <th scope="col" className="col-acao text-center"><i className="fa-solid fa-clipboard icon-clip"></i></th>
            <th scope="col" className="col-acao text-center"><i className="fa-solid fa-clipboard icon-clip"></i></th>
          </tr> 
        </thead>
        <tbody>
          {props.arrayClientes
            .filter((cliente) => !filtroDataVenda || cliente.data >= filtroDataVenda)
            .map((cliente) => (
              <tr key={cliente.id} className="table-light text-center">
                <th scope="row " className="align-middle">
                  <Link to={`/app/home/fichacliente/${cliente.id}`} className="fa-solid fa-list icone-acao1 align-middle"></Link>
                  {cliente.cpf}
                </th>
                <td className="align-middle">{cliente.nome}</td>
                <td className="align-middle">{cliente.email}</td>
                <td className="align-middle">{cliente.uf}</td>
                <td className="align-middle">{cliente.fone}</td>
                <td className="align-middle">{cliente.operador}</td>
                <td className="align-middle">{cliente.data}</td>
                <td>
                  <button onClick={() => addInfoManually(cliente.id)}>
                    Adicionar Informações
                  </button>
                  {additionalInfo[cliente.id] && (
                    <div>
                      <strong>Informações:</strong> {additionalInfo[cliente.id].info}
                      <br />
                      <strong>Adicionado por:</strong> {additionalInfo[cliente.id].name}
                      <br />
                      <button onClick={() => deleteInfo(cliente.id)}>
                        Excluir Informações
                      </button>
                    </div>
                  )}
                </td>
                <td>  
                  <Link to={`/app/home/editarcliente/${cliente.id}`}>
                    <i className="fa-solid fa-pen-to-square icone-acao"></i>
                  </Link>
                  <Link to="#" onClick={() => props.clickDelete(cliente.id)}>
                    <i className="fa-solid fa-trash icone-acao red"></i>
                  </Link>
                  <input
                    type="file"
                    onChange={(e) => handleFileSelect(cliente.id, e)}
                    className="form-control-file"
                  />
                  {renderFileIndicator(cliente.id)}
                  <button
                    onClick={() => handleClick(cliente)}
                    className="btn btn-success"
                    type="button"
                  >
                    <i className="fa-solid fa-upload"></i> Armazenar Arquivos
                  </button>
                  <Arquivos
                    clientId={cliente.id}
                    filesInfo={filesInfo}
                    handleExcluirArquivo={() => handleExcluirArquivo(cliente)}
                  />
                </td>
                <td className="align-middle">{cliente.venc2}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaCliente;