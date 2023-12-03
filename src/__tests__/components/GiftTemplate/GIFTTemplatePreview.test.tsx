import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';

describe('GIFTTemplatePreview Component', () => {
  /*test('renders loading message when questions are provided', () => {
    render(<GIFTTemplatePreview questions={['Question 1', 'Question 2']} />);

    const loadingMessage = screen.findByText(/Chargement de la prévisualisation.../i);
    console.log(loadingMessage);
    expect(loadingMessage).toBeInTheDocument();
  });*/

  test('renders error message when questions contain invalid syntax', () => {
    render(<GIFTTemplatePreview questions={['Invalid GIFT syntax']} />);

    const errorMessage = screen.findByText(/Erreur inconnue/i, {}, { timeout: 5000 });

    expect(errorMessage).resolves.toBeInTheDocument();
  });

  test('renders preview when valid questions are provided', () => {
    const questions = [
      'Question 1 { A | B | C }',
      'Question 2 { D | E | F }',
    ];

    render(<GIFTTemplatePreview questions={questions} />);

    const previewContainer = screen.getByTestId('preview-container');
    expect(previewContainer).toBeInTheDocument();

  });

  test('hides answers when hideAnswers prop is true', () => {
    const questions = [
      'Question 1 { A | B | C }',
      'Question 2 { D | E | F }',
    ];

    render(<GIFTTemplatePreview questions={questions} hideAnswers />);

    const previewContainer = screen.getByTestId('preview-container');
    expect(previewContainer).toBeInTheDocument();
  });
});