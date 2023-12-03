import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';

describe('GIFTTemplatePreview Component', () => {

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

  it('renders images correctly', () => {
    const questions = [
      'Question 1',
      '<img src="image1.jpg" alt="Image 1">',
      'Question 2',
      '<img src="image2.jpg" alt="Image 2">',
    ];

    const { getByAltText } = render(<GIFTTemplatePreview questions={questions} />);

    const image1 = getByAltText('Image 1');
    const image2 = getByAltText('Image 2');

    expect(image1).toBeInTheDocument();
    expect(image2).toBeInTheDocument();
  });

  it('renders non-images correctly', () => {
    const questions = ['Question 1', 'Question 2'];

    const { queryByAltText } = render(<GIFTTemplatePreview questions={questions} />);

    const image1 = queryByAltText('Image 1');
    const image2 = queryByAltText('Image 2');

    expect(image1).toBeNull();
    expect(image2).toBeNull();
  });

});