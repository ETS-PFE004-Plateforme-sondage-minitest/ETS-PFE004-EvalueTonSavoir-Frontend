# To run this project

First install with: `npm install`

To run the project: `npm run dev`

To run tests: `npm run test`

## Forked code for GIFT template preview

### Original code

The original code has been developed to create a VS extension to support GIFT text format.

The code can be found here: [https://codesandbox.io/s/gift-templates-iny09](https://codesandbox.io/s/gift-templates-iny09)

We decided to reuse this code because it provides a preview close to how looks like quizzes in Moodle. Which is a well-known platform at École de technologie supérieure (ÉTS).

### Related NPM packages:

In order to reuse the code, we had to install the following NPM packages:

-   [katex](https://www.npmjs.com/package/katex) : A fast, easy-to-use JavaScript library for TeX math rendering on the web.
-   [marked](https://www.npmjs.com/package/marked) : A markdown parser and compiler. Built for speed.
-   [nanoid](https://www.npmjs.com/package/nanoid) : A tiny (108 bytes), secure, URL-friendly, unique string ID generator for JavaScript.
-   [gift-pegjs](https://www.npmjs.com/package/gift-pegjs) : A GIFT parser for JavaScript using PEG.js.
-   [@types/katex](https://www.npmjs.com/package/@types/katex) : TypeScript definitions for katex.
-   [@types/marked](https://www.npmjs.com/package/@types/marked) : TypeScript definitions for marked.
-   [@types/nanoid](https://www.npmjs.com/package/@types/nanoid) : TypeScript definitions for nanoid.

### Modifications

-   Error.ts: changed 2 let `document` and `newText` into const. (es-lint)
-   GlobalFeedback.ts: removed unused import of `TextFormat`. (es-lint)
-   Matching.ts: removed unused import of `Match`. (es-lint)
-   TextType.ts: replaced the `marked` call by `marked.parse` and fixed SyntaxError: ambiguous indirect export: default for `{ marked }`.

-   Put `Template` and `ErrorTemplate` functions apart from index.ts to dedicated `.ts` files.
