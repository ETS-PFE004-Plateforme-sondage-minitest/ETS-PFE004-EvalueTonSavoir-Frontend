import { TemplateOptions, Question } from './types';
import { state } from '.';
import { theme } from '../constants';

// Type is string to allow for custom question type text (e,g, "Multiple Choice")
interface TitleOptions extends TemplateOptions {
    type: string;
    title: Question['title'];
}

export default function Title({ type, title }: TitleOptions): string {
    const Container = `
  display: flex;
  font-weight: bold;
`;

    const QuestionTitle = `
  color: ${theme(state.theme, 'black700', 'gray200')}
  `;

    const OptionalTitle = `
  color: ${theme(state.theme, 'teal600', 'gray900')}
`;

    const QuestionTypeContainer = `
  margin-left: auto;
  padding-left: 0.75rem;
  flex: none;
`;

    const QuestionType = `
  box-shadow: 0px 1px 3px ${theme(state.theme, 'gray400', 'black700')};
  padding-left: 0.7rem;
  padding-right: 0.7rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  border-radius: 4px;
  background-color: ${theme(state.theme, 'cyan100', 'black400')};
  color: ${theme(state.theme, 'teal700', 'gray300')};
`;

    return `
  <div style="${Container}">
    <span>
      ${
          title !== null
              ? `<span style="${QuestionTitle}">${title}</span>`
              : `<span style="${OptionalTitle}">Titre optionnel...</span>`
      }
    </span>
    <span style="${QuestionTypeContainer} margin-bottom: 10px;">
      <span style="${QuestionType}">${type}</span>
    </span>
  </div>
`;
}
