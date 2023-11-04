import Template, { ErrorTemplate } from './templates';
import { GIFTQuestion } from './templates/types';
import './styles.css';

const multiple: GIFTQuestion[] = [
    {
        type: 'MC',
        title: null,
        stem: { format: 'markdown', text: "Who's buried in Grant's \r\n tomb?" },
        hasEmbeddedAnswers: false,
        globalFeedback: {
            format: 'moodle',
            text: 'Not sure? There are many answers for this question so do not fret. Not sure? There are many answers for this question so do not fret.'
        },
        choices: [
            {
                isCorrect: false,
                weight: -50,
                text: { format: 'moodle', text: 'Grant' },
                feedback: null
            },
            {
                isCorrect: true,
                weight: 50,
                text: { format: 'moodle', text: 'Jefferson' },
                feedback: null
            },
            {
                isCorrect: true,
                weight: 50,
                text: { format: 'moodle', text: 'no one' },
                feedback: null
            }
        ]
    },
    {
        type: 'MC',
        title: null,
        stem: { format: 'moodle', text: "Grant is _____ in Grant's tomb." },
        hasEmbeddedAnswers: true,
        globalFeedback: null,
        choices: [
            {
                isCorrect: true,
                weight: null,
                text: { format: 'moodle', text: 'buried' },
                feedback: null
            },
            {
                isCorrect: true,
                weight: null,
                text: { format: 'moodle', text: 'entombed' },
                feedback: null
            },
            {
                isCorrect: false,
                weight: null,
                text: { format: 'moodle', text: 'living' },
                feedback: null
            }
        ]
    },
    {
        type: 'TF',
        title: null,
        stem: { format: 'moodle', text: "Grant is buried in Grant's tomb." },
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        isTrue: false,
        incorrectFeedback: null,
        correctFeedback: null
    },
    {
        type: 'Short',
        title: null,
        stem: { format: 'moodle', text: "Who's buried in Grant's tomb?" },
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        choices: [
            {
                isCorrect: true,
                weight: null,
                text: { format: 'moodle', text: 'no one " has got me' },
                feedback: null
            },
            {
                isCorrect: true,
                weight: null,
                text: { format: 'moodle', text: 'nobody' },
                feedback: null
            }
        ]
    },
    {
        type: 'Numerical',
        title: null,
        stem: { format: 'moodle', text: 'When was Ulysses S. Grant born?' },
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        choices: {
            type: 'range',
            number: 1822,
            range: 5
        }
    },
    {
        type: 'Matching',
        title: null,
        stem: {
            format: 'moodle',
            text: 'Match the following countries with their corresponding capitals.'
        },
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        matchPairs: [
            {
                subquestion: { format: 'moodle', text: 'Canada' },
                subanswer: 'Ottawa'
            },
            {
                subquestion: { format: 'moodle', text: 'Italy' },
                subanswer: 'Rome'
            },
            {
                subquestion: { format: 'moodle', text: 'Japan' },
                subanswer: 'Tokyo'
            }
        ]
    },
    {
        type: 'MC',
        title: "Grant's Tomb",
        stem: { format: 'moodle', text: "Grant is _____ in Grant's tomb." },
        hasEmbeddedAnswers: true,
        globalFeedback: null,
        choices: [
            {
                isCorrect: false,
                weight: null,
                text: { format: 'moodle', text: 'buried' },
                feedback: { format: 'moodle', text: 'No one is buried there.' }
            },
            {
                isCorrect: true,
                weight: null,
                text: { format: 'moodle', text: 'entombed' },
                feedback: { format: 'moodle', text: 'Right answer!' }
            },
            {
                isCorrect: false,
                weight: null,
                text: { format: 'moodle', text: 'living' },
                feedback: { format: 'moodle', text: 'We hope not!' }
            }
        ]
    },
    {
        type: 'MC',
        title: null,
        stem: { format: 'moodle', text: 'Difficult multiple choice question.' },
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        choices: [
            {
                isCorrect: false,
                weight: null,
                text: { format: 'moodle', text: 'wrong answer' },
                feedback: { format: 'moodle', text: 'comment on wrong answer' }
            },
            {
                isCorrect: false,
                weight: 50,
                text: { format: 'moodle', text: 'half credit answer' },
                feedback: { format: 'moodle', text: 'comment on answer' }
            },
            {
                isCorrect: true,
                weight: null,
                text: { format: 'moodle', text: 'full credit answer' },
                feedback: { format: 'moodle', text: 'well done!' }
            }
        ]
    },
    {
        type: 'Short',
        title: "Jesus' hometown (Short answer ex.)",
        stem: { format: 'moodle', text: 'Jesus Christ was from _____ .' },
        hasEmbeddedAnswers: true,
        globalFeedback: null,
        choices: [
            {
                isCorrect: true,
                weight: null,
                text: { format: 'moodle', text: 'Nazareth' },
                feedback: { format: 'moodle', text: "Yes! That's right!" }
            },
            {
                isCorrect: true,
                weight: 75,
                text: { format: 'moodle', text: 'Nazereth' },
                feedback: { format: 'moodle', text: 'Right, but misspelled.' }
            },
            {
                isCorrect: true,
                weight: 25,
                text: { format: 'moodle', text: 'Bethlehem' },
                feedback: {
                    format: 'moodle',
                    text: 'He was born here, but not raised here.'
                }
            }
        ]
    },
    {
        type: 'Numerical',
        title: 'Numerical example',
        stem: { format: 'moodle', text: 'When was Ulysses S. Grant born?' },
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        choices: [
            {
                isCorrect: true,
                weight: null,
                text: {
                    type: 'range',
                    number: 1822,
                    range: 0
                },
                feedback: { format: 'moodle', text: 'Correct! 100% credit' }
            },
            {
                isCorrect: true,
                weight: 50,
                text: {
                    type: 'range',
                    number: 1822,
                    range: 2
                },
                feedback: {
                    format: 'moodle',
                    text: 'He was born in 1822. You get 50% credit for being close.'
                }
            }
        ]
    },
    {
        type: 'Essay',
        title: 'Essay Example',
        stem: { format: 'moodle', text: 'This is an essay.' },
        hasEmbeddedAnswers: false,
        globalFeedback: null
    }
];

const items = multiple.map((item) => Template(item, { theme: 'dark' })).join('');
const errorItemDark = ErrorTemplate('Hello');

const lightItems = multiple.map((item) => Template(item, { theme: 'light' })).join('');

const errorItem = ErrorTemplate('Hello');

document.getElementById('app').innerHTML = items + errorItemDark + lightItems + errorItem;
