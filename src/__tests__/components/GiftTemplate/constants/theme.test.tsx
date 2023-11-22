import '@testing-library/jest-dom';
import { theme } from '../../../../components/GiftTemplate/constants/theme';
import { colors } from '../../../../components/GiftTemplate/constants/colors';

describe('Theme', () => {
  test('returns correct light color', () => {
    const lightColor = theme('light', 'gray500', 'black500');
    expect(lightColor).toBe(colors.gray500);
  });

  test('returns correct dark color', () => {
    const darkColor = theme('dark', 'gray500', 'black500');
    expect(darkColor).toBe(colors.black500);
  });

});
