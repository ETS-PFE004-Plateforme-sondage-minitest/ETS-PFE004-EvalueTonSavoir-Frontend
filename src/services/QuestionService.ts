export class QuestionService {
    static getImage(text: string) {
        const imageUrlMatch = text.match(/<img[^>]+>/i);
        if (imageUrlMatch) {
            return imageUrlMatch[0];
        }
        return '';
    }

    static getImageSource = (text: string): string => {
        const regex = /img([^"]*)/;
        const match = regex.exec(text);
        if (match) {
            return match[1];
        }
        return '';
    };

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
