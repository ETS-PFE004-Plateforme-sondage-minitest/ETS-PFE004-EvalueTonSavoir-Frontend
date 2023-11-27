//color.test.tsx
import { colors } from "../../../../components/GiftTemplate/constants";

describe('Colors object', () => {
    test('All colors are defined', () => {
        expect(colors.red100).toBeDefined();
        expect(colors.red300).toBeDefined();
        expect(colors.red700).toBeDefined();
        expect(colors.redGray800).toBeDefined();
        expect(colors.beige100).toBeDefined();
        expect(colors.beige300).toBeDefined();
        expect(colors.beige400).toBeDefined();
        expect(colors.beige500).toBeDefined();
        expect(colors.beige600).toBeDefined();
        expect(colors.beige900).toBeDefined();
        expect(colors.beigeGray800).toBeDefined();
        expect(colors.green100).toBeDefined();
        expect(colors.green300).toBeDefined();
        expect(colors.green400).toBeDefined();
        expect(colors.green500).toBeDefined();
        expect(colors.green600).toBeDefined();
        expect(colors.green700).toBeDefined();
        expect(colors.greenGray500).toBeDefined();
        expect(colors.greenGray600).toBeDefined();
        expect(colors.greenGray700).toBeDefined();
        expect(colors.teal400).toBeDefined();
        expect(colors.teal500).toBeDefined();
        expect(colors.teal600).toBeDefined();
        expect(colors.teal700).toBeDefined();
        expect(colors.blue).toBe('#5271FF');
        expect(colors.success).toBe('hsl(120, 39%, 54%)');
        expect(colors.danger).toBe('hsl(2, 64%, 58%)');
        expect(colors.white).toBe('hsl(0, 0%, 100%)');
      });
});