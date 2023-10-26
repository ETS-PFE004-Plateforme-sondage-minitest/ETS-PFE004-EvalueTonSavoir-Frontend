import { theme, ParagraphStyle } from "../constants";
import { state } from ".";

export default function(text: string): string {
  const Container = `
    flex-wrap: wrap;
    position: relative;
    padding: 1rem 1rem;
    margin-bottom: 0.5rem;
    background-color: ${theme(state.theme, "red100", "redGray800")};
    border: solid ${theme(state.theme, "red300", "red700")} 2px;
    border-radius: 6px;
    box-shadow: 0px 1px 3px ${theme(state.theme, "gray400", "black900")};
  `;

  const document = removeBackslash(lineRegex(documentRegex(text))).split(/\r?\n/);
  return document[0] !== ``
    ? `<section style="${Container}">${document
        .map(i => `<p style="${ParagraphStyle(state.theme)}">${i}</p>`)
        .join("")}</section>`
    : ``;
}

function documentRegex(text: string): string {
  const newText = text
    .split(/\r?\n/)
    .map(comment => comment.replace(/(^[ \\t]+)?(^)((\/\/))(.*)/gm, ""))
    .join("");

  const newLineAnswer = /([^\\]|[^\S\r\n][^=])(=|~)/g;
  const correctAnswer = /([^\\]|^{)(([^\\]|^|\\s*)=(.*)(?=[=~}]|\\n))/g;
  const incorrectAnswer = /([^\\]|^{)(([^\\]|^|\\s*)~(.*)(?=[=~}]|\\n))/g;

  return newText
    .replace(newLineAnswer, `\n$2`)
    .replace(correctAnswer, `$1<li>$4</li>`)
    .replace(incorrectAnswer, `$1<li>$4</li>`);
}

function lineRegex(text: string): string {
  return text
    .split(/\r?\n/)
    .map(category =>
      category.replace(
        /(^[ \\t]+)?(((^|\n)\s*[$]CATEGORY:))(.+)/g,
        `<br><b>$5</b><br>`
      )
    )
    .map(title => title.replace(/\s*(::)\s*(.*?)(::)/g, `<br><b>$2</b><br>`))
    .map(openBracket => openBracket.replace(/([^\\]|^){([#])?/g, `$1<br>`))
    .map(closeBracket => closeBracket.replace(/([^\\]|^)}/g, `$1<br>`))
    .join("");
}

function removeBackslash(text: string): string {
  return text
    .split(/\r?\n/)
    .map(colon => colon.replace(/[\\]:/g, ":"))
    .map(openBracket => openBracket.replace(/[\\]{/g, "{"))
    .map(closeBracket => closeBracket.replace(/[\\]}/g, "}"))
    .join("");
}
