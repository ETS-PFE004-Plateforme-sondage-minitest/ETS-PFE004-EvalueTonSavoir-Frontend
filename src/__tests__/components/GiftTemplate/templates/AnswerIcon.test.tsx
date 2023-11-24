const { render } = require('@testing-library/react');
require('@testing-library/jest-dom');
const React = require('react');
const AnswerIcon = require('../../../../components/GiftTemplate/templates/AnswerIcon');

describe('AnswerIcon', () => {
  it('should render correct icon when correct is true', () => {
    const { container } = render(React.createElement(AnswerIcon, { correct: true }));
    const correctIcon = '<svg style="vertical-align: text-bottom; display: inline-block; margin-left: 0.1rem; margin-right: 0.2rem; width: 1em; color: #28a745;" role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
    expect(container.innerHTML).toEqual(correctIcon);
  });

  it('should render incorrect icon when correct is false', () => {
    const { container } = render(React.createElement(AnswerIcon, { correct: false }));
    const incorrectIcon = '<svg style="vertical-align: text-bottom; display: inline-block; margin-left: 0.1rem; margin-right: 0.2rem; width: 0.75em; color: #dc3545;" role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
    expect(container.innerHTML).toEqual(incorrectIcon);
  });
});