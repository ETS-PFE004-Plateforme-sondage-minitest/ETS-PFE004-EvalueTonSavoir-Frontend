import * as React from 'react';
import './footer.css';

interface FooterProps {

}

const Footer: React.FC<FooterProps> = ({ }) => {
    return (
        <div className="footer">
            <div className="footer-content">
                Réalisé avec ❤ à Montréal par des finissant•e•s de l'ETS
            </div>
            <div className="footer-links">
                <a href="https://github.com/louis-antoine-etsmtl/ETS-PFE042-EvalueTonSavoir-Frontend/tree/main">Frontend GitHub</a>
                <span className="divider">|</span>
                <a href="https://github.com/louis-antoine-etsmtl/ETS-PFE042-EvalueTonSavoir-Backend">Backend GitHub</a>
                <span className="divider">|</span>
                <a href="https://github.com/louis-antoine-etsmtl/EvalueTonSavoir/wiki">Wiki GitHub</a>
            </div>
        </div>
    );
};

export default Footer;