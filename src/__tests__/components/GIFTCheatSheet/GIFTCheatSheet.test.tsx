// GiftCheatSheet.test.tsx
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GiftCheatSheet from '../../../components/GIFTCheatSheet/GiftCheatSheet';

describe('GiftCheatSheet', () => {
  it('renders the cheat sheet with correct headings and information', () => {
    const { getByText, getByRole } = render(<GiftCheatSheet />);

    expect(getByText("Informations pratiques sur l'éditeur")).toBeInTheDocument();
    expect(getByText('1. Questions Vrai/Faux')).toBeInTheDocument();
    expect(getByText('2. Questions à choix multiple')).toBeInTheDocument();
    expect(getByText('3. Questions à choix multiple avec plusieurs réponses')).toBeInTheDocument();
    expect(getByText('4. Questions à reponse courte')).toBeInTheDocument();
    expect(getByText('5. Questions numériques')).toBeInTheDocument();
    expect(getByText('6. Paramètres optionnels')).toBeInTheDocument();
    expect(getByText('7. Paramètres optionnels')).toBeInTheDocument();
    expect(getByText('8. LaTeX')).toBeInTheDocument();
    expect(getByText('9. inserer une image')).toBeInTheDocument();
    expect(getByText('10. Informations supplémentaires')).toBeInTheDocument();

    expect(getByText(/L'éditeur utilise le format GIFT/i)).toBeInTheDocument();
    expect(getByRole('link', { name: /Documentation de GIFT/i })).toBeInTheDocument();
  });

  it('renders the correct example for Vrai/Faux questions', () => {
    const { getByText } = render(<GiftCheatSheet />);
    const exampleText = '2+2 = 4 ? {T}';

    expect(getByText(exampleText)).toBeInTheDocument();
  });

  it('renders information about using LaTeX', () => {
    const { getByText } = render(<GiftCheatSheet />);
    const latexExample = '$$x\\= \\frac\\{y^2\\}\\{4\\}$$';

    expect(getByText(latexExample)).toBeInTheDocument();
  });

});
