import { TemplateOptions } from './types';
import { state } from './index';
import { theme } from '../constants';

export default function QuestionContainer({ children }: TemplateOptions): string {
    const Container = `
  flex-wrap: wrap;
  position: relative;
  padding: 1rem 1rem;
  margin-bottom: 0.5rem;
  background-color: ${theme(state.theme, 'white', 'black600')};
  border: solid ${theme(state.theme, 'white', 'black500')} 2px;
  border-radius: 6px;
  box-shadow: 0px 1px 3px ${theme(state.theme, 'gray400', 'black900')};
`;

    return `<section style="${Container}">${
        Array.isArray(children) ? children.join('') : children
    }</section>`;
}
