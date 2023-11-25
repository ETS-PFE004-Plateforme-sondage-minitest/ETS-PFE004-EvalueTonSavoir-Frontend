export class QuestionService {
    static getImage(text: string) {
        const imageUrlMatch = text.match(/<img[^>]+>/i);
        if (imageUrlMatch) {
            return imageUrlMatch[0];
        }
        return '';
    }

    static getImageSource = (text: string): string => {
        let imageUrl = text.replace('<img ', '');
        imageUrl = imageUrl.replace('>', '');

        return imageUrl;
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
