//GIFTCheatSheet.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GiftCheatSheet from "../../../components/GIFTCheatSheet/GiftCheatSheet";

describe('GiftCheatSheet Component', () => {
    beforeEach(() => {
        render(<GiftCheatSheet />);
    });

    it('renders the cheat sheet with all question types', () => {
        expect(screen.getByText('Informations pratiques sur l\'éditeur')).toBeInTheDocument();
        expect(screen.getByText('1. Questions Vrai/Faux')).toBeInTheDocument();
        expect(screen.getByText('2. Questions à choix multiple')).toBeInTheDocument();
        expect(screen.getByText('3. Questions à choix multiple avec plusieurs réponses')).toBeInTheDocument();
        expect(screen.getByText('4. Questions à reponse courte')).toBeInTheDocument();
        expect(screen.getByText('5. Questions numériques')).toBeInTheDocument();
        expect(screen.getByText('6. Paramètres optionnels')).toBeInTheDocument();
        expect(screen.getByText('7. Paramètres optionnels')).toBeInTheDocument();
        expect(screen.getByText('8. LaTeX')).toBeInTheDocument();
        expect(screen.getByText('9. Informations supplémentaires')).toBeInTheDocument();
    });

    it('renders the escape characters section correctly', () => {
        const escapeCharacters = ['\\~', '\\=', '\\#', '\\{', '\\}', '\\:'];

        escapeCharacters.forEach((character) => {
            const escapedCharacters = screen.getAllByText(new RegExp(character));
            escapedCharacters.forEach((escapedCharacter) => {
                expect(escapedCharacter).toBeInTheDocument();
            });
        });
    });

    it('renders the additional information section correctly', () => {
        expect(screen.getByText('GIFT supporte d\'autres formats de questions que nous ne gérons pas sur cette application.')).toBeInTheDocument();
        expect(screen.getByText('Vous pouvez retrouver la Documentation de GIFT (en anglais):')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Documentation de GIFT' })).toHaveAttribute('href', 'https://ethan-ou.github.io/vscode-gift-docs/docs/questions');
    });
});
