import React from "react";
import './testemunho.css'
function Testemunho(){
    return <section className="testemunho" id="testemunho">
        <div className="container">
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
  <ol className="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div className="carousel-inner testemunho">
    <div className="carousel-item active box">
      <img className="d-block w-100 " src="../../img/360-photos.png" alt="Primeiro Slide"/>
    </div>
    <div className="carousel-item box">
      <img className="d-block w-100" src="../../img/google-streetview-camera.jpg" alt="Segundo Slide"/>
    </div>
    <div className="carousel-item box">
      <img className="d-block w-100" src="../../img/Google-Maps.png" alt="Terceiro Slide"/>
    </div>
  </div>
  <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="sr-only">Anterior</span>
  </a>
  <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="sr-only">Próximo</span>
  </a>
</div>
        </div>
    </section>
}
export default Testemunho;