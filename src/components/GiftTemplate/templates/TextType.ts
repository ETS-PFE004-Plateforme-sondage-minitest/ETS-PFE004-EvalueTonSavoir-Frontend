import { marked } from 'marked';
import katex from 'katex';
import { TemplateOptions, TextFormat } from './types';

interface TextTypeOptions extends TemplateOptions {
    text: TextFormat;
}

function formatLatex(text: string): string {
    return text
        .replace(/\$\$(.*?)\$\$/g, (_, inner) => katex.renderToString(inner, { displayMode: true }))
        .replace(/\\\[(.*?)\\\]/g, (_, inner) => katex.renderToString(inner, { displayMode: true }))
        .replace(/\\\((.*?)\\\)/g, (_, inner) =>
            katex.renderToString(inner, { displayMode: false })
        );
}

function escapeHTML(text: string) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default function TextType({ text }: TextTypeOptions): string {
    const formatText = formatLatex(escapeHTML(text.text.trim()));

    switch (text.format) {
        case 'moodle':
        case 'plain':
            return formatText.replace(/(?:\r\n|\r|\n)/g, '<br>');
        case 'html':
            return formatText.replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2');
        case 'markdown':
            return (
                marked
                    .parse(formatText, { breaks: true }) // call marked.parse instead of marked
                    // Strip outer paragraph tags
                    .replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2')
            );
        default:
            return ``;
    }
}
