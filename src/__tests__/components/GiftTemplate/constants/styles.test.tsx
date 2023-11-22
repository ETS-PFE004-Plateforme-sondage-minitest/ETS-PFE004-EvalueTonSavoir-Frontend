//styles.test.tsx
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ParagraphStyle } from '../../../../components/GiftTemplate/constants';

describe('ParagraphStyle', () => {
    test('applies styles correctly', () => {
        const theme = 'light';
        const paragraphText = 'Test paragraph';

        const styles = ParagraphStyle(theme);

        const { container } = render(
            <p style={convertStylesToObject(styles)}>{paragraphText}</p>
        );

        const paragraphElement = container.firstChild;

        expect(paragraphElement).toHaveStyle(`color: rgb(0, 0, 0);`);
    });
});


function convertStylesToObject(styles: string): React.CSSProperties {
    const styleObject: React.CSSProperties = {};
    styles.split(';').forEach((style) => {
        const [property, value] = style.split(':');
        if (property && value) {
            (styleObject as any)[property.trim()] = value.trim();
        }
    });
    return styleObject;
}
