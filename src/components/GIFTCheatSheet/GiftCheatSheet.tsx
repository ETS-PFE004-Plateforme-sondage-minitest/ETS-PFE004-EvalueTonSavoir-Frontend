import React from 'react';
import './GiftCheatSheet.css';

const GiftCheatSheet: React.FC = () => {
    return (
        <div className="gift-cheat-sheet">
            <h2 className="subtitle">informations pratique sur l'éditeur</h2>
            <div className="question-type">
                <h4>1. Questions à choix multiple</h4>
                <pre>
                    <code>
                        {
                            'Qui est enterré dans le tombeau de Grant? {\n~Napoleon \n~Grant \n=Personne\n}\n'
                        }
                        <span className="code-comment">{'// La bonne réponse est Personne\n'}</span>
                    </code>
                </pre>
            </div>
            <div className="question-type">
                <h4>2. Questions vrai/faux</h4>
                <pre>
                    <code>
                        {'Est-ce que la tombe de Grant est vide? {T}\n'}
                        <span className="code-comment">{'// {F} si la réponse est "faux"\n'}</span>
                        <span className="code-comment">
                            {'// vous pouvez aussi utiliser {TRUE} ou {FALSE}'}
                        </span>
                    </code>
                </pre>
            </div>

            <div className="question-type">
                <h4>3. Questions à reponse courte</h4>
                <pre>
                    <code>
                        {'Avec quoi ouvre-t-on une porte? {\n=clé\n=clef\n}\n'}
                        <span className="code-comment">
                            {
                                '//Il peut y avoir plusieurs orthographes possible.\n//Note: les majuscules ne sont pas prises en compte.\n'
                            }
                        </span>
                    </code>
                </pre>
            </div>
            <div className="question-type">
                <h4> 4. Questions numériques </h4>
                <pre>
                    <code>
                        {
                            'Résoudre $$x+4\\=8$$\n{~$$x\\=\\frac12$$ \n~$$x\\=2$$ \n=$$x\\=42$$ \n}\n'
                        }
                        <span className="code-comment">{'// La bonne réponse est 42\n'}</span>
                    </code>
                </pre>
            </div>
            <div className="question-type">
                <h4> 4. Informations supplémentaires </h4>
                <p>
                    GIFT supporte d'autres formats de questions que nous ne gérons pas sur cette
                    application.
                </p>
                <p>Vous pouvez retrouver la doc de GIFT :</p>
                <a href="https://ethan-ou.github.io/vscode-gift-docs/docs/questions">
                    Documentation de GIFT
                </a>
            </div>
        </div>
    );
};

export default GiftCheatSheet;
