import React from "react";
import { Doughnut } from 'react-chartjs-2';
import '../Graficos/graficos.css'
const Dashboard = ({ clientes, exibirPagos }) => {
  const calcularSituacaoFinanceira = () => {
    const totalClientes = clientes.length;
    const clientesPagos = clientes.filter(cliente => cliente.pago);
    const valorTotalPagos = clientes.reduce((total, cliente) => {
      const valor = parseFloat(cliente.pago ? cliente.valor : 0);
      return isNaN(valor) ? total : total + valor;
    }, 0).toFixed(2);
    const valorTotalAReceber = clientes.reduce((total, cliente) => {
      const valor = parseFloat(cliente.pago ? 0 : cliente.valor);
      return isNaN(valor) ? total : total + valor;
    }, 0).toFixed(2);
    return {
      totalClientes,
      clientesPagos: clientesPagos.length,
      clientesNaoPagos: totalClientes - clientesPagos.length,
      valorTotalPagos,
      valorTotalAReceber,
    };
  };
  const situacaoFinanceira = calcularSituacaoFinanceira();
  const data = {
    labels: ['Pagos', 'Não Pagos'],
    datasets: [
      {
        data: [situacaoFinanceira.clientesPagos, situacaoFinanceira.clientesNaoPagos],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };
  return (
    <div>
      <h2>Situação Financeira - Resumo</h2>
      <div className="row valores">
      <div className="receber font-weight-bold">
      <p>Valor inadimplente: {situacaoFinanceira.valorTotalAReceber}</p>
      </div>
        <div className="pagos font-weight-bold">
      <p>Valor Pago: {situacaoFinanceira.valorTotalPagos}</p>
      </div>
      </div>
      <div style={{ width: '70%', margin: 'auto' }} className="doug">
        <Doughnut data={data} />
      </div>
    </div>
  );
};
export default Dashboard;