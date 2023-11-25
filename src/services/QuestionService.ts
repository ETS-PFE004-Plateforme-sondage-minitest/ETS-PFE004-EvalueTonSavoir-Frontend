export class QuestionService {
    static getImage(text: string) {
        const imageUrlMatch = text.match(/<img[^>]+>/i);
        if (imageUrlMatch) {
            return imageUrlMatch[0];
        }
        return '';
    }

    static ignoreImgTags(text: string): string {
        if (text.includes('<img')) {
            const imageUrlMatch = text.match(/<img[^>]+>/i);
            if (imageUrlMatch) {
                text = text.replace(imageUrlMatch[0], '');
            }
        }
        return text;
    }
}
