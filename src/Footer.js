

import React from 'react';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import './stylesP/Footer.css';

const Footer = () => {
  return (
    
    <div className="footer">
      <footer className="py-5 bg-light container">
        <div className="row  d-flex justify-content-center"> 
          <div className="col-6 col-md-2 mb-3">
            <h5>Rutas</h5>
            <ul className="nav flex-column footer-links centered-links">
              <li className="nav-item mb-2"><a href="https://efigas.buk.co/users/sign_in" className="nav-link p-0 text-body-secondary">CreSer</a></li>
              <li className="nav-item mb-2"><a href="http://efinet.efigas.co/" className="nav-link p-0 text-body-secondary">Efinet</a></li>
              <li className="nav-item mb-2"><a href="http://172.26.3.27/gnc/Principal.aspx" className="nav-link p-0 text-body-secondary">EnlaC</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul className="nav flex-column footer-links centered-links">
              <li className="nav-item mb-2"><a href="https://portaladministrativo.efigas.com.co/#/" className="nav-link p-0 text-body-secondary">Innova Efigas</a></li>
              <li className="nav-item mb-2"><a href="https://efigas.binaps.cloud/efigas/" className="nav-link p-0 text-body-secondary">Integra/Binaps</a></li>
              <li className="nav-item mb-2"><a href="https://gascaribe.atlassian.net/servicedesk/customer/portals" className="nav-link p-0 text-body-secondary">JIRA</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-2 mb-3">
            <h5>Section</h5>
            <ul className="nav flex-column footer-links centered-links">
              <li className="nav-item mb-2"><a href="https://tecnologia.efigas.com.co/moodle/login/index.php" className="nav-link p-0 text-body-secondary">Moodle</a></li>
              <li className="nav-item mb-2"><a href="https://tuclave.efigas.com.co/authorization.do" className="nav-link p-0 text-body-secondary">Tu Clave</a></li>
              <li className="nav-item mb-2"><a href="http://192.168.1.145/Workflow" className="nav-link p-0 text-body-secondary">Workflow</a></li>
            </ul>
          </div>
        </div>
        <div className="d-flex flex-column flex-sm-row justify-content-between py-8 my-8 border-top ">
          <p>&copy; 2024 Efigas S.A.E.S.P </p>
          <ul className="list-unstyled d-flex justify-content-ceneter iconos">
            <li className="ms-3"><a className="link-body-emphasis" href="https://x.com/efigas_oficial?lang=es"><FaTwitter className="text-primary" /></a></li>
            <li className="ms-3"><a className="link-body-emphasis" href="https://www.instagram.com/efigasoficial/?hl=es"><FaInstagram  className="text-danger" /></a></li>
            <li className="ms-3"><a className="link-body-emphasis" href="https://www.facebook.com/efigasoficial/?locale=es_LA"><FaFacebook className="text-primary" /></a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
