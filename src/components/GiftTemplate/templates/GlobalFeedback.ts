import { TemplateOptions, Question } from './types';
import TextType from './TextType';
import { state } from '.';
import { theme } from '../constants';

interface GlobalFeedbackOptions extends TemplateOptions {
    feedback: Question['globalFeedback'];
}

export default function GlobalFeedback({ feedback }: GlobalFeedbackOptions): string {
    const Container = `
  position: relative;
  margin-top: 1rem;
  padding: 0 1rem;
  background-color: ${theme(state.theme, 'beige100', 'black400')};
  color: ${theme(state.theme, 'beige900', 'gray200')};
  border: ${theme(state.theme, 'beige300', 'black300')} ${state.theme === 'light' ? 1 : 2}px solid;
  border-radius: 6px;
  box-shadow: 0px 2px 5px ${theme(state.theme, 'gray400', 'black800')};
`;

    return feedback !== null
        ? `<div style="${Container}">
        <p>${TextType({ text: feedback })}</p>
      </div>`
        : ``;
}
