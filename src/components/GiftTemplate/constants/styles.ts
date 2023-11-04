import { ThemeType } from '../templates/types';
import { theme } from './theme';

export const ParagraphStyle = (t: ThemeType) => `
  color: ${theme(t, 'black900', 'gray200')};
`;

export const TextAreaStyle = (t: ThemeType) => `
  width: 100%;
  height: 7rem;
  line-height: 1.5;
  color: ${theme(t, 'black500', 'gray200')};
  background-color: ${theme(t, 'white', 'black300')};
  border: ${t === 'light' ? 1 : 1.5}px solid ${theme(t, 'gray300', 'gray900')};
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  padding: 0.5rem;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
`;

export const SelectStyle = (t: ThemeType) => `
  display: inline-block;
  box-sizing: border-box;
  align-items: center;
  white-space: pre;
  cursor: default;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  text-transform: none;
  min-width: 8rem;
  line-height: 1.5;
  color: ${theme(t, 'black500', 'gray200')};
  background-color: ${theme(t, 'white', 'black300')};
  border: ${t === 'light' ? 1 : 1.5}px solid ${theme(t, 'gray300', 'gray900')};
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
`;

export const InputStyle = (t: ThemeType) => `
  display: inline-block;
  padding: 0.375rem 0.75rem;
  line-height: 1.5;
  color: ${theme(t, 'black500', 'gray200')};
  background-color: ${theme(t, 'white', 'black300')};
  border: ${t === 'light' ? 1 : 2}px solid ${theme(t, 'gray300', 'gray900')};
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
`;
