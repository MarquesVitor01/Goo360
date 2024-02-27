import React from "react";
import "./features.css";  // Importe o arquivo CSS correspondente

function Features() {
  return (
    <section id="features" className="features">
      <div className="container">
        <div className="row icons-fe">
          <div className="icon">
            <i class="fa-solid fa-network-wired"></i>
            <div className="agi">
            <h3><b>Agilidade</b></h3>
            <p>Automação de funções </p>
            </div>
          </div>
          <div className="icon">
            <i class="fa-solid fa-magnifying-glass-chart"></i>
            <div className="agi">
            <h3><b>Facilidade</b></h3>
            <p>Visibilidade de informações</p>
            </div>
          </div>
          <div className="icon ">
          <i class="fa-solid fa-database"></i> 
          <div className="agi">
            <h3><b>Segurança</b></h3>
            <p>Proteção e gerenciamento de dados</p>
            </div>         
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;