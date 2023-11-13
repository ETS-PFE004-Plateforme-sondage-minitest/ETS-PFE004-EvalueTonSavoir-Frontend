// GiftCheatSheet.tsx
import React from 'react';
import './GiftCheatSheet.css';

const GiftCheatSheet: React.FC = () => {
    return (
        <div className="gift-cheat-sheet">
            <h2 className="subtitle">Informations pratiques sur l'éditeur</h2>
            <span>L'éditeur utilise le format GIFT (General Import Format Template) créé pour la plateforme Moodle afin de générer les quizs. Ci-dessous vous pouvez retrouver la syntaxe pour chaque type de question ainsi que les champs optionnels :</span>
            <div className="question-type">
                <h4>1. Questions Vrai/Faux</h4>
                <pre>
                    <code>
                        {'2+2 = 4 ? {T}'}
                        <br />
                        <span className="code-comment">{'// Vous pouvez utiliser les valeurs {T}, {F}, {TRUE} et {FALSE}'}</span>
                    </code>
                </pre>
            </div>

            <div className="question-type">
                <h4>2. Questions à choix multiple</h4>
                <pre>
                    <code className="question-code-block">
                        {'Quelle ville est la capitale du Canada? {\n~ Toronto\n~ Montréal\n= Ottawa #Bonne réponse!\n}'}
                        <br />
                        <span className="code-comment">{'// La bonne réponse est Ottawa'}</span>
                    </code>
                </pre>
            </div>
            <div className="question-type">
                <h4>3. Questions à choix multiple avec plusieurs réponses</h4>
                <pre>
                    <code className="question-code-block">
                        {'Quelles villes trouve-t-on au Canada? { \n~ %33.3% Montréal \n~ %33.3% Ottawa \n~ %33.3% Vancouver \n~ %-100% New York \n~ %-100% Paris \n#### La bonne réponse est Montréal, Ottawa et Vancouver \n}'}
                        <br />
                        <span className="code-comment">{'// On utilise le signe ~ pour toutes les réponses'}</span><br />
                        <span className="code-comment">{'// On doit indiquer le pourcentage de chaque réponse'}</span>
                    </code>
                </pre>
            </div>
            

            <div className="question-type">
                <h4>4. Questions à reponse courte</h4>
                <pre>
                    <code className="question-code-block">
                        {'Avec quoi ouvre-t-on une porte? { \n= clé \n= clef \n}'}
                        <br />
                        <span className="code-comment">{'// Permet de fournir plusieurs bonnes réponses.'}</span><br />
                        <span className="code-comment">{'// Note: Les majuscules ne sont pas prises en compte.'}</span>
                    </code>
                </pre>
            </div>

            <div className="question-type">
                <h4> 5. Questions numériques </h4>
                <pre>
                    <code className="question-code-block">
                        {'Question {#=Nombre} //OU \nQuestion {#=Nombre:Tolérance} //OU \nQuestion {#=PetitNombre..GrandNombre}'}
                        <br />
                        <span className="code-comment">{'// La tolérance est un pourcentage'}</span><br />
                        <span className="code-comment">{'// La réponse doit être comprise entre PetitNombre et GrandNombre'}</span>
                    </code>
                </pre>
            </div>

            <div className="question-type">
                <h4> 6. Paramètres optionnels </h4>
                <pre>
                    <code className="question-code-block">
                        {'::Titre:: '}
                        <span className="code-comment">{' // Ajoute un titre à une question'}</span>
                        <br />
                        {'# Feedback '}
                        <span className="code-comment">{' // Feedback pour UNE réponse'}</span>
                        <br />
                        {'// Commentaire '}
                        <span className="code-comment">{' // Commentaire non apparent'}</span>
                        <br />
                        {'#### Feedback général '}
                        <span className="code-comment">{' // Feedback général pour une question'}</span>
                        <br />
                        {'%50% '}
                        <span className="code-comment">{' // Poids d\'une réponse (peut être négatif)'}</span>
                    </code>
                </pre>
            </div>

            <div className="question-type">
                <h4> 7. Paramètres optionnels </h4>
                <p>Si vous souhaitez utiliser certains caractères spéciaux dans vos énoncés, réponses ou feedback, vous devez 'échapper' ces derniers en ajoutant un \ devant:</p>
                <pre>
                    <code className="question-code-block">
                        {'\\~ \n\\= \n\\# \n\\{ \n\\} \n\\:'}
                    </code>
                </pre>
            </div>

            <div className="question-type">
                <h4> 8. LaTeX </h4>
                <p>Le format LaTeX est supporté dans cette application. Vous devez cependant penser à 'échapper' les caractères spéciaux mentionnés plus haut.</p>
                <p>Exemple d'équation:</p>
                <pre>
                    <code className="question-code-block">
                        {'$$x\\= \\frac\\{y^2\\}\\{4\\}$$'}
                    </code>
                </pre>
            </div>

            <div className="question-type">
                <h4> 9. Informations supplémentaires </h4>
                <p>
                    GIFT supporte d'autres formats de questions que nous ne gérons pas sur cette
                    application.
                </p>
                <p>Vous pouvez retrouver la Documentation de GIFT (en anglais):</p>
                <a href="https://ethan-ou.github.io/vscode-gift-docs/docs/questions">
                    Documentation de GIFT
                </a>
            </div>
        </div>
    );
};

export default GiftCheatSheet;
