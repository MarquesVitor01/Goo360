import React from "react";
import './banner.css'
function Banner(){
    return <section className="banner" id="banner">
        <div className="container">
            <div className="row justify-content-center">
                <div className="goo">
                    <a href="/app" className="btn btn-light btn-lg btn-banner entrar"><b>Entrar</b></a>
                </div>
            </div>
        </div>
    </section>
}
export default Banner;