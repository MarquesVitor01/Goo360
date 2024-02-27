import React from "react";
import './menu.css'
function Menu() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
      <div className="container">
        <a className="navbar-brand" href="/#">
          <img src="../../../img/logo-street.jpg" width="85" height="80" alt="" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Alterna navegação"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse d-lg-flex justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/#">
                Início <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#testemunho">
                Clientes
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#precos">
                Planos e Preços
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#footer">
                Contato
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;