import { TemplateOptions, Matching as MatchingType } from './types';
import QuestionContainer from './QuestionContainer';
import Title from './Title';
import TextType from './TextType';
import GlobalFeedback from './GlobalFeedback';
import { ParagraphStyle, SelectStyle } from '../constants';
import { state } from '.';

type MatchingOptions = TemplateOptions & MatchingType;

interface MatchAnswerOptions extends TemplateOptions {
    choices: MatchingType['matchPairs'];
}

export default function Matching({
    title,
    stem,
    matchPairs,
    globalFeedback
}: MatchingOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Matching',
                title: title
            }),
            `<p style="${ParagraphStyle(state.theme)}">${TextType({
                text: stem
            })}</p>`,
            MatchAnswers({ choices: matchPairs }),
            GlobalFeedback({ feedback: globalFeedback })
        ]
    })}`;
}

function MatchAnswers({ choices }: MatchAnswerOptions): string {
    const Layout = `
  display: grid;
  grid-template-columns: fit-content(50%) fit-content(50%);
  grid-gap: 0.25rem;
  align-items: center;
  `;

    const Dropdown = `
  padding: 0.375rem 1.75rem 0.375rem 0.75rem;
  background-image: url(data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Ctitle%3Edown-arrow%3C%2Ftitle%3E%3Cg%20fill%3D%22%23000000%22%3E%3Cpath%20d%3D%22M10.293%2C3.293%2C6%2C7.586%2C1.707%2C3.293A1%2C1%2C0%2C0%2C0%2C.293%2C4.707l5%2C5a1%2C1%2C0%2C0%2C0%2C1.414%2C0l5-5a1%2C1%2C0%2C1%2C0-1.414-1.414Z%22%20fill%3D%22%23${
      state.theme === 'light' ? '000' : 'ccc'
  }%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fsvg%3E);
  background-size: 0.6em;
  background-position: calc(100% - 0.5em) center;
  background-repeat: no-repeat;
  border-radius: 0.25rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: auto;
  vertical-align: baseline;
`;

    const OptionTable = `
  padding-right: 1rem;
  `;

    const uniqueMatchOptions = Array.from(new Set(choices.map(({ subanswer }) => subanswer)));

    const result = choices
        .map(({ subquestion }) => {
            return `
          <div style="${OptionTable} ${ParagraphStyle(state.theme)}">
            ${TextType({ text: subquestion })} 
          </div>
          <div>
            <select class="gift-select" style="${SelectStyle(state.theme)} ${Dropdown}">
            <option value="" disabled selected hidden>Choose...</option>
            ${uniqueMatchOptions.map((subanswer) => `<option>${subanswer}</option>`).join('')}
            </select>
          </div>
      `;
        })
        .join('');

    return `
    <div style="${Layout}">
      ${result}
    </div>
  `;
}
