import React from "react";
function Footer() {
    return <footer className="footer" id="footer">
        <div className="container bottom_border">
            <div className="row">
                <div className=" col-sm-4 col-md col-sm-4  col-12 col">
                    <h5 className="headin5_amrc col_white_amrc pt2">Sobre Nós</h5>
                    <p className="mb10">Somos uma empresa de marketing digital com suporte para o google maps, criação de cartão digital interavo/ criação de logomarca e videos interativos da empresa.</p>
                    <p><i className="fa fa-phone"></i>  (11) 3939-2301 </p>
                    <p><i className="fa fa fa-envelope"></i> marketing@mapsempresas.com.br</p>
                </div>
                <div className=" col-sm-4 col-md  col-12 col">
                    <h5 className="headin5_amrc col_white_amrc pt2">Redes sociais</h5>
                    <ul className="footer_ul2_amrc">
                        <li><a href="https://grupomapsempresas.com.br/"><i className="fab fa-globe fleft padding-right"></i> </a><p><a href="https://grupomapsempresas.com.br/">Acompanhe as novidades no nosso site.</a></p></li>
                        <li><a href="https://www.instagram.com/grupomaps/"><i className="fab fa-instagram fleft padding-right"></i> </a><p><a href="https://www.instagram.com/grupomaps/">Siga-nos no instagram.</a></p></li>
                        <li><a href="https://www.facebook.com/grupomapsempresas"><i className="fab fa-facebook fleft padding-right"></i> </a><p><a href="https://www.facebook.com/grupomapsempresas">Siga-nos no facebook.</a></p></li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="container">
            <p className="mt-2">Desde de 2024 | Criado por <a href="https://grupomapsempresas.com.br/">Goo 360</a></p>
            <ul className="social_footer_ul col-lg">
                <li><a href="https://www.facebook.com/grupomapsempresas"><i className="fab fa-facebook-f"></i></a></li>
                <li><a href="https://api.whatsapp.com/send?phone=551139392301&text=Ol%C3%A1,%20gostaria%20de%20maiores%20informa%C3%A7%C3%B5es%20sobre%20o%20Google%20Meus%20Neg%C3%B3cios,%20podem%20me%20ajudar?"><i className="fab fa-whatsapp"></i></a></li>
                <li><a href="https://www.instagram.com/grupomaps/"><i className="fab fa-instagram"></i></a></li>
            </ul>
        </div>
    </footer>
}

export default Footer;