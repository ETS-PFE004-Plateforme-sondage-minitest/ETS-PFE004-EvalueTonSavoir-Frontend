import { TemplateOptions, ShortAnswer as ShortAnswerType, TextFormat } from './types';
import QuestionContainer from './QuestionContainer';
import Title from './Title';
import TextType from './TextType';
import GlobalFeedback from './GlobalFeedback';
import { ParagraphStyle, InputStyle } from '../constants';
import { state } from './index';

type ShortAnswerOptions = TemplateOptions & ShortAnswerType;
type AnswerOptions = TemplateOptions & Pick<ShortAnswerType, 'choices'>;

export default function ShortAnswer({
    title,
    stem,
    choices,
    globalFeedback
}: ShortAnswerOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Réponse courte',
                title: title
            }),
            `<p style="${ParagraphStyle(state.theme)}">${TextType({
                text: stem
            })}</p>`,
            Answers({ choices: choices }),
            GlobalFeedback({ feedback: globalFeedback })
        ]
    })}`;
}

function Answers({ choices }: AnswerOptions): string {
    const placeholder = choices
        .map(({ text }) => TextType({ text: text as TextFormat }))
        .join(', ');
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
