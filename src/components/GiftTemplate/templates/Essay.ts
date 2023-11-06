import { TemplateOptions, Essay as EssayType } from './types';
import QuestionContainer from './QuestionContainer';
import Title from './Title';
import TextType from './TextType';
import GlobalFeedback from './GlobalFeedback';
import { ParagraphStyle, TextAreaStyle } from '../constants';
import { state } from '.';

type EssayOptions = TemplateOptions & EssayType;

export default function Essay({ title, stem, globalFeedback }: EssayOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Essay',
                title: title
            }),
            `<p style="${ParagraphStyle(state.theme)}">${TextType({
                text: stem
            })}</p>`,
            `<textarea class="gift-textarea" style="${TextAreaStyle(
                state.theme
            )}" placeholder="Enter your answer here..."></textarea>`,
            GlobalFeedback({ feedback: globalFeedback })
        ]
    })}`;
}
