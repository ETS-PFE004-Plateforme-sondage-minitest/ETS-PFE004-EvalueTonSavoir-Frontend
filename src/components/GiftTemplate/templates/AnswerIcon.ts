import { TemplateOptions } from './types';
import { theme } from '../constants';
import { state } from '.';

interface AnswerIconOptions extends TemplateOptions {
    correct: boolean;
}

export default function AnswerIcon({ correct }: AnswerIconOptions): string {
    const Icon = `
  vertical-align: text-bottom;
  display: inline-block;
  margin-left: 0.1rem;
  margin-right: 0.2rem;
`;

    const Correct = `
    width: 1em;
    color: ${theme(state.theme, 'success', 'success')};
  `;

    const Incorrect = `
    width: 0.75em;
    color: ${theme(state.theme, 'danger', 'danger')};
  `;

    const CorrectIcon = (): string => {
        return `<svg style="${Icon} ${Correct}" role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>`;
    };

    const IncorrectIcon = (): string => {
        return `<svg style="${Icon} ${Incorrect}" role="img" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>`;
    };

    return correct ? CorrectIcon() : IncorrectIcon();
}
