import { nanoid } from 'nanoid';
import { TemplateOptions, TextFormat, Choice, MultipleChoice as MultipleChoiceType } from './types';
import TextType from './TextType';
import AnswerIcon from './AnswerIcon';
import { state } from '.';
import { ParagraphStyle, theme } from '../constants';

type MultipleChoiceAnswerOptions = TemplateOptions & Pick<MultipleChoiceType, 'choices'>;

type AnswerFeedbackOptions = TemplateOptions & Pick<Choice, 'feedback'>;

interface AnswerWeightOptions extends TemplateOptions {
    weight: Choice['weight'];
    correct: Choice['isCorrect'];
}

export default function MultipleChoiceAnswers({ choices }: MultipleChoiceAnswerOptions) {
    const id = `id${nanoid(8)}`;

    const isMultipleAnswer = choices.filter(({ isCorrect }) => isCorrect === true).length === 0;

    const prompt = `<span style="${ParagraphStyle(state.theme)}">Select one${
        isMultipleAnswer ? ` or more` : ``
    }:</span>`;
    const result = choices
        .map(({ weight, isCorrect, text, feedback }) => {
            const CustomLabel = `
          display: inline-block;
          padding: 0.2em 0 0.2em 0;
        `;

            const inputId = `id${nanoid(6)}`;

            const isPositiveWeight = weight !== null && weight > 0;
            const isCorrectOption = isMultipleAnswer ? isPositiveWeight : isCorrect;

            return `
        <div>
          <input class="gift-input" type="${
              isMultipleAnswer ? 'checkbox' : 'radio'
          }" id="${inputId}" name="${id}">
          ${AnswerWeight({ correct: isCorrectOption, weight: weight })}
            <label style="${CustomLabel} ${ParagraphStyle(state.theme)}" for="${inputId}">
            ${TextType({ text: text as TextFormat })}
            </label>
          ${AnswerIcon({ correct: isCorrectOption })}
          ${AnswerFeedback({ feedback: feedback })}
          </input>
        </div>
        `;
        })
        .join('');

    return `${prompt}${result}`;
}

function AnswerWeight({ weight, correct }: AnswerWeightOptions): string {
    const Container = `
      box-shadow: 0px 1px 1px ${theme(state.theme, 'gray400', 'black900')};
      border-radius: 3px;
      padding-left: 0.2rem;
      padding-right: 0.2rem;
      padding-top: 0.05rem;
      padding-bottom: 0.05rem;
    `;

    const CorrectWeight = `
      color: ${theme(state.theme, 'green700', 'green100')};
      background-color: ${theme(state.theme, 'green100', 'greenGray700')};
    `;
    const IncorrectWeight = `
    color: ${theme(state.theme, 'beige600', 'beige100')};
    background-color: ${theme(state.theme, 'beige300', 'beigeGray800')};
  `;

    return weight
        ? `<span style="${Container} ${
              correct ? `${CorrectWeight}` : `${IncorrectWeight}`
          }">${weight}%</span>`
        : ``;
}

function AnswerFeedback({ feedback }: AnswerFeedbackOptions): string {
    const Container = `
      color: ${theme(state.theme, 'teal700', 'gray700')};
    `;

    return feedback ? `<span style="${Container}">${TextType({ text: feedback })}</span>` : ``;
}
