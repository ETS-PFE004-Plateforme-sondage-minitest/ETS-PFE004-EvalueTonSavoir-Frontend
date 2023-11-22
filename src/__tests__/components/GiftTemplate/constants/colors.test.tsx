import { colors } from "../../../../components/GiftTemplate/constants";
const validHSLRegex = /^hsl\(\d+(,\s*\d+%){2}\)$/;

describe('Colors object', () => {
    test.each(Object.entries(colors))('color %s is a valid HSL value', (_, color) => {
        expect(color).toMatch(validHSLRegex);
    });
});