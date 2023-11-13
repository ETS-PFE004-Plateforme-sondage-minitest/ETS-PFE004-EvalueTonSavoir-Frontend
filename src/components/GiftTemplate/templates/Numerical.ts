import { TemplateOptions, Numerical as NumericalType, NumericalFormat } from './types';
import QuestionContainer from './QuestionContainer';
import Title from './Title';
import TextType from './TextType';
import GlobalFeedback from './GlobalFeedback';
import { ParagraphStyle, InputStyle } from '../constants';
import { state } from '.';

type NumericalOptions = TemplateOptions & NumericalType;
type NumericalAnswerOptions = TemplateOptions & Pick<NumericalType, 'choices'>;

export default function Numerical({
    title,
    stem,
    choices,
    globalFeedback
}: NumericalOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Numerical',
                title: title
            }),
            `<p style="${ParagraphStyle(state.theme)}">${TextType({
                text: stem
            })}</p>`,
            NumericalAnswers({ choices: choices }),
            GlobalFeedback({ feedback: globalFeedback })
        ]
    })}`;
}

function NumericalAnswers({ choices }: NumericalAnswerOptions): string {
    const placeholder = Array.isArray(choices)
        ? choices.map(({ text }) => Answer(text)).join(', ')
        : Answer(choices);

    return `
      <div>
          <span style="${ParagraphStyle(
              state.theme
          )}">Réponse: </span><input class="gift-input" type="text" style="${InputStyle(
        state.theme
    )}" placeholder="${placeholder}">
      </div>
      `;
}

function Answer({ type, number, range, numberLow, numberHigh }: NumericalFormat): string {
    switch (type) {
        case 'simple':
            return `${number}`;
        case 'range':
            return `${number} ± ${range}`;
        case 'high-low':
            return `${numberLow} - ${numberHigh}`;
        default:
            return ``;
    }
}
