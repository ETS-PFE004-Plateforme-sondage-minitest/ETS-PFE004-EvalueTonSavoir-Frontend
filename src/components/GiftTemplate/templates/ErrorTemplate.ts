import Error from "./Error";
import { DisplayOptions } from "./types";

// export const state: DisplayOptions = { preview: true, theme: "light" };

export default function ErrorTemplate(
    text: string,
    state: DisplayOptions,
    options?: Partial<DisplayOptions>
): string {
    Object.assign(state, options);

    return Error(text);
}