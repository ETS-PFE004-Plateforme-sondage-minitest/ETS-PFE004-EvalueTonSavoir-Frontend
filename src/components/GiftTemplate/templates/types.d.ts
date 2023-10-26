export type Template = (options: TemplateOptions) => string;

export interface TemplateOptions {
  children?: Template | string | Array<Template | string>;
  options?: DisplayOptions;
}

export type ThemeType = "light" | "dark";

export interface DisplayOptions {
  theme: ThemeType;
  preview: boolean;
}

export type QuestionType =
  | "Description"
  | "Category"
  | "MC"
  | "Numerical"
  | "Short"
  | "Essay"
  | "TF"
  | "Matching";

export type FormatType = "moodle" | "html" | "markdown" | "plain";
export type NumericalType = "simple" | "range" | "high-low";

export interface TextFormat {
  format: FormatType;
  text: string;
}

export interface NumericalFormat {
  type: NumericalType;
  number?: number;
  range?: number;
  numberHigh?: number;
  numberLow?: number;
}

export interface Choice {
  isCorrect: boolean;
  weight: number | null;
  text: TextFormat | NumericalFormat;
  feedback: TextFormat | null;
}

export interface TextChoice extends Choice {
  text: TextFormat;
}

export interface NumericalChoice extends Choice {
  text: NumericalFormat;
}

export interface Question {
  type: QuestionType;
  title: string | null;
  stem: TextFormat;
  hasEmbeddedAnswers: boolean;
  globalFeedback: TextFormat | null;
}

export interface Description {
  type: Extract<QuestionType, "Description">;
  title: string | null;
  stem: TextFormat;
  hasEmbeddedAnswers: boolean;
}

export interface Category {
  type: Extract<QuestionType, "Category">;
  title: string;
}

export interface MultipleChoice extends Question {
  type: Extract<QuestionType, "MC">;
  choices: TextChoice[];
}

export interface ShortAnswer extends Question {
  type: Extract<QuestionType, "Short">;
  choices: TextChoice[];
}

export interface Numerical extends Question {
  type: Extract<QuestionType, "Numerical">;
  choices: NumericalChoice[] | NumericalFormat;
}

export interface Essay extends Question {
  type: Extract<QuestionType, "Essay">;
}

export interface TrueFalse extends Question {
  type: Extract<QuestionType, "TF">;
  isTrue: boolean;
  incorrectFeedback: TextFormat | null;
  correctFeedback: TextFormat | null;
}

export interface Matching extends Question {
  type: Extract<QuestionType, "Matching">;
  matchPairs: Match[];
}

export interface Match {
  subquestion: TextFormat;
  subanswer: string;
}

export type GIFTQuestion =
  | Description
  | Category
  | MultipleChoice
  | ShortAnswer
  | Numerical
  | Essay
  | TrueFalse
  | Matching;
