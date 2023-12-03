import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnswerIcon from '../../../../components/GiftTemplate/templates/AnswerIcon';

describe('AnswerIcon', () => {
  test('renders correct icon when correct is true', () => {
    const { container } = render(<div dangerouslySetInnerHTML={{ __html: AnswerIcon({ correct: true }) }} />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveStyle(`
      vertical-align: text-bottom;
      display: inline-block;
      margin-left: 0.1rem;
      margin-right: 0.2rem;
      width: 1em;
      color: rgb(92, 92, 92);
    `);
  });

  test('renders incorrect icon when correct is false', () => {
    const { container } = render(<div dangerouslySetInnerHTML={{ __html: AnswerIcon({ correct: false }) }} />);
    const svgElement = container.querySelector('svg');

    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveStyle(`
      vertical-align: text-bottom;
      display: inline-block;
      margin-left: 0.1rem;
      margin-right: 0.2rem;
      width: 0.75em;
      color: rgb(79, 216, 79);  
    `);
  });
});
