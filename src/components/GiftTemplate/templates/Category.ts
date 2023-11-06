import { TemplateOptions, Category as CategoryType } from './types';
import QuestionContainer from './QuestionContainer';
import Title from './Title';

type CategoryOptions = TemplateOptions & CategoryType;

export default function Category({ title }: CategoryOptions): string {
    return `${QuestionContainer({
        children: Title({
            type: 'Category',
            title: title
        })
    })}`;
}
