import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingCircle from '../../../components/LoadingCircle/LoadingCircle';

describe('LoadingCircle', () => {
  it('displays the provided text correctly', () => {
    const text = 'Veuillez attendre la connexion au serveur...';
    render(<LoadingCircle text={text} />);

    expect(screen.getByText(text)).toBeInTheDocument();
  });

});
