import { TemplateOptions, TextChoice, TrueFalse as TrueFalseType } from './types';
import QuestionContainer from './QuestionContainer';
import TextType from './TextType';
import GlobalFeedback from './GlobalFeedback';
import MultipleChoiceAnswers from './MultipleChoiceAnswers';
import Title from './Title';
import { ParagraphStyle } from '../constants';
import { state } from '.';

type TrueFalseOptions = TemplateOptions & TrueFalseType;

export default function TrueFalse({
    title,
    isTrue,
    stem,
    correctFeedback,
    incorrectFeedback,
    globalFeedback
}: TrueFalseOptions): string {
    const choices: TextChoice[] = [
        {
            text: {
                format: 'moodle',
                text: 'True'
            },
            isCorrect: isTrue,
            weight: null,
            feedback: isTrue ? correctFeedback : incorrectFeedback
        },
        {
            text: {
                format: 'moodle',
                text: 'False'
            },
            isCorrect: !isTrue,
            weight: null,
            feedback: !isTrue ? correctFeedback : incorrectFeedback
        }
    ];

    return `${QuestionContainer({
        children: [
            Title({
                type: 'Multiple Choice',
                title: title
            }),
            `<p style="${ParagraphStyle(state.theme)}">${TextType({
                text: stem
            })}</p>`,
            MultipleChoiceAnswers({ choices: choices }),
            GlobalFeedback({ feedback: globalFeedback })
        ]
    })}`;
}
